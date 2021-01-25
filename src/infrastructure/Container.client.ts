import { Container } from 'typedi'

import IContentBackend from '../services/IContentBackend'
import ApiContentBackend from '../services/ApiContentBackend.client'
import AuthService from '../services/AuthService.client'
import StorageService from '../services/StorageService.client'
import SiteConfigService from '../services/SiteConfigService'
import PagesService from '../services/PagesService'
import NewsService from '../services/NewsService'

import GetLatestNewsPost from '../usecases/GetLatestNewsPost.client'
import UpdateNewsPost from '../usecases/UpdateNewsPost.client'
import EditPageDetails from '../usecases/EditPageDetails.client'

const container = Container.of()

container.set(AuthService, new AuthService())
container.set(IContentBackend, new ApiContentBackend())
container.set(StorageService, new StorageService())
container.set(SiteConfigService, new SiteConfigService({ container }))
container.set(PagesService, new PagesService({ container }))
container.set(NewsService, new NewsService({ container }))

container.set({
  id: GetLatestNewsPost,
  transient: true,
  factory: () => new GetLatestNewsPost({ container })
})

container.set({
  id: UpdateNewsPost,
  transient: true,
  factory: () => new UpdateNewsPost({ container })
})

container.set({
  id: EditPageDetails,
  transient: true,
  factory: () => new EditPageDetails({ container })
})

export default container
