import { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'
import HttpException from '../../../../exceptions/api/HTTPException'
import { toURLConverter } from '../../../../helpers/routeServer'
import '../../../../libraries/ApiResponse'
import ModelService from '../../../../services/ModelService.service'
import { IProgram } from './../../../../../../@types/common/program.d'
import { Program } from './../../../../models/program.model'
import WallpaperAccess from './../../../../services/ImageRepoService/Repos/WallpaperAccess'

class ProgramController {
  private service: ModelService
  constructor() {
    this.service = new ModelService(Program)
  }
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
    const where = {
      // status: true,
      slug: req.params.slug,
    }
    if (!(await this.service.isExists('slug', req.params.slug))) {
      const newProgram: IProgram = {
        slug: toURLConverter(req.params.slug),
        content: '',
        images: {},
        status: false, // we will set true after an image is set
      }
      await this.service.insert(newProgram)
    }
    let program = await this.service.find(where)
    const resolation: string = typeof req.query.resolation !== 'undefined' ? req.query.resolation.toString() : 'default'
    new Promise(async (resolve) => {
      // we have to wait this block for sending response, so use the Promise
      if (
        typeof program.images === 'undefined' ||
        typeof program.images.get(resolation) === 'undefined' ||
        program.images.get(resolation).length === 0
      ) {
        const WallpaperAccessRepo = new WallpaperAccess()
        await WallpaperAccessRepo.getImages(req, resolation).then(async (imagesPath) => {
          if (imagesPath.length !== 0) {
            let images = []
            for (let index in imagesPath) {
              images.push({ path: imagesPath[index] })
            }
            program.images.set(resolation, images)
            resolve(await this.service.update(program._id, program)) // return the updated document
          }
        })
      } else {
        resolve(program) // dont touch and return directly
      }
    }).then((updatedProgram) => {
      return res.setMessage('Program Fetched').customResponse({ program: updatedProgram })
    })
  }

  selectProgram = async (req: Request, res: Response, next: NextFunction) => {
    const validationError = validationResult(req)
    if (!validationError.isEmpty()) {
      const validation = validationError.mapped()
      const firstValidationMessage = validation[Object.keys(validation)[0]].msg
      next(
        new HttpException(422, 'Validation Failed: ' + firstValidationMessage + ' in ' + validation[Object.keys(validation)[0]].param, {
          validation: validation,
        }),
      ) // continue and skip this method in the request with error
    } else {
      const where = {
        slug: req.body.slug,
        // `images.._id: ,
      }
      where[`images.${req.body.resolation}._id`] = req.body.imageID
      let model = await this.service.find(where)
      if (!model) {
        return res.status(404).setMessage('Program Not Found').customResponse()
      }
      // TODO continue there, consider what will happen after user choose the image
      return res.setMessage('Image selected').customResponse({ program: model })
    }
  }
}
export default new ProgramController()
