import { Octokit, } from '@octokit/rest'
import { RequestError } from '@octokit/request-error'
import type { Endpoints } from '@octokit/types'

export type GitTree = Endpoints['POST /repos/{owner}/{repo}/git/trees']['response']['data']['tree'][number]

export default class GitHub {
  private _octokit: Octokit
  private _owner: string
  private _repo: string
  private _branch: string
  private _name: string
  private _email: string

  constructor({
    auth,
    owner,
    repo,
    branch,
    name,
    email,
  }: {
    auth: string,
    owner: string,
    repo: string,
    branch: string,
    name: string,
    email: string,
  }) {
    this._octokit = new Octokit({ auth })
    this._owner = owner
    this._repo = repo
    this._branch = branch
    this._name = name
    this._email = email
  }

  private async _getShaForPath(path: string): Promise<string | null> {
    const query = `query { 
      repository(name: "${this._repo}", owner: "${this._owner}") { 
        object(expression: "${this._branch}:${path}") {
          oid
        }
      }
    }`
    const url = 'https://api.github.com/graphql'
    const response = await fetch(url, {
      headers: { 'Authorization': `bearer ${process.env.GITHUB_ACCESS_TOKEN!}` },
      method: 'POST',
      body: JSON.stringify({ query })
    })
    const data = await response.json()
    return data.data.repository.object?.oid ?? null
  }

  public async createOrUpdateFileContent({
    content,
    path,
    message,
  }: {
    content: Buffer,
    path: string,
    message: string,
  }) {
    const sha = await this._getShaForPath(path)

    await this._octokit.repos.createOrUpdateFileContents({
      owner: this._owner,
      repo: this._repo,
      branch: this._branch,
      path,
      message,
      sha: sha ?? undefined,
      content: content.toString('base64'),
      author: {
        name: this._name,
        email: this._email,
      },
      committer: {
        name: this._name,
        email: this._email,
      },
    })
  }

  public async getFileContent({
    path,
  }: {
    path: string,
  }): Promise<Buffer | null> {
    try {
      const result = await this._octokit.repos.getContent({
        owner: this._owner,
        repo: this._repo,
        path,
        ref: `heads/${this._branch}`,
      })

      if (Array.isArray(result.data)) return null
      if (result.data.type !== 'file') return null
      if (!('content' in result.data)) return null
      return Buffer.from(result.data.content, 'base64')
    } catch (e) {
      if (e instanceof RequestError && e.status === 404) return null
      else throw e
    }
  }

  public async deleteFile({
    path,
    message,
  }: {
    path: string,
    message: string,
  }): Promise<void> {
    const sha = await this._getShaForPath(path)
    if (!sha) return

    await this._octokit.repos.deleteFile({
      owner: this._owner,
      repo: this._repo,
      branch: this._branch,
      path,
      message,
      sha,
      author: {
        name: this._name,
        email: this._email,
      },
      committer: {
        name: this._name,
        email: this._email,
      },
    })
  }

  public async listFilesInDirectory({
    path,
  }: {
    path: string,
  }): Promise<Array<string>> {
    try {
      const result = await this._octokit.repos.getContent({
        owner: this._owner,
        repo: this._repo,
        path,
        ref: `heads/${this._branch}`,
      })

      if (!Array.isArray(result.data)) return []
      return result
        .data
        .filter((entry) => entry.type === 'file')
        .map((entry) => entry.name)
    } catch (e) {
      if (e instanceof RequestError && e.status === 404) return []
      else throw e
    }
  }

  public async modifyTree({
    message,
    modify,
  }: {
    message: string,
    modify: (tree: Array<GitTree>) => Array<GitTree>
  }): Promise<void> {
    const currentBranch = await this._octokit.repos.getBranch({
      owner: this._owner,
      repo: this._repo,
      branch: this._branch,
    })

    const branchTree = await this._octokit.git.getTree({
      owner: this._owner,
      repo: this._repo,
      tree_sha: currentBranch.data.commit.sha,
      recursive: '1',
    })

    const treeEntries = modify(branchTree.data.tree)

    const updateTree = await this._octokit.git.createTree({
      owner: this._owner,
      repo: this._repo,
      tree: treeEntries as any,
    })

    const commit = await this._octokit.git.createCommit({
      message,
      owner: this._owner,
      repo: this._repo,
      tree: updateTree.data.sha,
      parents: [branchTree.data.sha],
      author: {
        name: this._name,
        email: this._email,
      },
      committer: {
        name: this._name,
        email: this._email,
      },
    })

    await this._octokit.git.updateRef({
      owner: this._owner,
      repo: this._repo,
      ref: `heads/${this._branch}`,
      sha: commit.data.sha,
    })
  }

  public getDownloadUrl({
    path,
  }: {
    path: string,
  }): string {
    return `https://raw.githubusercontent.com/${this._owner}/${this._repo}/${this._branch}/${path}`
  }
}
