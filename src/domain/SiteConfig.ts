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
}

const SiteConfig = {
  default: {
    calendar: '',
    header: {
      links: [],
    },
  },
}

export default SiteConfig
