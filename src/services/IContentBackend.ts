import { Token } from 'typedi'

interface IContentBackend {
  getTextFile(args: { bucket: string, filename: string, exclude: Array<string>, }): Promise<Record<string, any> | null>
  saveTextFile(args: { bucket: string, filename: string, content: string }): Promise<void>
  renameAndSaveTextFile(args: { bucket: string, oldFilename: string, newFilename: string, content: string }): Promise<void>
  listTextBucket(args: { bucket: string }): Promise<Array<string>>
  deleteTextFile(args: { bucket: string, filename: string }): Promise<void>

  listMedia(): Promise<Array<string>>
  uploadMedia(args: { filename: string, content: ArrayBuffer }): Promise<void>
  deleteMedia(args: { filename: string }): Promise<void>
  getMediaPreviewEndpoint(): Promise<string>
}

const IContentBackend = new Token<IContentBackend>('IContentBackend')

export default IContentBackend
