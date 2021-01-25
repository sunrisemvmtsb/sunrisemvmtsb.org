import { ContainerInstance } from 'typedi'
import NewsPost from '../domain/NewsPost'

import StorageService from '../services/StorageService.client'
import NewsService from '../services/NewsService'

class UpdateNewsPost {
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

  async exec(post: NewsPost): Promise<void> {
    await this._news.saveNewsPost(post)
    await this._storage.removeNewsPost(post)
  }
}

export default UpdateNewsPost
