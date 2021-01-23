import type { TinaCMS, Field, AddContentPlugin } from 'tinacms'
import { FORM_ERROR } from 'final-form'

import NewsPost from '../domain/NewsPost'
import AdjustableImage from '../domain/AdjustableImage'
import container from '../infrastructure/Container.client'
import StorageService from '../services/StorageService.client'
import NewsService from '../services/NewsService'

type Fields = {
  title: string,
  author: string,
}

export default class NewsCreatorPlugin implements AddContentPlugin<Fields> {
  __type: 'content-creator' = 'content-creator'
  name: AddContentPlugin<Fields>['name'] = 'Create News Post'
  fields: AddContentPlugin<Fields>['fields'] = [
    {
      name: 'title',
      component: 'text',
      label: 'Title',
      placeholder: 'New Post',
      description: 'The title of the post. Whatever you type here will also be converted into the URL along with today\'s date. For example, if the title is My New Post and today is 1/10/2021 then the URL will be https://sunrisemvmtsb.org/news/my-new-page-2020-01-10. This will also show up in the browser tab for the page and on Google results.',
    } as Field,
    {
      name: 'author',
      component: 'text',
      label: 'Author',
      placeholder: 'Firstname Lastname',
      description: 'The name of the author of the post',
    } as Field,
  ]

  private _storage: StorageService
  private _news: NewsService

  constructor() {
    this._storage = container.get(StorageService)
    this._news = container.get(NewsService)
  }

  async onSubmit(form: Fields, cms: TinaCMS) {
    const slugStart = this.slugify(form.title)
    const summaries = await this._news.listNewsSummaries()
    const existingCount = summaries.filter((s) => s.slug.startsWith(slugStart)).length
    const postfix = existingCount === 0 ? '' : `-${existingCount}`
    const slug = slugStart + postfix

    const post: NewsPost = {
      slug,
      title: form.title,
      author: form.author,
      content: '',
      image: AdjustableImage.default,
      published: new Date().toISOString(),
      subtitle: '',
      tags: [],
      url: '/news/' + slug
    }

    try {
      this._storage.saveNewsPost(post)
      window.location.assign('/news/' + slug)
    } catch (e) {
      return { [FORM_ERROR]: e } as unknown as void // lol cool types guys
    }
  }

  slugify(title: string): string {
    const today = new Date
    return [
      title
        .trim()
        .toLowerCase()
        //replace invalid chars
        .replace(/[^a-z0-9 -]/g, '')
        // Collapse whitespace and replace by -
        .replace(/\s+/g, '-')
        // Collapse dashes
        .replace(/-+/g, '-'),
      today.getFullYear().toString(),
      (today.getMonth() + 1).toString().padStart(2, '0'),
      today.getDate().toString().padStart(2, '0')
    ].join('-')
  }
}
