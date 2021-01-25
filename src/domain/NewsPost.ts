import AdjustableImage from './AdjustableImage'

type NewsPost = {
  image: AdjustableImage,
  tags: Array<string>,
  title: string,
  subtitle: string,
  author: string,
  published: string | null,
  url: string,
  content: string,
  slug: string,
}

const NewsPost = {
  default: (slug: string) => ({
    image: AdjustableImage.default,
    tags: [],
    title: '',
    subtitle: '',
    author: '',
    published: null,
    url: '/news/' + slug,
    content: '',
    slug,
  } as NewsPost),
  path: (post: NewsPost): string => {
    return `content/news/${post.slug}.json`
  },
}

export default NewsPost
