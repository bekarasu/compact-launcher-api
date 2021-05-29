import { NextFunction, Request, Response } from 'express'

import { body } from 'express-validator'
import { IProgramImage } from '../../../../../../@types/common/program'
import { IFormProperties, IGridProperties } from '../../../../../../@types/server/admin/resource'
import { fileSystem } from '../../../../config/filesystem'
import HttpException from '../../../../exceptions/api/HTTPException'
import { toURLConverter } from '../../../../helpers/routeServer'
import '../../../../libraries/ApiResponse'
import { Program, ProgramDocument } from '../../../../models/program.model'
import ProgramRepository from './../../../../database/repositories/ProgramRepository'
import ResourceController from './ResourceController'

class ProgramController extends ResourceController<ProgramDocument> {
  protected service = new ProgramRepository(Program)
  protected title = 'Programlar' // TODO localization support
  protected serviceURL = 'programs'
  grid(): IGridProperties {
    return {
      fields: ['slug'],
      actions: ['edit', 'show', 'delete'],
      disableAdd: true,
    }
  }
  form(): IFormProperties {
    return {
      items: [
        {
          name: 'slug',
          type: 'text',
        },
        {
          name: 'status',
          type: 'switch',
        },
        {
          name: 'content',
          type: 'wysiwyg',
        },
        {
          name: 'images',
          type: 'image',
        },
      ],
    }
  }
  show(): void {
    throw new Error('Method not implemented.')
  }
  // TODO
  processImages(req: Request): Array<IProgramImage> {
    if (typeof req.files != 'undefined') {
      // image processing
      let fileValues = Object.values(req.files)
      let images: Array<IProgramImage> = []
      fileValues.forEach((file: Express.Multer.File): void => {
        if (typeof images != 'undefined') {
          const programImage: IProgramImage = {
            resolation: null,
            path: file.path.replace(fileSystem.uploadPath, fileSystem.assetUrl), // replace the path because of we use this url later, we don't have to keep upload path
            chosenTime: 0,
            isLocal: true,
          }
          images.push(programImage)
        }
      })
      return images
    } else {
      return []
    }
  }

  validate = (method: string): Array<any> => {
    let rules = new Array()
    switch (method) {
      case 'create':
        rules.push(
          body('slug').custom(async (value) => {
            if (typeof value !== 'undefined') {
              // it is optional so check the value is exists first
              if (await this.service.isExists('slug', toURLConverter(value))) {
                return Promise.reject('Slug is already in use')
              }
            }
          }),
        )
        break
      case 'update':
        break
      default:
        throw new HttpException(422, 'Invalid Method')
    }
    rules.push(body('status').isBoolean().withMessage('Status must be true or false'))
    rules.push(body('content').isLength({ min: 10 }).withMessage('Content is too short'))
    return rules
  }

  /**
   *
   * @param req ExressJS Request object
   * @param res ExressJS Response object
   * @param next ExressJS Next function
   */
  update = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    let updatedProgram = {}
    if (req.body['content'] != null) updatedProgram['content'] = req.body['content']
    if (req.body['status'] != null) updatedProgram['status'] = req.body['status']
    try {
      await this.service.update(req.params.id, updatedProgram)
    } catch (e) {
      next(e)
    }
    return res.setMessage('Record Updated').setRedirect(`/${this.serviceURL}/list`)
  }
}
export default new ProgramController()
