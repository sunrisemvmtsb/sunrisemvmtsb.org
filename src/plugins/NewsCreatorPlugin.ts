import JsonCreatorPlugin from '../infrastructure/JsonCreatorPlugin'

const NewsCreatorPlugin = new JsonCreatorPlugin<{
  title: string,
  description: string,
  blocks: Array<any>,
}>({
  label: 'New Post',
  filename: async (form: { title: string }) => {
    return `content${pagePath(form.title)}.json`
  },
  fields: [
    {
      name: 'title',
      component: 'text',
      label: 'Title',
      placeholder: 'New Post',
      description: 'The title of the post. Whatever you type here will also be converted into the URL along with today\'s date. For example, if the title is My New Post and today is 1/10/2021 then the URL will be https://sunrisemvmtsb.org/news/my-new-page-2020-01-10. This will also show up in the browser tab for the page and on Google results.',
    },
    {
      name: 'subtitle',
      component: 'text',
      label: 'Subtitle',
      placeholder: 'Optional subtitle',
    },
    {
      name: 'image',
      component: 'group',
      label: 'Cover Image',
      fields: [
        {
          name: 'path',
          label: 'Image',
          component: 'image',
          parse: (media) => media.id,
        },
        {
          name: 'alt',
          label: 'Alt Text',
          component: 'text',
          defaultValue: '',
          description: 'Written copy to help screen-reading tools describe images to visually impaired readers',
        },
        {
          name: 'fit',
          label: 'Resizing',
          description: 'Choose how the image should adjust to being resized. Contain will ensure the image retrains its aspect ratio while not covering the total area. Cover will cover the total area while maintaining the aspect ratio. Fill will cover the total area by stretching the image, not maintaining the aspect ratio.',
          component: 'select',
          defaultValue: 'cover',
          options: ['cover', 'contain', 'fill'],
        },
        {
          name: 'x',
          label: 'Horizontal Position',
          component: 'select',
          options: ['center', 'left', 'right'],
          defaultValue: 'center',
          description: 'Adjust how the image is positioned horizontally when resized',
        },
        {
          name: 'y',
          label: 'Vertical Position',
          component: 'select',
          options: ['center', 'top', 'bottom'],
          defaultValue: 'center',
          description: 'Adjust how the image is positioned vertically when resized',
        },
      ]
    }

    // "image": {
    //   "alt": "Image",
    //   "fit": "cover",
    //   "path": "/images/placeholder.svg",
    //   "x": "center",
    //   "y": "center"
    // },
    // "tags": [
    //   "Featured",
    //   "Movement Updates"
    // ]

  ],
  beforeCreate: (data) => {
    return { ...data, content: '' }
  },
  afterCreate: (data) => {
    window.location.href = pagePath(data.title)
  },
})

const pagePath = (title: string) => {
  const today = new Date()
  return `/news/${slugify(title)}-${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`
}

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

export default NewsCreatorPlugin
