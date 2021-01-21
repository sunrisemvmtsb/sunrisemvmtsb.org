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
      redirects: {
        pages: {}
      },
    }
  },
  addPageRedirect: (from: string, to: string, config: SiteConfig): SiteConfig => {
    return {
      ...config,
      infrastructure: {
        ...config.infrastructure,
        redirects: {
          ...config.infrastructure.redirects,
          pages: Object.fromEntries(Object
            .entries({ ...config.infrastructure.redirects.pages, [from]: to })
            .map(([someFrom, someTo]) => someTo === from ? [someFrom, to] : [someFrom, someTo])
            .filter(([someFrom, someTo]) => someFrom !== someTo)
          )
        }
      }
    }
  }
}

export default SiteConfig
