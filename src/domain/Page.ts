import CallToAction from './blocks/CallToAction'
import EventsList from './blocks/EventsList'
import NewsHeadlines from './blocks/NewsHeadlines'
import PrimaryHero from './blocks/PrimaryHero'
import HeadlineHero from './blocks/HeadlineHero'
import OneColumnText from './blocks/OneColumnText'
import TwoColumnText from './blocks/TwoColumnText'

type Block =
  | PrimaryHero
  | HeadlineHero
  | CallToAction
  | EventsList
  | NewsHeadlines
  | OneColumnText
  | TwoColumnText

type Page = {
  slug: string,
  title: string,
  description: string,
  blocks: Array<Block>
}

const Page = {
  path: (page: Page): string => {
    if (page.slug === '') return 'content/index.json'
    return `content/pages/${page.slug}.json`
  },
  href: (page: Page): string => {
    return '/' + page.slug
  },
  slugify: (page: Page): string => {
    return slugifyTitle(page.title)
  },
  default: (title: string): Page => ({
    slug: slugifyTitle(title),
    title: title,
    description: '',
    blocks: [],
  })
}

const slugifyTitle = (title: string) => {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export default Page
