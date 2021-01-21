export type Link = {
  title: string,
  url: string,
  type: 'Plain' | 'WhiteButton' | 'YellowButton',
  id: string,
}

type SiteConfig = {
  header: {
    links: Array<Link>,
  },
  calendar: string,
  infrastructure: {
    redirects: {
      pages: Record<string, string>,
    }
  }
}

const SiteConfig = {
  default: {
    calendar: '',
    header: {
      links: [],
    },
    infrastructure: {
      redirects: []
    }
  },
}

export default SiteConfig
