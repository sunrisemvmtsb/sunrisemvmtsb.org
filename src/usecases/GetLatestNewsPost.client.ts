import { ContainerInstance } from 'typedi'

import NewsPost from '../domain/NewsPost'

import StorageService from '../services/StorageService.client'
import NewsService from '../services/NewsService'

class GetLatestNewsPost {
  private _news: NewsService
  private _storage: StorageService

  constructor({
    container
  }: {
    container: ContainerInstance
  }) {
    this._news = container.get(NewsService)
    this._storage = container.get(StorageService)
  }

  async exec(slug: string): Promise<NewsPost | null> {
    const local = await this._storage.getNewsPost(slug)
    if (local) return local
    return this._news.getNewsPost(slug)
  }
}

export default GetLatestNewsPost
