export interface IProgramImage {
  path: string
}

export interface IProgramImages {
  [key: string]: Array<IProgramImage>
}
export interface IProgram {
  slug: string
  content: string
  status: boolean
  images: IProgramImages
  deletedAt?: Date | null
}
