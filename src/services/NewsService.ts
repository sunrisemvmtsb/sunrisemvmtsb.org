import { ContainerInstance } from 'typedi'
import IContentBackend from './IContentBackend'
import NewsPost from '../domain/NewsPost'
import NewsSummary from '../domain/NewsSummary'

class NewsService {
  private _backend: IContentBackend

  constructor({
    container,
  }: {
    container: ContainerInstance,
  }) {
    this._backend = container.get(IContentBackend)
  }

  async listNewsSummaries(): Promise<Array<NewsSummary>> {
    const filenames = await this._backend.listTextBucket({ bucket: 'news' })
    const files = await Promise.all(filenames.map((filename) => {
      return this._backend.getTextFile({
        bucket: 'news',
        filename,
        exclude: ['content']
      }).then((data) => [filename, data] as [string, Record<string, any> | null])
    }))

    return files
      .filter(([, file]) => file !== null)
      .map(([filename, file]) => ({
        image: file!.image,
        tags: file!.tags,
        title: file!.title,
        subtitle: file!.subtitle,
        author: file!.author,
        published: file!.published,
        url: '/news/' + filename.replace('.json', ''),
        slug: filename.replace('.json', ''),
      }))
  }

  async getNewsPost(slug: string): Promise<NewsPost | null> {
    try {
      const file = await this._backend.getTextFile({
        bucket: 'news',
        filename: `${slug}.json`,
        exclude: [],
      })
      if (!file) return null
      return { ...file as NewsPost, slug }
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async saveNewsPost(post: NewsPost): Promise<void> {
    await this._backend.saveTextFile({
      bucket: 'news',
      filename: `${post.slug}.json`,
      content: JSON.stringify(post, null, 2)
    })
  }
}

namespace NewsService {
  export class UnauthenticatedError extends Error { }
}

export default NewsService
