import type {
  MediaStore,
  MediaUploadOptions,
  Media,
  MediaListOptions,
  MediaList,
} from '@tinacms/core'

import container from '../infrastructure/Container.client'
import IContentBackend from '../services/IContentBackend'

export default class ContentMediaStorePlugin implements MediaStore {
  public readonly accept: string
  private readonly _backend: IContentBackend
  private _previewEndpoint: string | null

  constructor() {
    this.accept = '*/*'
    this._backend = container.get(IContentBackend)
    this._previewEndpoint = null
  }

  async persist(files: MediaUploadOptions[]): Promise<Media[]> {
    const uploaded: Media[] = []

    for (const { file, directory } of files) {
      if (directory) throw Error('directories not supported')

      const filename = file.name
      const content = await file.arrayBuffer()

      try {
        const result = await this._backend.uploadMedia({
          filename,
          content,
        })

        uploaded.push({
          id: filename,
          type: 'file',
          directory,
          filename: file.name,
        })
      } catch { }
    }

    return uploaded
  }

  async previewSrc(src: string) {
    if (src === '/images/placeholder.svg') return '/images/placeholder.svg'

    if (!this._previewEndpoint) {
      try {
        this._previewEndpoint = await this._backend.getMediaPreviewEndpoint()
      } catch (error) {
        console.error(error)
      }
    }

    return this._previewEndpoint + src.slice(1)
  }

  async list(options?: MediaListOptions): Promise<MediaList> {
    const directory = options?.directory ?? ''
    const limit = options?.limit ?? 50
    const offset = options?.offset ?? 0

    if (options?.directory) {
      return { items: [], offset, limit, totalCount: 0 }
    }

    const allEntries = await this._backend.listMedia()
    const totalCount = allEntries.length
    const output = {
      items: await Promise.all(allEntries
        .slice(offset, offset + limit)
        .map(async (filename) => ({
          type: 'file' as const,
          id: filename,
          filename,
          directory: '',
          previewSrc: await this.previewSrc('/' + filename),
        }))),
      offset,
      limit,
      totalCount,
      nextOffset: this._nextOffset(offset, limit, totalCount),
    }

    return output
  }

  async delete(media: Media): Promise<void> {
    if (media.type === 'dir') return
    console.log(media.directory, media.filename)
    // await ContentService.instance.deleteMedia(this._constructFilename(media.directory, media.filename))
  }

  private _nextOffset(offset: number, limit: number, count: number) {
    if (offset + limit < count) return offset + limit
    return undefined
  }
}
