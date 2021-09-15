import { NextFunction, Request, Response } from 'express'
import ServiceException from '../../../../exceptions/ServiceException'
import '../../../../libraries/ApiResponse'
import { ProgramService } from '../../../../services/ProgramService'

class ProgramController {
  private service = new ProgramService()

  list = async (req: Request, res: Response, next: NextFunction) => {
    const data = await this.service.list(req.query)
    if (data.length === 0) {
      return res.setMessage('Program Not Found').customResponse()
    }
    return res.setMessage('Program Fetched').customResponse(data)
  }

  show = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const program = await this.service.show(req.query, req.params)
      if (program == null) {
        return res.status(204).setMessage('Program Not Found').customResponse()
      }
      return res.setMessage('Program Fetched').customResponse({ program: program })
    } catch (e) {
      if (e instanceof ServiceException) {
        return res.setMessage(e.message).customResponse()
      } else {
        next(e)
      }
    }
  }

  selectProgram = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const image = await this.service.selectProgram(req.body)
      return res.setMessage('Image selected').customResponse(image)
    } catch (e) {
      if (e instanceof ServiceException) {
        return res.setMessage(e.message).customResponse()
      } else {
        next(e)
      }
    }
  }
}
export default new ProgramController()
