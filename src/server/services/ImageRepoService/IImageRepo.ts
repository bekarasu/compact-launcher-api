import { Request } from 'express'

export interface IImageRepo {
  serviceURL: string
  imagesLength: number
  getImages: (req: Request, resolation?: string) => Promise<Array<string>>
}
