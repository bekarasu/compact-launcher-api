import { Document } from 'mongoose'
import { IPreparedQueryParams, IRequestQueryParams } from '../../../@types/server/IRequestQueryParams'
import { IService } from '../../../@types/server/services/IService'
import AbstractRepository from '../database/repositories/AbstractRepository'

export default abstract class BaseService<T extends Document> implements IService<T> {
  protected abstract repository: AbstractRepository<T>

  abstract delete(queryParams: IRequestQueryParams): Promise<boolean>
  abstract create(document: T): Promise<T>
  abstract update(document: T): Promise<T>
  abstract list(queryParams: IRequestQueryParams): Promise<T[] | Array<null>>
  abstract show(queryParams: IRequestQueryParams, urlParams: IRequestQueryParams): Promise<T | null>

  prepareRequestParams = (queryParams: IRequestQueryParams): IPreparedQueryParams => {
    let requestParams: IPreparedQueryParams = {}
    if (typeof queryParams.limit != 'undefined') {
      requestParams.limit = Number.parseInt(queryParams.limit.toString())
    }
    if (typeof queryParams.start != 'undefined') {
      requestParams.start = Number.parseInt(queryParams.start.toString())
    }
    if (typeof queryParams.status != 'undefined') {
      requestParams.status = Boolean(queryParams.status.toString())
    }
    return requestParams
  }
}
