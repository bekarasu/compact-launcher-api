import { Request, Response, NextFunction } from 'express'
import HttpException from '../../../exceptions/api/HTTPException'

export const Restful = (req: Request, res: Response, next: NextFunction) => {
  res.set('Content-Type', 'application/json')
  if (req.query.limit != null) {
    const castedLimit = Number.parseInt(req.query.limit.toString())
    if (!isNaN(castedLimit)) {
      if (castedLimit > 500) {
        throw new HttpException(500, 'Limit must be lesser than 500')
      }
    } else {
      throw new HttpException(500, 'Invalid Limit')
    }
  }
  next()
}
