import Page from '../domain/Page'
import type { TinaCMS, Field, AddContentPlugin } from 'tinacms'
import ContentService from 'src/services/ContentService'
import StorageService from '../services/StorageService'

type Fields = {
  title: string,
  description: string,
}

export default class PageCreatorPlugin implements AddContentPlugin<Fields> {
  __type: 'content-creator' = 'content-creator'
  name: AddContentPlugin<Fields>['name'] = 'Create Page'
  fields: AddContentPlugin<Fields>['fields'] = [
    {
      name: 'title',
      component: 'text',
      label: 'Title',
      placeholder: 'New Page',
      description: 'The title of the page. Whatever you type here will also be converted into the URL. For example, if the title is My New Page then the URL will be https://sunrisemvmtsb.org/my-new-page. This will also show up in the browser tab for the page and on Google results.',
    } as Field,
    {
      name: 'description',
      component: 'textarea',
      label: 'Description',
      placeholder: 'Describe the page...',
      description: 'A short description of the page. This will show up in Google results and factor into search rankings. Please fill this out!',
    } as Field,
  ]

  async onSubmit(form: Fields, cms: TinaCMS) {
    const page = {
      ...Page.default(form.title),
      description: form.description,
    }

    try {
      const existing = await ContentService.instance.getPagePaths()
      if (existing.includes(page.slug)) {
        cms.alerts.error(`A page with path ${Page.href(page)} already exists.`)
        return
      }

      await StorageService.instance.savePage(page)
      window.location.assign(Page.href(page))
    } catch (e) {
      cms.alerts.error(`Page creation failed: ${e.message}`)
    }
  }

  slugify(title: string): string {
    return (
      title
        .trim()
        .toLowerCase()
        //replace invalid chars
        .replace(/[^a-z0-9 -]/g, '')
        // Collapse whitespace and replace by -
        .replace(/\s+/g, '-')
        // Collapse dashes
        .replace(/-+/g, '-')
    )
  }
}
