import axios, { AxiosResponse } from 'axios'
import { IImage } from '../../../../../@types/server/images'

export abstract class AbstractImageRepo {
  protected abstract serviceURL: string
  protected abstract imagesLength: number
  protected abstract images: IImage[]

  abstract fetchImages(slug: string): Promise<void>
  getImages = () => {
    return this.images
  }

  requestToService = async (url: string): Promise<AxiosResponse | null> => {
    let axiosRes: AxiosResponse
    try {
      axiosRes = await axios.get(url)
    } catch (err) {
      let response: any = {}
      if (typeof err.response !== 'undefined') {
        response.headers = err.response.headers
        response.config = err.response.config
      }
    //   sysLog({
    //     endpoint: req.originalUrl,
    //     message: err.message,
    //     status: 'warning',
    //     type: 'rest',
    //     log: { response: response },
    //   })
      return null
    }    
    return axiosRes
  }
}
