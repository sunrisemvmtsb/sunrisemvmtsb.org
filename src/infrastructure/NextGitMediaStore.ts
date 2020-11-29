import path from 'path'
import { GitMediaStore } from '@tinacms/git-client'
import { Media, MediaListOptions, MediaUploadOptions } from '@tinacms/core'

export default class NextGithubMediaStore extends GitMediaStore {
  previewSrc(fieldValue: string) {
    return super.previewSrc(path.join('media', fieldValue))
  }

  list(options: MediaListOptions) {
    return super
      .list({
        ...options,
        directory: path.join('public/media', options.directory || ''),
      })
      .then(list => {
        return {
          ...list,
          items: normalizeMediaItems(list.items),
        }
      })
  }

  persist(files: MediaUploadOptions[]) {
    return super
      .persist(
        files.map(file => {
          return {
            ...file,
            directory: path.join('public/media', file.directory),
          }
        })
      )
      .then(normalizeMediaItems)
  }

  delete(media: Media) {
    return super.delete({
      ...media,
      directory: path.join('public/media', media.directory),
    })
  }
}

function normalizeMediaItems(items: Media[]) {
  return items.map(item => {
    return {
      ...item,
      directory: item.directory.replace('public/media', ''),
      id: item.id.replace('public/media', ''),
    }
  })
}
