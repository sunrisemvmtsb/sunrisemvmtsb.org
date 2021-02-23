import type { NextApiRequest } from 'next/types'
import { Container, ContainerInstance } from 'typedi'
import Crypto from './Crypto.server'
import GitHub from './GitHub.server'
import GoogleAuth from './GoogleAuth.server'
import GoogleCalendar from './GoogleCalendar.server'
import ISocialService from '../services/ISocialService'
import IContentBackend from '../services/IContentBackend'
import GitHubContentBackend from '../services/GitHubContentBackend.server'
import FileSystemContentBackend from '../services/FileSystemContentBackend.server'
import Instagram from './Instagram'
import { v4 as uuid } from 'uuid'
import DevSocialService from '../services/DevSocialService.server'
import SiteConfigService from '../services/SiteConfigService'
import PagesService from '../services/PagesService'
import NewsService from '../services/NewsService'

Container.set({
  id: GitHub,
  global: true,
  value: new GitHub({
    auth: process.env.GITHUB_ACCESS_TOKEN!,
    owner: 'sunrisemvmtsb',
    repo: 'sunrisemvmtsb.org',
    branch: 'main',
    name: 'Sunrise SB Team',
    email: 'website@sunrisemvmtsb.org',
  }),
})
Container.set({
  id: Crypto,
  global: true,
  value: new Crypto({
    key: process.env.SIGNING_KEY!
  }),
})
Container.set({
  id: GoogleCalendar,
  global: true,
  value: new GoogleCalendar({
    calendar: 'sunrisemvmtsb@gmail.com',
    auth: process.env.GOOGLE_CALENDAR_API_KEY!,
  }),
})

Container.set({
  id: Instagram,
  global: true,
  value: new Instagram({
    username: 'sunrisemvmtsb',
  }),
})

Container.set({
  id: Instagram,
  global: true,
  value: new Instagram({
    username: 'sunrisemvmtsb',
  }),
})

Container.set({
  id: ISocialService,
  global: true,
  value: new DevSocialService(),
})

export default (id: string): ContainerInstance => {
  const container = Container.of(id)

  container.set(IContentBackend,
    process.env.NODE_ENV === 'production' ?
      new GitHubContentBackend({ container }) :
      new FileSystemContentBackend()
  )

  container.set(GoogleAuth, new GoogleAuth({
    container,
    allowed: ['sunrisemvmtsb@gmail.com', 'rajesh.v.sannidhi@gmail.com'],
    clientId: process.env.GOOGLE_AUTH_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET!,
    hostname: process.env.SERVER_HOSTNAME!,
    secure: process.env.NODE_ENV === 'production'
  }))

  container.set(SiteConfigService, new SiteConfigService({ container }))
  container.set(PagesService, new PagesService({ container }))
  container.set(NewsService, new NewsService({ container }))

  return container
}


