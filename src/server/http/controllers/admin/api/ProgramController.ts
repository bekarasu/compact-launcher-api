import { Request } from 'express'
import { body } from 'express-validator'
import { IFormProperties, IGridProperties } from '../../../../../../@types/server/admin/resource'
import { fileSystem } from '../../../../config/filesystem'
import HttpException from '../../../../exceptions/api/HTTPException'
import '../../../../libraries/ApiResponse'
import ModelService from '../../../../services/ModelService.service'
import ResourceController from './ResourceController'
import { Program } from '../../../../models/program.model'
import { IProgramImage } from '../../../../../../@types/common/program'
import { toURLConverter } from '../../../../helpers/routeServer'

class ProgramController extends ResourceController {
  protected service: ModelService
  protected title = 'Programlar' // TODO localization support
  protected serviceURL = 'programs'
  constructor() {
    super()
    this.service = new ModelService(Program)
  }
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

  processImages(req: Request): Array<IProgramImage> {
    if (typeof req.files != 'undefined') {
      // image processing
      let fileValues = Object.values(req.files)
      let images: Array<IProgramImage> = []
      fileValues.forEach((file: Express.Multer.File): void => {
        if (typeof images != 'undefined') {
          const programImage: IProgramImage = {
            path: file.path.replace(fileSystem.uploadPath, fileSystem.assetUrl), // replace the path because of we use this url later, we don't have to keep upload path
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
}
export default new ProgramController()
