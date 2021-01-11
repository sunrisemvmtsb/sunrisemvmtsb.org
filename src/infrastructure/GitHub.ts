import { Readable } from 'stream'
import { Octokit } from '@octokit/rest'
import { Gunzip } from 'zlib'

export default class GitHub {
  private static _instance: GitHub | null = null
  public static get instance() {
    if (this._instance === null) this._instance = new GitHub()
    return this._instance
  }

  private _octokit: Octokit

  constructor() {
    this._octokit = new Octokit({
      auth: process.env.GITHUB_ACCESS_KEY,
    })
  }

  async streamJsonContent(path: string): Promise<Readable> {
    const url = `https://raw.githubusercontent.com/sunrisemvmtsb/sunrisemvmtsb.org/main/content/${path}`
    const response = await fetch(url)
    return response.body as unknown as Gunzip
  }

  async getJsonContent<T>(path: string): Promise<T> {
    const url = `https://raw.githubusercontent.com/sunrisemvmtsb/sunrisemvmtsb.org/main/content/${path}`
    const response = await fetch(url)
    return response.json()
  }

  async listContentDirectory(path: string): Promise<Array<string>> {
    const result = await this._octokit.repos.getContent({
      owner: 'sunrisemvmtsb',
      repo: 'sunrisemvmtsb.org',
      path: `content/${path}`
    })

    if (Array.isArray(result.data)) {
      return result
        .data
        .filter((file) => file.type === 'file')
        .map((file) => file.path.replace('content/', ''))
    }

    return []
  }
}
