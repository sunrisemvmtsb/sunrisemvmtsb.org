export type LinkOrButton = {
  title: string,
  url: string,
  type: 'Plain' | 'WhiteButton' | 'YellowButton',
  id: string,
}

export type Button = {
  title: string,
  url: string,
  color: 'White' | 'Yellow',
  id: string,
}

export type Link = {
  title: string,
  url: string,
  id: string,
}

type SiteConfig = {
  header: {
    links: Array<LinkOrButton>,
  },
  footer: {
    buttons: Array<Button>,
    links: Array<Link>,
    disclaimer: string,
    social: {
      facebook: string,
      twitter: string,
      instagram: string,
      email: string,
    },
  }
  calendar: string,
  infrastructure: {
    redirects: {
      pages: Record<string, string>,
      news: Record<string, string>,
    }
  },
}

const SiteConfig = {
  default: {
    calendar: '',
    header: {
      links: [],
    },
    footer: {
      buttons: [],
      links: [],
      disclaimer: '',
      social: {
        facebook: '',
        twitter: '',
        instagram: '',
        email: '',
      },
    },
    infrastructure: {
      redirects: {
        pages: {},
        news: {},
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
  },
  addNewsRedirect: (from: string, to: string, config: SiteConfig): SiteConfig => {
    return {
      ...config,
      infrastructure: {
        ...config.infrastructure,
        redirects: {
          ...config.infrastructure.redirects,
          news: Object.fromEntries(Object
            .entries({ ...config.infrastructure.redirects.news, [from]: to })
            .map(([someFrom, someTo]) => someTo === from ? [someFrom, to] : [someFrom, someTo])
            .filter(([someFrom, someTo]) => someFrom !== someTo)
          )
        }
      }
    }
  }
}

export default SiteConfig
