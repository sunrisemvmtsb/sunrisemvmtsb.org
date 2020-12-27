
import { useForm, useCMS, FormOptions, Field, Form, Media } from 'tinacms'
import Auth from './Auth'


export type JsonFile<T = any> = {
  fileRelativePath: string
  data: T
}

const generateFields = (jsonFile: JsonFile): Field[] => {
  return Object.keys(jsonFile.data).map(key => {
    return {
      component: 'text',
      name: `${key}`,
    }
  })
}

export const useJsonForm = <T>(jsonFile: JsonFile<T>, options: {
  id?: string
  label?: string
  fields?: Field[]
  actions?: FormOptions<any>['actions']
  buttons?: FormOptions<any>['buttons']
} = {}): [T, Form] => {
  const cms = useCMS()
  const id = options.id || jsonFile.fileRelativePath
  const label = options.label || jsonFile.fileRelativePath
  const fields = options.fields || generateFields(jsonFile)
  const actions = options.actions || []
  const buttons = options.buttons
  const api: CustomGitClient = cms.api.git
  const [values, form] = useForm(
    {
      id,
      label,
      fields,
      actions,
      buttons,
      async loadInitialValues() {
        if (cms.disabled) return jsonFile.data
        const result = await api.show(jsonFile.fileRelativePath)
        if (result.status === 'error') return jsonFile.data
        return JSON.parse(result.content)
      },
      async onSubmit() {
        const persist = await api.persistCachedChanges({ files: [jsonFile.fileRelativePath] })
        if (persist.status === 'error') return persist
        if (process.env.NODE_ENV !== 'production') return
        const commit = await api.commit({
          files: [jsonFile.fileRelativePath],
          message: `Commit from Tina: Update ${jsonFile.fileRelativePath}`,
        })
        if (commit.status === 'error') return commit
        const push = await api.push()
        if (push.status === 'error') return push
      },
      async reset() {
        await api.reset({ files: [id] })
      },
      onChange: formState => {
        api.writeToDisk({
          fileRelativePath: jsonFile.fileRelativePath,
          content: JSON.stringify(formState.values, null, 2),
        })
      },
    },
    { values: jsonFile.data, label }
  )

  return [values || jsonFile.data, form]
}

type TextFileLike = {
  fileRelativePath: string,
  content: string,
}

type MediaFileLike = {
  directory: string,
  content: File,
}

type ApiResult<T> =
  | T
  | { status: 'error', message: string }


export default class CustomGitClient {
  private _storagePromise: Promise<LocalForage> | null = null

  constructor(private baseUrl: string) { }

  private _getStorage(): Promise<LocalForage> {
    if (this._storagePromise) return this._storagePromise
    this._storagePromise = import('localforage')
      .then(({ default: localForage }) => {
        const storage = localForage.createInstance({
          driver: localForage.INDEXEDDB,
          name: 'sunrisemvmtsb_org',
          version: 1.0,
          storeName: 'git_data', // Should be alphanumeric, with underscores.
          description: 'locally cached content changes'
        })
        this._storagePromise = Promise.resolve(storage)
        return storage
      })
    return this._storagePromise
  }

