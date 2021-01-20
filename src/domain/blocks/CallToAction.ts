type CallToAction = {
  _template: 'CallToAction',
  callout: string,
  title: string,
  url: string,
  description: string,
  image: string,
  form: string | null,
}

const CallToAction = {
  default: {
    _template: 'CallToAction' as const,
    callout: 'Call out goes here',
    title: 'Title goes here',
    url: '/',
    description: 'Description goes here',
    image: '/images/placeholder.svg',
    form: null,
  }
}

export default CallToAction
