import { ContainerInstance } from 'typedi'
import IContentBackend from './IContentBackend'
import SiteConfig from '../domain/SiteConfig'

export default class SiteConfigService {
  private _backend: IContentBackend

  constructor({
    container,
  }: {
    container: ContainerInstance,
  }) {
    this._backend = container.get(IContentBackend)
  }

  async get(): Promise<SiteConfig> {
    const result = await this._backend.getTextFile({
      bucket: 'config',
      filename: 'site.json',
      exclude: [],
    })

    if (result === null) throw Error('No site config')
    return result as SiteConfig
  }

  async save(config: SiteConfig): Promise<void> {
    await this._backend.saveTextFile({
      bucket: 'config',
      filename: 'site.json',
      content: JSON.stringify(config, null, 2),
    })
  }
}
