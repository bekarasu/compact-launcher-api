export interface IProgramImage {
  path: string
  resolation: string
  chosenTime: number
  isLocal?: boolean // is Local image or external
}

export interface IProgram {
  slug: string
  content: string
  status: boolean
  images: Array<IProgramImage>
  deletedAt?: Date | null
}
