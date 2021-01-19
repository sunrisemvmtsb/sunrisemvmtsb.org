import type { TinaCMS, Field, AddContentPlugin } from 'tinacms'
import { FORM_ERROR } from 'final-form'

import NewsPost from '../domain/NewsPost'
import AdjustableImage from '../domain/AdjustableImage'

import ContentService from '../services/ContentService'

type Fields = {
  title: string,
  author: string,
}

export default class NewsCreatorPlugin implements AddContentPlugin<Fields> {
  __type: 'content-creator' = 'content-creator'
  name: AddContentPlugin<Fields>['name'] = 'Page'
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

  private _storagePromise: Promise<LocalForage> | null = null
  private _getStorage(): Promise<LocalForage> {
    if (this._storagePromise) return this._storagePromise
    this._storagePromise = import('localforage')
      .then(({ default: localForage }) => {
        const storage = localForage.createInstance({
          driver: localForage.INDEXEDDB,
          name: 'sunrisemvmtsb_org',
          version: 1.0,
          storeName: 'pages',
          description: 'locally cached page changes'
        })
        this._storagePromise = Promise.resolve(storage)
        return storage
      })
    return this._storagePromise
  }

  async onSubmit(form: Fields, cms: TinaCMS) {
    const slugStart = this.slugify(form.title)
    const summaries = await ContentService.instance.getNewsSummaries()
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
      const storage = await this._getStorage()
      await storage.setItem(`news:${slug}`, post)
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
