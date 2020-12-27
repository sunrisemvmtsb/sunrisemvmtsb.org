import {
  MediaStore,
  MediaUploadOptions,
  Media,
  MediaListOptions,
  MediaList,
} from '@tinacms/core'
import GitClient from './CustomGitClient'

export default class GitMediaStore implements MediaStore {
  accept = '*'

  constructor(private client: GitClient) { }

  async persist(files: MediaUploadOptions[]): Promise<Media[]> {
    const uploaded: Media[] = []

    for (const { file, directory } of files) {
      const result = await this.client.writeMediaToDisk({
        directory,
        content: file,
      })

      if ('status' in result) {
        continue
      }

      uploaded.push({
        id: result.filename,
        type: 'file',
        directory,
        filename: result.filename,
      })
    }

    return uploaded
  }

  async previewSrc(src: string) {
    return src
  }

  async list(options?: MediaListOptions): Promise<MediaList> {
    const directory = options?.directory ?? ''
    const offset = options?.offset ?? 0
    const limit = options?.limit ?? 50

    const result = await this.client.getFile(directory)

    if (result.status === 'error') {
      throw Error(result.message)
    }


    return {
      items: await Promise.all(result.file.content.slice(offset, offset + limit).map(async (media: Media) => ({
        ...media,
        previewSrc:
          media.type === 'file' ? await this.previewSrc(media.id) : undefined,
      }))),
      totalCount: result.file.content.length,
      offset,
      limit,
      nextOffset: nextOffset(offset, limit, result.file.content.length),
    }
  }

  async delete(media: Media): Promise<void> {
    await this.client.deleteFromDisk({
      relPath: media.id,
    })
  }
}

const nextOffset = (offset: number, limit: number, count: number) => {
  if (offset + limit < count) return offset + limit
  return undefined
}
