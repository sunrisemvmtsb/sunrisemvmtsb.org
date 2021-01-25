import { Temporal } from 'proposal-temporal'
import AdjustableImage from './AdjustableImage'

type NewsSummary = {
  image: AdjustableImage,
  tags: Array<string>,
  title: string,
  subtitle: string,
  author: string,
  published: string,
  url: string,
  slug: string,
}

const NewsSummary = {
  isFeatured: (summary: NewsSummary): boolean => {
    return summary.tags.some((t) => t.toLocaleLowerCase() === 'featured')
  },
  category: (summary: NewsSummary): string | null => {
    return summary.tags[0] ?? null
  },
  compare: (l: NewsSummary, r: NewsSummary) => {
    return Temporal.Instant.compare(
      r.published ?? Temporal.Instant.fromEpochSeconds(0),
      l.published ?? Temporal.Instant.fromEpochSeconds(0),
    )
  },
  href: (summary: NewsSummary): string => {
    return `/news/${summary.slug}`
  },
}

export default NewsSummary
