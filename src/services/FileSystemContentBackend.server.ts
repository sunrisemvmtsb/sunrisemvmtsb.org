import IContentBackend from './IContentBackend'
import fs from 'fs'
import path from 'path'
import glob from 'glob'
import mkdirp from 'mkdirp'

export default class FileSystemContentBackend implements IContentBackend {
  async getTextFile({
    bucket,
    filename,
    exclude,
  }: {
    bucket: string,
    filename: string,
    exclude: Array<string>,
  }) {
    if (filename.includes('/') || bucket.includes('/')) throw Error('Subdirectories not allowed')
    const path = `content/${bucket}/${filename}`
    if (!fs.existsSync(path)) return null
    const string = fs.readFileSync(path, 'utf-8')
    const data = JSON.parse(string)
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
    if (filename.includes('/') || bucket.includes('/')) throw Error('Subdirectories not allowed')
    const path = `content/${bucket}/${filename}`
    fs.writeFileSync(path, content, { encoding: 'utf-8' })
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
    if (oldFilename.includes('/') || newFilename.includes('/') || bucket.includes('/')) throw Error('Subdirectories not allowed')

    const oldPath = `content/${bucket}/${oldFilename}`
    const newPath = `content/${bucket}/${newFilename}`
    fs.renameSync(oldPath, newPath)
    fs.writeFileSync(newPath, content, { encoding: 'utf-8' })
  }

  async listTextBucket({
    bucket,
  }: {
    bucket: string,
  }): Promise<Array<string>> {
    if (bucket.includes('/')) throw Error('Subdirectories not allowed')
    return glob.sync(`content/${bucket}/*`).map((p) => path.basename(p))
  }

  async deleteTextFile({
    bucket,
    filename,
  }: {
    bucket: string,
    filename: string
  }): Promise<void> {
    if (filename.includes('/') || bucket.includes('/')) throw Error('Subdirectories not allowed')
    const path = `content/${bucket}/${filename}`
    fs.rmSync(path)
  }

  async listMedia(): Promise<Array<string>> {
    return glob.sync('public/media/*').map((p) => p.replace('public/media/', ''))
  }

  async uploadMedia({
    filename,
    content,
  }: {
    filename: string,
    content: ArrayBuffer,
  }): Promise<void> {
    if (filename.includes('/')) throw Error('Subdirectories not allowed')
    const path = `public/media/${filename}`
    fs.writeFileSync(path, new Uint8Array(content))
  }

  async deleteMedia({
    filename,
  }: {
    filename: string,
  }): Promise<void> {
    if (filename.includes('/')) throw Error('Subdirectories not allowed')
    const path = `public/media/${filename}`
    fs.rmSync(path)
  }

  async getMediaPreviewEndpoint(): Promise<string> {
    return '/media/'
  }
}