  async commit(data: {
    files: string[]
    message?: string
    name?: string
    email?: string
  }): Promise<ApiResult<{ status: 'success' }>> {
    if (!Auth.isLoggedIn()) return { status: 'error', message: 'Not logged in' }

    try {
      const response = await fetch(`${this.baseUrl}/commit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(data),
      })
      const result = await response.json()
      if (result.status === 'failure') {
        return { status: 'error', message: result.error }
      }
      return result
    } catch (e) {
      return { status: 'error', message: e.message }
    }
  }

  async push(): Promise<ApiResult<{ status: 'success' }>> {
    if (!Auth.isLoggedIn()) return { status: 'error', message: 'Not logged in' }

    try {
      const response = await fetch(`${this.baseUrl}/push`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
      })
      const result = await response.json()
      if (result.status === 'failure') {
        return { status: 'error', message: result.error }
      }
      return result
    } catch (e) {
      return { status: 'error', message: e.message }
    }
  }

  async writeToDisk(data: TextFileLike): Promise<void> {
    if (!Auth.isLoggedIn()) return

    const storage = await this._getStorage()
    await storage.setItem(data.fileRelativePath, data)
  }

  async persistCachedChanges(data: { files: string[] }): Promise<ApiResult<{ status: 'success' }>> {
    if (!Auth.isLoggedIn()) return { status: 'error', message: 'Not logged in' }

    const storage = await this._getStorage()
    const writtenFiles: Array<string> = []
    let failure: string | null = null

    for (const file of data.files) {
      const fileData = await storage.getItem<TextFileLike>(file)
      if (!fileData) continue
      const result = await this._writeToServer(fileData)
      if ('status' in result) {
        failure = result.message
        break
      } else {
        writtenFiles.push(file)
      }
    }

    if (failure !== null) {
      try {
        await this._resetOnServer({ files: writtenFiles })
      } catch (e) {
        return { status: 'error', message: 'Server is now in an invalid state. Need to hard reset.' }
      }
      return { status: 'error', message: failure }
    }

    for (const file of data.files) {
      await storage.removeItem(file)
    }

    return { status: 'success' }
  }

  private async _writeToServer(data: TextFileLike): Promise<ApiResult<{ content: string }>> {
    try {
      const url = `${this.baseUrl}/${encodeURIComponent(data.fileRelativePath)}`
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(data),
      })
      const result = await response.json()
      return result
    } catch (e) {
      return { status: 'error', message: e.message }
    }
  }

  async writeMediaToDisk(data: MediaFileLike): Promise<ApiResult<{ filename: string }>> {
    if (!Auth.isLoggedIn()) return { status: 'error', message: 'Not logged in' }

    const formData = new FormData()
    formData.append('file', data.content)
    formData.append('directory', data.directory)
    try {
      const url = `${this.baseUrl}/upload`
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      })
      const data = await response.json()
      if (response.ok) return { filename: data.filename }
      else return data
    } catch (e) {
      return { status: 'error', message: e.message }
    }
  }

  async deleteFromDisk(data: { relPath: string }): Promise<ApiResult<{ status: 'success' }>> {
    if (!Auth.isLoggedIn()) return { status: 'error', message: 'Not logged in' }

    const storage = await this._getStorage()
    await storage.removeItem(data.relPath)

    try {
      const url = `${this.baseUrl}/${encodeURIComponent(data.relPath)}`
      const response = await fetch(url, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(data),
      })
      const result = await response.json()
      return result
    } catch (e) {
      return { status: 'error', message: e.message }
    }
  }

  async reset(data: { files: string[] }): Promise<ApiResult<{ status: 'success' }>> {
    if (!Auth.isLoggedIn()) return { status: 'error', message: 'Not logged in' }

    const storage = await this._getStorage()
    await Promise.all(data.files.map((file) => storage.removeItem(file)))
    return this._resetOnServer(data)
  }

  private async _resetOnServer(data: { files: string[] }) {
    if (!Auth.isLoggedIn()) return { status: 'error', message: 'Not logged in' }

    try {
      const response = await fetch(`${this.baseUrl}/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(data),
      })
      const result = await response.json()
      return result
    } catch (e) {
      return { status: 'error', message: e.message }
    }
  }

  async getFile(fileRelativePath: string): Promise<ApiResult<{ status: 'success', file: { path: string, content: Array<Media> } }>> {
    if (!Auth.isLoggedIn()) return { status: 'error', message: 'Not logged in' }

    const storage = await this._getStorage()
    const existing = await storage.getItem<TextFileLike | MediaFileLike>(fileRelativePath)

    if (existing && typeof existing.content === 'string') {
      // This is weird but it replicates the behavior of Repo.getFile on the backend
      return { status: 'success', file: { path: fileRelativePath, content: [] } }
    }

    try {
      const response = await fetch(`${this.baseUrl}/${encodeURIComponent(fileRelativePath)}`, {
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
      })
      const result = await response.json()
      return result
    } catch (e) {
      return { status: 'error', message: e.message }
    }
  }

  async show(fileRelativePath: string): Promise<ApiResult<{
    fileRelativePath: string,
    content: string,
    status: 'success',
  }>> {
    if (!Auth.isLoggedIn()) return { status: 'error', message: 'Not logged in' }

    try {
      const url = `${this.baseUrl}/show/${encodeURIComponent(fileRelativePath)}`
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
      })
      const result = await response.json()
      if (result.status === 'failure') {
        return { status: 'error', message: result.message }
      }
      return result
    } catch (e) {
      return { status: 'error', message: e.message }
    }
  }
}
