import React from 'react'
import { JsonFile, useJsonForm } from '../infrastructure/CustomGitClient'
import { usePlugin, GlobalFormPlugin } from 'tinacms'
import { SettingsIcon } from '@tinacms/icons'

export type Link = {
  title: string,
  url: string,
  type: 'Plain' | 'WhiteButton' | 'YellowButton'
}

export type Data = {
  header: {
    links: Array<Link>,
  },
}


export const useConfigScreenPlugin = (config: JsonFile<Data>): Data => {
  const [formData, form] = useJsonForm(config, {
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
            itemProps: (item) => ({
              key: item.title + '::' + item.url,
              label: item.title,
            }),
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
    ]
  })

  const GlobalForm = React.useMemo(() => {
    return new GlobalFormPlugin(form, SettingsIcon, 'fullscreen')
  }, [form])

  usePlugin(GlobalForm)

  return React.useMemo(() => {
    return Object.assign({}, config.data, formData)
  }, [formData, config.data])
}
