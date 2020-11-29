import { GetStaticProps } from 'next'
import parseFrontmatter from 'gray-matter'
import ReactMarkdown from 'react-markdown'
import glob from 'glob'

export default function BlogTemplate(props) {
  // Render data from `getStaticProps`
  return (
    <article>
      <h1>{props.frontmatter.title}</h1>
      <div>
        <ReactMarkdown source={props.markdownBody} />
      </div>
    </article>
  )
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params
  const content = await import(`../../content/news/${slug}.md`)
  const data = parseFrontmatter(content.default)

  return {
    props: {
      frontmatter: data.data,
      markdownBody: data.content,
    },
  }
}

export async function getStaticPaths() {
  //get all .md files in the posts dir
  const blogs = glob.sync('content/news/*.md')

  //remove path and extension to leave filename only
  const blogSlugs = blogs.map(file =>
    file
      .split('/')[2]
      .replace(/ /g, '-')
      .replace('.md', '')
      .trim()
  )

  // create paths with `slug` param
  const paths = blogSlugs.map(slug => `/news/${slug}`)

  return {
    paths,
    fallback: false,
  }
}
