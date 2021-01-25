import { ContainerInstance } from 'typedi'
import IContentBackend from './IContentBackend'
import Page from '../domain/Page'

export default class PagesService {
  private _backend: IContentBackend

  constructor({
    container,
  }: {
    container: ContainerInstance,
  }) {
    this._backend = container.get(IContentBackend)
  }

  async getPage(slug: string): Promise<Page | null> {
    const content = await this._backend.getTextFile({
      bucket: 'pages',
      filename: slug === '' ? 'index.json' : `${slug}.json`,
      exclude: [],
    })
    if (content === null) return null

    // This is a little bit of a leaky abstraction. Sometimes it is good to have
    // the slug on the Page and sometimes it can get out of sync
    return { ...content as Page, slug }
  }

  async listSlugs(): Promise<Array<string>> {
    const filenames = await this._backend.listTextBucket({ bucket: 'pages' })
    return filenames
      .filter((fn) => fn !== 'index.json')
      .map((filename) => filename.replace('.json', ''))
  }

  async savePage(page: Page): Promise<void> {
    await this._backend.saveTextFile({
      bucket: 'pages',
      filename: page.slug === '' ? 'index.json' : `${page.slug}.json`,
      content: JSON.stringify(page, null, 2),
    })
  }

  async renamePage(page: Page, slug: string): Promise<Page> {
    console.log(page, slug)
    if (page.slug === '') throw Error('Cannot rename home page')
    if (slug === '') throw Error('Cannot move a new page to home page')

    await this._backend.renameAndSaveTextFile({
      bucket: 'pages',
      content: JSON.stringify({ ...page, slug }, null, 2),
      oldFilename: page.slug + '.json',
      newFilename: slug + '.json',
    })

    return { ...page, slug }
  }
}
