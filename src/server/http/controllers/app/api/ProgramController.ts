import { NextFunction, Request, Response } from 'express'
import { IProgramImage } from '../../../../../../@types/common/program'
import ProgramImageRepository from '../../../../database/repositories/ProgramImageRepository'
import ProgramRepository from '../../../../database/repositories/ProgramRepository'
import { toURLConverter } from '../../../../helpers/routeServer'
import '../../../../libraries/ApiResponse'
import { Program, ProgramDocument, ProgramImage } from './../../../../models/program.model'
import WallpaperAccess from './../../../../services/ImageRepoService/Repos/WallpaperAccess'
class ProgramController {
  private service: ProgramRepository = new ProgramRepository(Program)
  list = async (req: Request, res: Response, next: NextFunction) => {
    let limitParam: string = typeof req.query.limit != 'undefined' ? req.query.limit.toString() : ''
    let offsetParam: string = typeof req.query.start != 'undefined' ? req.query.start.toString() : ''
    let limit: number | null = Number.parseInt(limitParam)
    let offset: number | null = Number.parseInt(offsetParam)
    const where = {
      status: typeof req.query.status != 'undefined' ? Boolean(req.query.status.toString()) : false,
    }
    const data = await this.service.findAll(where, {}, limit, offset)
    return res.setMessage('Program Fetched').customResponse(data)
  }

  show = async (req: Request, res: Response, next: NextFunction) => {
    let where = {
      slug: req.params.slug,
    }
    if (!(await this.service.isExists('slug', req.params.slug))) {
      const newProgram = {
        slug: toURLConverter(req.params.slug),
        content: '',
        status: false, // we will set true after an image is set
      }
      await this.service.insert(newProgram)
    }
    let resolation: string = 'default'
    if (typeof req.query.resolation !== 'undefined') {
      resolation = req.query.resolation.toString()
    }
    let program: ProgramDocument | null = await this.service.find(where, 'slug content images')
    if (program == null) {
      return res.status(400).setMessage('Program Not Found').customResponse()
    }
    program = await program
      .populate({
        path: 'images',
        match: { resolation: resolation },
        select: 'resolation path chosenTime',
      })
      .execPopulate()
    if (program.images.length === 0) {
      const imagesPath = await new WallpaperAccess().getImages(req, resolation)
      if (imagesPath.length !== 0) {
        const programImageRepository = new ProgramImageRepository(ProgramImage)
        for (let index in imagesPath) {
          const programImage: IProgramImage = {
            resolation: resolation,
            path: imagesPath[index],
            chosenTime: 0,
            isLocal: false,
          }
          const programImageModel = new ProgramImage(programImage)
          programImageRepository.insertDocument(programImageModel)
          delete programImageModel.isLocal // we dont need it
          program.images.push(programImageModel)
        }
        await program.save()
      }
    }
    return res.setMessage('Program Fetched').customResponse({ program: program })
  }

  selectProgram = async (req: Request, res: Response, next: NextFunction) => {
    const where = {
      slug: req.body.slug,
      images: { _id: req.body.imageID },
    }
    let model = null
    try {
      model = await this.service.find(where)
    } catch (e) {
      next(e)
      return
    }
    if (model == null) {
      return res.status(404).setMessage('Program or Image Not Found').customResponse()
    }
    const programImageRepository = new ProgramImageRepository(ProgramImage)
    let image = await programImageRepository.find({ _id: req.body.imageID })
    if (image == null) {
      return res.status(404).setMessage('Image Not Found').customResponse()
    }
    image.chosenTime++
    image.save()
    image = await programImageRepository.downloadFromSource(image)
    return res.setMessage('Image selected').customResponse({ image: image.path })
  }
}
export default new ProgramController()
