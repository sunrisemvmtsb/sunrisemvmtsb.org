import IContentBackend from './IContentBackend'

export default class ApiContentBackend implements IContentBackend {
  async getTextFile({
    bucket,
    filename,
    exclude,
  }: {
    bucket: string,
    filename: string,
    exclude: Array<string>
  }): Promise<Record<string, any> | null> {
    const url = new URL('/api/content', window.location.origin)
    url.searchParams.append('method', 'getTextFile')
    url.searchParams.append('bucket', bucket)
    url.searchParams.append('filename', filename)
    exclude.forEach((key) => url.searchParams.append('exclude', key))
    const response = await fetch(url.href)
    if (response.status === 404) return null
    const data = await response.json()
    return data
  }

  async saveTextFile({
    bucket,
    filename,
    content,
  }: {
    bucket: string,
    filename: string,
    content: string
  }): Promise<void> {
    const url = new URL('/api/content', window.location.origin)
    url.searchParams.append('method', 'saveTextFile')
    const response = await fetch(url.href, {
      body: JSON.stringify({ filename, bucket, content }),
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
    if (!response.ok) throw Error('failed to save')
  }

  async renameAndSaveTextFile({
    bucket,
    oldFilename,
    newFilename,
    content
  }: {
    bucket: string,
    oldFilename: string,
    newFilename: string,
    content: string
  }): Promise<void> {
    const url = new URL('/api/content', window.location.origin)
    url.searchParams.append('method', 'renameAndSaveTextFile')
    const response = await fetch(url.href, {
      body: JSON.stringify({ oldFilename, newFilename, bucket, content }),
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    })
    if (!response.ok) throw Error('failed to rename')
  }

  async listTextBucket({
    bucket,
  }: {
    bucket: string,
  }): Promise<Array<string>> {
    if (bucket.includes('/')) throw Error('Subdirectories not allowed')
    const url = new URL('/api/content', window.location.origin)
    url.searchParams.append('method', 'listTextBucket')
    url.searchParams.append('bucket', bucket)
    const response = await fetch(url.href)
    const data = await response.json()
    return data
  }

  async deleteTextFile({
    bucket,
    filename,
  }: {
    bucket: string,
    filename: string
  }): Promise<void> {
    if (filename.includes('/') || bucket.includes('/')) throw Error('Subdirectories not allowed')
    const url = new URL('/api/content', window.location.origin)
    url.searchParams.append('method', 'deleteTextFile')
    url.searchParams.append('bucket', bucket)
    url.searchParams.append('filename', filename)
    const response = await fetch(url.href, {
      method: 'DELETE',
    })
    if (!response.ok) throw Error('failed to delete')
  }

  async listMedia(): Promise<Array<string>> {
    const url = new URL('/api/content', window.location.origin)
    url.searchParams.append('method', 'listMedia')
    const response = await fetch(url.href)
    const data = await response.json()
    return data
  }

  async uploadMedia({
    filename,
    content,
  }: {
    filename: string,
    content: ArrayBuffer,
  }): Promise<void> {
    if (filename.includes('/')) throw Error('Subdirectories not allowed')
    const file = new File([content], filename)
    const formData = new FormData()
    formData.append('file', file)
    const url = new URL('/api/content/upload', window.location.origin)
    url.searchParams.append('filename', filename)
    const response = await fetch(url.href, {
      method: 'POST',
      body: formData,
    })
    if (!response.ok) throw Error('failed to upload')
  }

  async deleteMedia({
    filename,
  }: {
    filename: string,
  }): Promise<void> {
    if (filename.includes('/')) throw Error('Subdirectories not allowed')
    const url = new URL('/api/content', window.location.origin)
    url.searchParams.append('method', 'deleteMedia')
    url.searchParams.append('filename', filename)
    const response = await fetch(url.href, {
      method: 'DELETE',
    })
    if (!response.ok) throw Error('failed to delete')
  }

  async getMediaPreviewEndpoint(): Promise<string> {
    const url = new URL('/api/content', window.location.origin)
    url.searchParams.append('method', 'getMediaPreviewEndpoint')
    const response = await fetch(url.href)
    const data = await response.json()
    return data.url
  }
}
