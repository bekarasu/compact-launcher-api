export interface IProgramImage {
  path: string
}
export interface IProgram {
  name: string
  slug: string
  content: string
  status: boolean
  images: Array<IProgramImage>
  deletedAt: Date | null
}
