import {
  MediaStore,
  MediaUploadOptions,
  Media,
  MediaListOptions,
  MediaList,
} from '@tinacms/core'

import ContentService from '../services/ContentService'

export default class ContentMediaStorePlugin implements MediaStore {
  accept = '*/*'

  private _constructFilename(directory: string, filename: string) {
    return directory === '/' || !directory ?
      filename :
      directory.slice(1) + '/' + filename
  }

  async persist(files: MediaUploadOptions[]): Promise<Media[]> {
    const uploaded: Media[] = []

    for (const { file, directory } of files) {
      const filename = this._constructFilename(directory, file.name)
      const data = await file.arrayBuffer()

      try {
        const result = await ContentService.instance.saveMedia(filename, data)
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
    const result = src === '/images/placeholder.svg' ?
      src :
      ContentService.instance.getMediaPreviewUrl(src)
    return result
  }

  async list(options?: MediaListOptions): Promise<MediaList> {
    const directory = options?.directory ?? ''
    const limit = options?.limit ?? 50
    const offset = options?.offset ?? 0

    const allEntries = await ContentService.instance.listMedia(directory)
    const totalCount = allEntries.length
    const output = {
      items: await Promise.all(allEntries
        .slice(offset, offset + limit)
        .map(async (media) => ({
          ...media,
          previewSrc: media.type === 'file' ? await this.previewSrc(media.id) : undefined,
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
    console.log(this._constructFilename(media.directory, media.filename))
    await ContentService.instance.deleteMedia(this._constructFilename(media.directory, media.filename))
  }

  private _nextOffset(offset: number, limit: number, count: number) {
    if (offset + limit < count) return offset + limit
    return undefined
  }
}
