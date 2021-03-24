import { IFormProperties, IGridProperties } from '../../../../../../@types/server/admin/resource'
import { NextFunction, Request, Response } from 'express'
import LogRepository from '../../../../database/repositories/LogRepository'
import '../../../../libraries/ApiResponse'
import { Log, LogDocument } from './../../../../models/logs.model'
import ResourceController from './ResourceController'
import ServiceNotFoundException from '../../../../exceptions/api/ServiceNotFoundException'

class LogController extends ResourceController<LogDocument> {
  protected serviceURL: string = 'logs'
  protected service = new LogRepository(Log)
  protected title: string = 'Kayıtlar'
  grid(): IGridProperties {
    return {
      fields: ['endpoint', 'message', 'type', 'status', 'statusCode', 'createdAt'],
      actions: ['show'],
      disableAdd: true,
    }
  }
  form(): IFormProperties {
    throw new Error('Method not implemented.')
  }
  show(): void {
    throw new Error('Method not implemented.')
  }
  /**
   *
   * @param method
   */
  validate(): Array<null> {
    return []
  }
  processImages(): Array<null> {
    return []
  }
  update = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    throw new ServiceNotFoundException(req.originalUrl)
  }
}
export default new LogController()
