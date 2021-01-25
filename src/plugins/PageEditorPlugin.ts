import { useForm, useCMS, Form, usePlugin } from 'tinacms'
import { FORM_ERROR } from 'final-form'
import container from '../infrastructure/Container.client'
import StorageService from '../services/StorageService.client'
import Page from '../domain/Page'
import { useRouter } from 'next/router'
import EditPageDetails from '../usecases/EditPageDetails'
import PagesService from '../services/PagesService'
import SiteConfigService from '../services/SiteConfigService'
import { useToolbarFormPlugin } from './ToolbarFormPlugin'

export default class PageEditorPlugin {
  private static _instance: PageEditorPlugin | null = null
  static get instance(): PageEditorPlugin {
    if (this._instance === null) this._instance = new PageEditorPlugin()
    return this._instance
  }

  async latest(slug: string): Promise<Page | null> {
    const pagesService = container.get(PagesService)
    const storageService = container.get(StorageService)

    if (slug === '') {
      return pagesService.getPage(slug)
    }

    const local = await storageService.getPage(slug)
    if (local) return { ...local, slug }
    return pagesService.getPage(slug)
  }

  async save(page: Page): Promise<void> {
    const pagesService = container.get(PagesService)
    const storageService = container.get(StorageService)
    const siteConfigService = container.get(SiteConfigService)

    await pagesService.savePage(page)
    await storageService.removePage(page)
    const config = await siteConfigService.get()
    delete config.infrastructure.redirects.pages[page.slug]
    await siteConfigService.save(config)
  }

  static use(slug: string, page: Page | null, label: string): [Page, Form] {
    const cms = useCMS()
    const router = useRouter()

    const [pageValues, pageForm] = useForm({
      id: `pages:${slug}`,
      label: label,
      fields: [],
      actions: [],
      async loadInitialValues() {
        if (cms.disabled) return page ?? {}
        const initial = await PageEditorPlugin.instance.latest(slug)

        if (!initial) {
          cms.alerts.error(`Page /${slug} does not exist`)
          router.push('/')
          return
        }

        detailsForm.updateInitialValues({
          title: initial.title,
          slug: initial.slug,
          description: initial.description
        })
        detailsForm.updateValues({
          title: initial.title,
          slug: initial.slug,
          description: initial.description
        })

        return initial
      },
      async onSubmit(values) {
        try {
          await PageEditorPlugin.instance.save(values)
        } catch (e) {
          return { [FORM_ERROR]: e }
        }
      },
    }, {
      label
    })

    usePlugin(pageForm)

    const [details, detailsForm] = useToolbarFormPlugin({
      id: `page-details:${slug}`,
      label: 'Edit Page Details',
      initialValues: {
        title: pageValues?.title ?? 'New Page',
        slug: pageValues?.slug ?? 'new-page',
        description: pageValues?.description ?? '',
      },
      fields: [
        {
          component: slug === '' ? 'hidden' : 'text',
          name: 'slug',
          label: 'URL',
          validate: (input) => {
            return Page.isSlugValid(input) ?
              undefined :
              'Page URL can only contain letters, numbers, and - (but not more than one - at a time and not at the beginning or end)'
          },
        },
        {
          component: 'text',
          name: 'title',
          label: 'Title',
        },
        {
          component: 'textarea',
          name: 'description',
          label: 'Description',
        },
      ],
      onSubmit: async (details) => {
        const usecase = new EditPageDetails()
        try {
          const updated = await usecase.exec(pageForm.values, details)
          pageForm.updateInitialValues(updated)
          pageForm.updateValues(updated)
          router.replace(Page.href(updated), undefined, {
            shallow: true,
          })
        } catch (e) {
          debugger
          if (e instanceof EditPageDetails.HomeIsNotEditableError) cms.alerts.error('Cannot edit URL of home page')
          if (e instanceof EditPageDetails.HomeIsReservedError) cms.alerts.error('Cannot use a blank URL - this is the URL of the home page')
          if (e instanceof EditPageDetails.PageExistsError) cms.alerts.error('This page already exists')
          if (e instanceof EditPageDetails.SlugInvalidError) cms.alerts.error('This is not a valid URL. Please use only letters, numbers and - (but not more than one - in a row and not at the beginning or end)')
          if (e instanceof EditPageDetails.ServiceError) cms.alerts.error(e.cause.message)
          else cms.alerts.error(e.message)
        }
      }
    }, () => {
      return slug !== ''
    })

    return [Object.assign({}, page, pageValues, details), pageForm]
  }
}
