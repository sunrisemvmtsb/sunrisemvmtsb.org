import AdjustableImage from './AdjustableImage'

type NewsPost = {
  image: AdjustableImage,
  tags: Array<string>,
  title: string,
  subtitle: string,
  author: string,
  published: string,
  url: string,
  content: string,
  slug: string,
}

const NewsPost = {
  path: (post: NewsPost): string => {
    return `content/news/${post.slug}.json`
  }
}

export default NewsPost
