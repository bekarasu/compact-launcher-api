export interface IResolation {
  width: number | null
  height: number | null
}

export interface IImage {
  path: string
  resolation?: null | IResolation
}

export interface IImageRepo {
  serviceURL: string
  imagesLength: number // image limit from service
  images: Array<IImage | null>
}
