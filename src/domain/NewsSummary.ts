import { Temporal } from 'proposal-temporal'
import AdjustableImage from './AdjustableImage'

type NewsSummary = {
  image: AdjustableImage,
  category: string | null,
  title: string,
  subtitle: string,
  author: string,
  published: string,
  url: string,
  slug: string,
}

export default NewsSummary
