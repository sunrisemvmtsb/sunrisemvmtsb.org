import { ContainerInstance } from 'typedi'
import IContentBackend from './IContentBackend'
import Page from '../domain/Page'
import PageSummary from '../domain/PageSummary'

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

  /**
   * TODO:
   * 1. Replace logic here with logic from NewsService listNewsSummaries
   * 2. Update conten backend to allow for `include` key on fetching content
   * 3. Update other uses of this method
   * 4. Use this method to list pages in ContentListPlugin
   */
  async listPageSummaries(): Promise<Array<PageSummary>> {
    const filenames = await this._backend.listTextBucket({ bucket: 'pages' })
    const files = await Promise.all(filenames
      .filter((filename) => filename !== 'index.json')
      .map((filename) => {
        return this._backend.getTextFile({
          bucket: 'pages',
          filename,
          exclude: ['description', 'blocks'],
        }).then((data) => [filename, data] as [string, Record<string, any> | null])
      }))

    return files
      .filter(([, file]) => file !== null)
      .map(([filename, file]) => ({
        title: file!.title,
        slug: file!.slug,
      }))
  }

  async savePage(page: Page): Promise<void> {
    await this._backend.saveTextFile({
      bucket: 'pages',
      filename: page.slug === '' ? 'index.json' : `${page.slug}.json`,
      content: JSON.stringify(page, null, 2),
    })
  }

  async renamePage(page: Page, slug: string): Promise<Page> {
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
