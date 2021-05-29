import { NextFunction, Request, Response } from 'express'
import ImageFetcherFromServices from '../../../../services/externals/ImageRepoService/ImageFromServices'
import WallpaperAccess from '../../../../services/externals/ImageRepoService/Repos/WallpaperAccess'

class PlaygroundController {
  get = async (req: Request, res: Response, next: NextFunction) => {}
  post = async (req: Request, res: Response, next: NextFunction) => {
    let services: ImageFetcherFromServices = new ImageFetcherFromServices([new WallpaperAccess()])
    await services.fetchAllImages(req.body.slug)
    return res.setMessage('Program Fetched').customResponse(services.getImages())
  }
}
export default new PlaygroundController()
