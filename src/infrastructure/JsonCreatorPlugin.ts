import { TinaCMS, Field, AddContentPlugin } from 'tinacms'
import { FORM_ERROR } from 'final-form'
import CustomGitClient from './CustomGitClient'

interface AnyField extends Field {
  [key: string]: any
}

export type CreateJsonButtonOptions<T> = {
  label: string
  fields: AnyField[]
  filename(form: T): Promise<string>
  beforeCreate(form: T): T
  afterCreate(form: T): void
}

const MISSING_FILENAME_MESSAGE =
  'createJsonButton must be given `filename(form): string`'
const MISSING_FIELDS_MESSAGE =
  'createJsonButton must be given `fields: Field[]` with at least 1 item'

export default class JsonCreatorPlugin<TData = any> implements AddContentPlugin<TData> {
  __type: 'content-creator' = 'content-creator'
  name: AddContentPlugin<TData>['name']
  fields: AddContentPlugin<TData>['fields']

  afterCreate: (response: TData) => void
  beforeCreate: (input: TData) => TData
  filename: (form: TData) => Promise<string>

  constructor(
    options: CreateJsonButtonOptions<TData>
  ) {
    if (!options.filename) {
      console.error(MISSING_FILENAME_MESSAGE)
      throw new Error(MISSING_FILENAME_MESSAGE)
    }

    if (!options.fields || options.fields.length === 0) {
      console.error(MISSING_FIELDS_MESSAGE)
      throw new Error(MISSING_FIELDS_MESSAGE)
    }

    this.name = options.label
    this.fields = options.fields
    this.filename = options.filename
    this.beforeCreate = options.beforeCreate
    this.afterCreate = options.afterCreate
  }

  async onSubmit(form: TData, cms: TinaCMS) {
    const fileRelativePath = await this.filename(form)
    const api = cms.api.git as CustomGitClient
    try {
      const updated = this.beforeCreate(form)

      await api.writeToDisk({
        fileRelativePath,
        content: JSON.stringify(updated)
      })
      const persist = await api.persistCachedChanges({
        files: [fileRelativePath]
      })
      if (persist.status === 'error') throw Error(persist.message)

      const commit = await api.commit({
        files: [fileRelativePath],
        message: `[ADMIN] Created page: ${fileRelativePath}`,
      })
      if (commit.status === 'error') throw Error(commit.message)

      if (process.env.NODE_ENV === 'production') {
        const push = await api.push()
        if (push.status === 'error') throw Error(push.message)
      }

      if (this.afterCreate) this.afterCreate(updated)
    } catch (e) {
      return { [FORM_ERROR]: e } as unknown as void // lol cool types guys
    }
  }
}
