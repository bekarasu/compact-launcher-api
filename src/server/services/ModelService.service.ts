import { CallbackError, Model, NativeError, Query, UpdateQuery } from 'mongoose'
import HttpException from '../exceptions/api/HTTPException'

class ModelService {
  model: Model<any, {}>
  constructor(model: Model<any>) {
    this.model = model
  }

  /**
   * get the all documents in collection
   * @param where - where query for collection
   * @param select - select query for collection
   * @param limit - data count limiting
   * @param offset - start point to taking data
   */
  findAll = (where: object = {}, select: object = {}, limit: number | null = null, offset: number | null = null): Query<any[], any, {}> => {
    where['deletedAt'] = { $eq: null }
    let data = this.model.find(where, select, null, (error: Error) => {
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
  find = (where?: any, select?: any): Query<any, any, {}> => {
    where['deletedAt'] = { $eq: null }
    const item = this.model.findOne(where, select, null, (error: CallbackError, doc: any) => {
      if (error) {
        throw new HttpException(500, error.message)
      }
    })
    return item
  }

  /**
   * insert the item to collection
   * @param newItem item that will insert to collection
   */
  insert = async (newItem: object): Promise<boolean> => {
    let model = new this.model(newItem)
    return await model.save().then((savedDoc: any) => {
      return savedDoc === model
    })
  }
  update = async (id: string, updatedModel: UpdateQuery<any>): Promise<Query<any[], any, {}>> => {
    return await this.model.findByIdAndUpdate(id, updatedModel, {
      useFindAndModify: false,
    })
  }

  /**
   * hard/soft delete the document
   * @param id - delete the document by id
   */
  delete = async (id: string): Promise<boolean> => {
    let model = await this.model.find({ _id: id, deletedAt: { $exists: true } }).catch((err) => {
      // check the deletedAt field for soft deleting
      if (err) throw new HttpException(500, err.message)
    })
    if (typeof model[0] === 'undefined') {
      // if model not found by deletedAt column, try to hard deleting by only id
      await this.model.deleteOne({ _id: id }).catch((err) => {
        if (err) throw new HttpException(500, err.message)
      })
    } else {
      let updatedField = {
        deletedAt: Date.now(),
      }
      await this.model.updateOne({ _id: id }, { $set: updatedField }).catch((err) => {
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
    await this.model.findOneAndDelete({ _id: id }).catch((err) => {
      if (err) throw new HttpException(500, err.message)
    })
    return true
  }

  count = async (where: object = {}): Promise<number> => {
    where['deletedAt'] = { $eq: null }
    return this.model.countDocuments(where, function (err) {
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

export default ModelService
