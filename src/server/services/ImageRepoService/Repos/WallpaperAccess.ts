import axios, { AxiosError, AxiosResponse } from 'axios'
import { parse } from 'node-html-parser'
import { sysLog } from '../../../helpers/logger'
import { toURLConverter } from '../../../helpers/routeServer'
import { AbstractImageRepo } from '../AbstractImageRepo'
import { IImageRepo } from '../IImageRepo'
import { Request } from 'express'

export default class WallpaperAccess extends AbstractImageRepo implements IImageRepo {
  serviceURL = 'https://wallpaperaccess.com'
  imagesLength = 10

  getImages = async (req: Request, resolation?: string): Promise<Array<string>> => {
    let axiosRes: AxiosResponse
    try {
      axiosRes = await axios.get(this.serviceURL + '/' + toURLConverter(req.params.slug))
    } catch (err) {
      let response: any = {}
      if (typeof err.response !== 'undefined') {
        response.headers = err.response.headers
        response.config = err.response.config
      }
      sysLog({
        endpoint: req.originalUrl,
        message: err.message,
        status: 'warning',
        type: 'rest',
        log: { response: response },
      })
      return []
    }
    if (axiosRes.status !== 200) {
      return []
    }
    const root = parse(axiosRes.data)
    let selector = '#maincontent .flexbox.column.maincol.single_image .flexbox_item[data-fullimg]'
    if (resolation != null && resolation != 'default') selector += '[data-or="' + resolation + '"]'
    const imagesFromService = root.querySelectorAll(selector)
    if (imagesFromService.length > this.imagesLength) {
      imagesFromService.splice(this.imagesLength)
    }
    let images = []
    for (let index in imagesFromService) {
      const imagePath = imagesFromService[index].getAttribute('data-fullimg')
      if (imagePath != null) {
        images.push(this.serviceURL + imagePath)
      }
    }
    return images
  }
}
