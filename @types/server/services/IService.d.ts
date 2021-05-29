import { Document } from 'mongoose'
import { IRequestQueryParams } from '../IRequestQueryParams'

export interface IService<T extends Document> {
  list(queryParams: IRequestQueryParams): Promise<T[] | Array<null>>
  show(queryParams: IRequestQueryParams, urlParams: IRequestQueryParams): Promise<T | null>
  delete(queryParams: IRequestQueryParams): Promise<boolean>
  create(document: T): Promise<T>
  update(document: T): Promise<T>
}
