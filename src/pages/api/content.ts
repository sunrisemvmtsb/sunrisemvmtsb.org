import AuthService from '../../services/AuthService'
import ContentService from '../../services/ContentService'

export default AuthService.instance.protect(async (req, res) => {
  const method = req.query.method as string
  if (!method) return res.status(400).end()

  if (method === 'getPage' && req.method === 'GET') {
    const slug = req.query.slug as string | undefined
    if (typeof slug === 'undefined') return res.status(400).end()
    const page = await ContentService.instance.getPage(slug)
    if (page === null) return res.status(404).end()
    return res.send(page)
  }

  if (method === 'savePage' && req.method === 'POST') {
    const slug = req.query.slug as string | undefined
    if (typeof slug === 'undefined') return res.status(400).end()
    await ContentService.instance.savePage(req.body)
    return res.status(200).end()
  }

  if (method === 'getNewsSummaries' && req.method === 'GET') {
    const summaries = await ContentService.instance.getNewsSummaries()
    return res.send(summaries)
  }

  if (method === 'getNewsPost' && req.method === 'GET') {
    const slug = req.query.slug as string | undefined
    if (typeof slug === 'undefined') return res.status(400).end()
    const page = await ContentService.instance.getNewsPost(slug)
    if (page === null) return res.status(404).end()
    return res.send(page)
  }

  if (method === 'saveNewsPost' && req.method === 'POST') {
    const slug = req.query.slug as string | undefined
    if (typeof slug === 'undefined') return res.status(400).end()
    await ContentService.instance.saveNewsPost(req.body)
    return res.status(200).end()
  }

  if (method === 'getSiteConfig' && req.method === 'GET') {
    const config = await ContentService.instance.getSiteConfig()
    return res.send(config)
  }

  if (method === 'saveSiteConfig' && req.method === 'PUT') {
    await ContentService.instance.saveSiteConfig(req.body)
    return res.status(200).end()
  }

  return res.status(404).end()
})
