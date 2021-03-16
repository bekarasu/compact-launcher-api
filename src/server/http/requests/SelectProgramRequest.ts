import { body, ValidationChain } from 'express-validator'
import ApiRequest from './ApiRequest'

class SelectProgramRequest extends ApiRequest {
  validate = (): Array<ValidationChain> => {
    let rules = new Array()
    rules.push(body('slug').notEmpty().withMessage('Slug is required'))
    rules.push(body('imageID').notEmpty().withMessage('Image ID is required'))
    return rules
  }
}

export default new SelectProgramRequest()
