import path from 'path'
import CustomGitMediaStore from './CustomGitMediaStore'
import { Media, MediaListOptions, MediaUploadOptions } from '@tinacms/core'

export default class NextGitMediaStore extends CustomGitMediaStore {
  async previewSrc(fieldValue: string) {
    if (fieldValue === '/images/placeholder.svg') return fieldValue
    return super.previewSrc(path.join('/media', fieldValue))
  }

  list(options: MediaListOptions) {
    return super
      .list({
        ...options,
        directory: path.join('public/media', options.directory || ''),
      })
      .then(list => {
        const items = normalizeMediaItems(list.items)
        return {
          ...list,
          items: items,
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
      previewSrc: item.previewSrc?.replace('public/media/', ''),
      id: item.id.replace('public/media', ''),
    }
  })
}
