import { IImage } from '../server/images'

export interface IProgramImage {
  path: string
  resolation?: IImage['resolation']
  chosenTime?: number
  isLocal?: boolean // is Local image or external
  isThumbnail?: boolean // is thumbnail picture
}

export interface IProgram {
  name?: string
  content: string
  status: boolean
  images?: Array<IProgramImage>
  lastFetchTime?: Date | null
  deletedAt?: Date | null
}

export interface ISearchIndex {
  slugKey?: string
  usedTime?: number
  programs?: IProgram[]
}
