import { ContainerInstance } from 'typedi'
import GitHub from '../infrastructure/GitHub.server'
import IContentBackend from './IContentBackend'
import DataCache from '../infrastructure/DataCache'

const mediaCacheSymbol = Symbol()

export default class GitHubContentBackend implements IContentBackend {
  private _github: GitHub
  private _textCache: DataCache<Buffer>
  private _listCache: DataCache<Set<string>>

  public constructor({
    container,
  }: {
    container: ContainerInstance,
  }) {
    this._github = container.get(GitHub)
    this._textCache = new DataCache({ ttl: 60 })
    this._listCache = new DataCache({ ttl: 60 })
  }

  private _checkName(name: string) {
    if (name.includes('/')) throw Error('Subdirectories not allowed')
    if (name === '') throw Error('Empty names are not allowed')
  }

  async getTextFile({
    bucket,
    filename,
    exclude,
  }: {
    bucket: string,
    filename: string,
    exclude: Array<string>,
  }) {
    this._checkName(bucket)
    this._checkName(filename)

    const path = `content/${bucket}/${filename}`

    const cached = this._textCache.get(path)
    if (cached) {
      const data = JSON.parse(cached.toString('utf-8'))
      exclude.forEach((key) => delete data[key])
      return data
    }

    const buffer = await this._github.getFileContent({ path })
    if (buffer === null) return null

    this._textCache.put(path, buffer)

    const data = JSON.parse(buffer.toString('utf-8'))
    exclude.forEach((key) => delete data[key])
    return data
  }

  async saveTextFile({
    bucket,
    filename,
    content,
  }: {
    bucket: string,
    filename: string,
    content: string
  }): Promise<void> {
    this._checkName(bucket)
    this._checkName(filename)

    const path = `content/${bucket}/${filename}`
    const contentBuffer = Buffer.from(content, 'utf-8')
    await this._github.createOrUpdateFileContent({
      path,
      content: contentBuffer,
      message: `Updated ${path} via GitHub backend`,
    })

    this._textCache.put(path, contentBuffer)
    this._listCache.update(bucket, (cache) => {
      cache.add(filename)
      return cache
    })
  }

  async renameAndSaveTextFile({
    bucket,
    oldFilename,
    newFilename,
    content
  }: {
    bucket: string,
    oldFilename: string,
    newFilename: string,
    content: string
  }): Promise<void> {
    this._checkName(bucket)
    this._checkName(oldFilename)
    this._checkName(newFilename)

    const oldPath = `content/${bucket}/${oldFilename}`
    const newPath = `content/${bucket}/${newFilename}`
    await this._github.modifyTree({
      message: `Updated ${oldPath} to ${newPath} via GitHub backend`,
      modify: (tree) => {
        return tree
          .filter((entry) => entry.type === 'blob')
          .map((entry) => {
            if (entry.path !== oldPath) return entry
            return {
              path: newPath,
              content,
              mode: '100644',
              type: 'blob',
            }
          })
      }
    })

    this._textCache.delete(oldPath)
    this._textCache.put(newPath, Buffer.from(content, 'utf-8'))
    this._listCache.update(bucket, (cache) => {
      cache.add(newPath)
      cache.delete(oldPath)
      return cache
    })
  }

  async listTextBucket({
    bucket,
  }: {
    bucket: string,
  }): Promise<Array<string>> {
    this._checkName(bucket)

    const cached = this._listCache.get(bucket)
    if (cached) return [...cached]
    const path = `content/${bucket}`
    const results = await this._github.listFilesInDirectory({ path })
    this._listCache.put(bucket, new Set(results))
    return results
  }

  async deleteTextFile({
    bucket,
    filename,
  }: {
    bucket: string,
    filename: string
  }): Promise<void> {
    this._checkName(bucket)
    this._checkName(filename)

    const path = `content/${bucket}/${filename}`
    await this._github.deleteFile({
      path,
      message: `Deleted ${path} via GitHub backend`
    })
    this._textCache.delete(path)
    this._listCache.update(bucket, (cache) => {
      cache.delete(filename)
      return cache
    })
  }

  async listMedia(): Promise<Array<string>> {
    const path = 'public/media'
    const cached = this._listCache.get(mediaCacheSymbol)
    if (cached) return [...cached]

    const results = await this._github.listFilesInDirectory({ path })
    this._listCache.put(mediaCacheSymbol, new Set(results))
    return results
  }

  async uploadMedia({
    filename,
    content,
  }: {
    filename: string,
    content: ArrayBuffer,
  }): Promise<void> {
    this._checkName(filename)

    const path = `public/media/${filename}`
    await this._github.createOrUpdateFileContent({
      path,
      content: Buffer.from(content),
      message: `Uploaded ${path} via GitHub backend`,
    })
    this._listCache.update(mediaCacheSymbol, (cache) => {
      cache.add(filename)
      return cache
    })
  }

  async deleteMedia({
    filename,
  }: {
    filename: string,
  }): Promise<void> {
    this._checkName(filename)

    const path = `public/media/${filename}`
    await this._github.deleteFile({
      path,
      message: `Deleted ${path} via GitHub backend`
    })
    this._listCache.update(mediaCacheSymbol, (cache) => {
      cache.delete(filename)
      return cache
    })
  }

  async getMediaPreviewEndpoint(): Promise<string> {
    return this._github.getDownloadUrl({ path: '' })
  }
}
