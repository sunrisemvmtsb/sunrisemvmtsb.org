import React from 'react'
import { useForm, useCMS, Form, usePlugin, GlobalFormPlugin } from 'tinacms'
import { SettingsIcon } from '@tinacms/icons'
import SiteConfig from '../domain/SiteConfig'
import * as uuid from 'uuid'
import container from '../infrastructure/Container.client'
import SiteConfigService from '../services/SiteConfigService'

export default class ConfigEditorPlugin {
  private static _instance: ConfigEditorPlugin | null = null
  static get instance(): ConfigEditorPlugin {
    if (this._instance === null) this._instance = new ConfigEditorPlugin()
    return this._instance
  }

  private _siteConfig: SiteConfigService
  constructor() {
    this._siteConfig = container.get(SiteConfigService)
  }

  async latest(): Promise<SiteConfig> {
    return this._siteConfig.get()
  }

  async save(config: SiteConfig): Promise<void> {
    await this._siteConfig.save(config)
  }

  static use(config: SiteConfig): SiteConfig {
    const cms = useCMS()
    const [values, form] = useForm({
      id: `site-config`,
      label: 'Site Config',
      fields: [
        {
          name: 'header',
          label: 'Header',
          component: 'group',
          fields: [
            {
              name: 'links',
              label: 'Links',
              component: 'group-list',
              itemProps: (item: any) => ({
                key: item.id,
                label: item.title,
              }),
              defaultItem: () => {
                return {
                  title: '',
                  url: '/',
                  type: 'Plain',
                  id: uuid.v4(),
                }
              },
              fields: [
                {
                  name: 'title',
                  label: 'Title',
                  component: 'text',
                  defaultValue: '',
                },
                {
                  name: 'url',
                  label: 'URL',
                  component: 'text',
                  defaultValue: '/',
                },
                {
                  name: 'type',
                  label: 'Style',
                  component: 'select',
                  options: [
                    { value: 'Plain', label: 'Plain' },
                    { value: 'WhiteButton', label: 'White Button' },
                    { value: 'YellowButton', label: 'Yellow Button' },
                  ]
                }
              ]
            }
          ]
        }
      ],
      async loadInitialValues() {
        if (cms.disabled) return config
        return ConfigEditorPlugin.instance.latest()
      },
      async onSubmit(values) {
        return ConfigEditorPlugin.instance.save(values)
      },
    }, {
      label: 'Site Config'
    })

    const GlobalForm = React.useMemo(() => {
      return new GlobalFormPlugin(form, SettingsIcon, 'fullscreen')
    }, [form])

    usePlugin(GlobalForm)

    return React.useMemo(() => {
      return Object.assign({}, config, values)
    }, [values, config])
  }
}
