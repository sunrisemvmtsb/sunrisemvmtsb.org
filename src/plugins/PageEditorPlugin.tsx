import React from 'react'
import { useForm, useCMS, Form, usePlugins, Modal, PopupModal, ModalHeader, ModalBody, ModalActions, ActionButton, FieldMeta, Input, Plugin } from 'tinacms'
import { LoadingDots } from '@tinacms/react-forms'
import { Button } from '@tinacms/styles'
import { FORM_ERROR } from 'final-form'
import ContentService from '../services/ContentService'
import StorageService from '../services/StorageService'
import Page from '../domain/Page'
import { useRouter } from 'next/router'
import RenamePage from '../usecases/RenamePage'
import SiteConfig from 'src/domain/SiteConfig'

const RenameAction = ({
  page,
  onChange,
}: {
  page: Page | null,
  onChange: (page: Page) => void,
}) => {
  const [ active, setActive ] = React.useState(false)
  const [ saving, setSaving ] = React.useState(false)
  const [ error, setError ] = React.useState('')
  const [ title, setTitle ] = React.useState(page?.title ?? '')
  const open = () => setActive(true)
  const close = () => setActive(false)

  React.useEffect(() => {
    if (!page) return
    setTitle(page.title)
  }, [page])

  if (!page) return null

  return (
    <>
      <Button onClick={open}>
        Rename Page
      </Button>
      {active && (
        <Modal >
          <PopupModal>
            <ModalHeader close={close}>{`Rename "${page.title}"`} </ModalHeader>
            <ModalBody padded>
              <FieldMeta
                label="New Title"
                name="new_title"
                description="Give the current page a new name. If the URL for the page's name is already in use then the change will not take effect."
                error={error}>
                <Input
                  disabled={saving}
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}/>
              </FieldMeta>
            </ModalBody>
            <ModalActions>
              <Button
                disabled={saving}
                onClick={close}>
                Cancel
              </Button>
              <Button
                primary
                disabled={saving}
                onClick={async () => {
                  const usecase = new RenamePage()
                  
                  try {
                    setSaving(true)
                    const updated = await usecase.exec(page, title)
                    onChange(updated)
                    close()
                  } catch (e) {
                    if (e instanceof RenamePage.PageExistsError) setError(`Page at ${e.path} already exists`)
                    else if (e instanceof RenamePage.ServiceError) setError('Could not update the page on the server. Please try again later.')
                  } finally {
                    setSaving(false)
                  }
                }}>
                {saving ?
                  <LoadingDots /> :
                  'Save'
                }
              </Button>
            </ModalActions>
          </PopupModal>
        </Modal>
      )}
    </>
  )
}

const createRenameActionPlugin = (page: Page | null, onChange: (page: Page) => void) => ({
  __type: 'toolbar:widget',
  name: 'rename-page',
  weight: 2,
  page,
  component: () => <RenameAction page={page} onChange={onChange} />,
})

export default class PageEditorPlugin {
  private static _instance: PageEditorPlugin | null = null
  static get instance(): PageEditorPlugin {
    if (this._instance === null) this._instance = new PageEditorPlugin()
    return this._instance
  }

  async latest(slug: string): Promise<Page | null> {
    if (slug === '') {
      return ContentService.instance.getPage(slug)  
    }
    
    const local = await StorageService.instance.getPage(slug)
    if (local) return { ...local, slug }
    return ContentService.instance.getPage(slug)
  }

  async save(page: Page): Promise<void> {
    await ContentService.instance.savePage(page)
    await StorageService.instance.removePage(page)
    const config = await ContentService.instance.getSiteConfig()
    delete config.infrastructure.redirects.pages[page.slug]
    await ContentService.instance.saveSiteConfig(config)
  }

  async persist(page: Page): Promise<void> {
    StorageService.instance.savePage(page)
  }

  static use(slug: string, page: Page | null, label: string): [Page, Form] {
    const cms = useCMS()
    const router = useRouter()
    const [activePage, setActivePage] = React.useState<Page | null>(page)

    const [values, form] = useForm({
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

    const renamePlugin = React.useMemo(() => {
      return createRenameActionPlugin(
        activePage,
        (newPage) => {
          setActivePage(newPage)
          router.replace(Page.href(newPage), undefined, {
            shallow: true,
          })
          form.updateInitialValues(newPage)
        }
      )
    }, [router, activePage, form])

    usePlugins(
      slug === '' ?
        [form] :
        [form, renamePlugin]
    )

    return [Object.assign({}, page, values), form]
  }
}
