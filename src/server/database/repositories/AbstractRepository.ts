import { CallbackError, Document, FilterQuery, Model, Query, Types, UpdateQuery } from 'mongoose'
import HttpException from '../../exceptions/api/HTTPException'
import DBException from '../../exceptions/DBException'

export default abstract class AbstractRepository<T extends Document> {
  protected _model: Model<T>
  constructor(model: Model<T>) {
    this._model = model
  }

  /**
   * get the all documents in collection
   * @param where - where query for collection
   * @param select - select query for collection
   * @param limit - data count limiting
   * @param offset - start point to taking data
   */
  findAll = (where: object = {}, select: object = {}, limit: number | null = null, offset: number | null = null): Query<T[], T> => {
    where['deletedAt'] = { $eq: null }
    let data = this._model.find(where, select, null, (error: Error) => {
      if (error) {
        throw new HttpException(500, error.message)
      }
    })

    if (limit !== null && offset !== null && !isNaN(limit) && !isNaN(offset)) data.limit(limit).skip(offset)
    return data
  }

  /**
   * get the one document in collection
   * @param where
   * @param select
   */
  find = async (where?: any, select?: any): Promise<Query<T | null, T>> => {
    where['deletedAt'] = { $eq: null }
    const item = this._model.findOne(where, select, null, (error: CallbackError, doc: any) => {
      if (error) Promise.reject(error)
    })
    return item
  }

  /**
   * insert the item to collection
   * @param newItem item that will insert to collection
   */
  insert = async (newItem: object): Promise<T> => {
    const document = new this._model(newItem)
    const savedDoc = await document.save()
    if (document != savedDoc) {
      throw new DBException("Document can't saved", [newItem])
    }
    return document
  }

  update = async (id: Types.ObjectId | string, updatedModel: UpdateQuery<T>): Promise<Query<any, any>> => {
    return this._model.findByIdAndUpdate(id, updatedModel, {
      useFindAndModify: false,
      new: true,
    })
  }

  /**
   * hard/soft delete the document
   * @param id - delete the document by id
   */
  delete = async (id: string): Promise<boolean> => {
    let model = await this._model.find({ _id: id, deletedAt: { $exists: true } } as FilterQuery<any>).catch((err) => {
      // we use  "as FilterQuery<any>"" for fixing the bug in ts
      // check the deletedAt field for soft deleting
      if (err) throw new HttpException(500, err.message)
    })
    if (typeof model[0] === 'undefined') {
      // if model not found by deletedAt column, try to hard deleting by only id
      await this._model.deleteOne({ _id: id } as FilterQuery<any>).catch((err) => {
        if (err) throw new HttpException(500, err.message)
      })
    } else {
      let updatedField = {
        deletedAt: Date.now(),
      }
      await this._model.updateOne({ _id: id } as FilterQuery<any>, { $set: updatedField } as UpdateQuery<{}>).catch((err) => {
        // soft delete if document has deletedAt column
        if (err) throw new HttpException(500, err.message)
      })
    }
    return true
  }

  /**
   * delete the document even there is deletedAt column
   * @param id - delete the document by id
   */
  forceDelete = async (id: string): Promise<boolean> => {
    // force the deleting model even it has deletedAt field
    await this._model.findOneAndDelete({ _id: id } as FilterQuery<any>).catch((err) => {
      if (err) throw new HttpException(500, err.message)
    })
    return true
  }

  count = async (where: object = {}): Promise<number> => {
    where['deletedAt'] = { $eq: null }
    return this._model.countDocuments(where, function (err) {
      if (err) throw new HttpException(500, err.message)
    })
  }

  // TODO test this function
  isExists = async (key: string, value: string): Promise<boolean> => {
    let condition: any = {}
    condition[key] = value
    return this.find(condition).then((result) => {
      if (!result) {
        return false
      } else {
        return true
      }
    })
  }
}
