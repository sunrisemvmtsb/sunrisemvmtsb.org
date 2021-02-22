type PageSummary = {
  title: string,
  slug: string,
}

const PageSummary = {
  href: (page: PageSummary): string => {
    return '/' + page.slug
  },
}

export default PageSummary
