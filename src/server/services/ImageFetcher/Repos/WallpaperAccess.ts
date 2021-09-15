import { parse } from 'node-html-parser'
import { IImage } from '../../../../../@types/server/images'
import { toURLConverter } from '../../../helpers/routeServer'
import { AbstractImageFetcher } from '../AbstractImageFetcher'

export default class WallpaperAccess extends AbstractImageFetcher {
  serviceURL = 'https://wallpaperaccess.com'
  imagesLength = 100 // image limit from service
  images = Array()

  fetchImages = async (slug: string): Promise<void> => {
    const response = await this.requestToService(this.serviceURL + '/' + toURLConverter(slug))
    if (response === null) {
      return
    }
    const root = parse(response.data)
    let selector = '#maincontent .flexbox.column.maincol.single_image .flexbox_item[data-fullimg]'
    const imagesFromService = root.querySelectorAll(selector)
    if (imagesFromService.length > this.imagesLength) {
      imagesFromService.splice(this.imagesLength)
    }
    for (let index in imagesFromService) {
      if (imagesFromService[index] != null) {
        const imagePath: string | undefined = imagesFromService[index].getAttribute('data-fullimg')
        const resolation: string | undefined = imagesFromService[index].getAttribute('data-or')
        let resolations: string[] | null = null
        if (resolation != null) {
          resolations = resolation.split('x') // ex: 1920x1080
        }
        if (imagePath != null) {
          let image: IImage = {
            path: this.serviceURL + imagePath,
          }
          if (resolations !== null) {
            image['resolation'] = {
              width: resolations[0] != null ? Number.parseInt(resolations[0]) : null,
              height: resolations[1] != null ? Number.parseInt(resolations[1]) : null,
            }
          }
          this.images.push(image)
        }
      }
    }
  }
}
