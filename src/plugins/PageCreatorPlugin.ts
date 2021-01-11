import JsonCreatorPlugin from '../infrastructure/JsonCreatorPlugin'

const PageCreatorPlugin = new JsonCreatorPlugin<{
  title: string,
  description: string,
  blocks: Array<any>,
}>({
  label: 'New Page',
  filename: async (form: { title: string }) => {
    const slug = slugify(form.title)
    return `content/pages/${slug}.json`
  },
  fields: [
    {
      name: 'title',
      component: 'text',
      label: 'Title',
      placeholder: 'New Page',
      description: 'The title of the page. Whatever you type here will also be converted into the URL. For example, if the title is My New Page then the URL will be https://sunrisemvmtsb.org/my-new-page. This will also show up in the browser tab for the page and on Google results.',
    },
    {
      name: 'description',
      component: 'textarea',
      label: 'Description',
      placeholder: 'Describe the page...',
      description: 'A short description of the page. This will show up in Google results and factor into search rankings. Please fill this out!',
    },
  ],
  beforeCreate: (data) => {
    return { ...data, blocks: [] }
  },
  afterCreate: (data) => {
    const slug = slugify(data.title)
    window.location.href = `/${slug}`
  },
})

const slugify = (str: string): string => {
  return (
    str
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

export default PageCreatorPlugin
