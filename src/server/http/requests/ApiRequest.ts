import { NextFunction, Request, Response } from 'express'
import { ValidationChain, validationResult } from 'express-validator'
import HttpException from '../../exceptions/api/HTTPException'

export default abstract class ApiRequest {
  onlyFirstError = false // it only affects validation message
  validate = async (req: Request, res: Response, next: NextFunction) => {
    const validateRules = this.rules()
    await Promise.all(validateRules.map((validation) => validation.run(req)))
    const validationError = validationResult(req).array({ onlyFirstError: this.onlyFirstError })
    if (validationError.length !== 0) {
      let message = ''
      if (this.onlyFirstError) {
        message = validationError[0].msg
      } else {
        validationError.forEach((error) => {
          if (message === '') {
            message += error.msg
          } else {
            message += ', ' + error.msg
          }
        })
      }

      next(
        new HttpException(422, 'Validation Failed: ' + message + ' in ' + validationError[Object.keys(validationError)[0]].param, {
          validation: validationError,
        }),
      ) // continue and skip this method in the request with error
    } else {
      next()
    }
  }
  abstract rules(): Array<ValidationChain>
}
