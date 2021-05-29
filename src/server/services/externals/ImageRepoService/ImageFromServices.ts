import { AbstractImageRepo } from './AbstractImageRepo'
import { IImage } from '../../../../../@types/server/images'

export default class ImageFetcherFromServices {
  services: Array<AbstractImageRepo>
  images: Array<IImage>
  constructor(imageServices: Array<AbstractImageRepo>) {
    this.services = imageServices
    this.images = []
  }
  getImages = () => {
    return this.images
  }
  fetchAllImages = async (slug: string) => {
    for (let service of this.services) {
      await service.fetchImages(slug)
      for (let image of service.getImages()) {       
        this.images.push(image)
      }
    }
  }
}
