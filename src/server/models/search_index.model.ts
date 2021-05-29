import * as mongoose from 'mongoose'
import { ISearchIndex } from '../../../@types/common/program'
import { ProgramDocument } from './program.model'

export interface SearchIndexDocument extends ISearchIndex, mongoose.Document {
  _id: mongoose.Types.ObjectId
  programs: ProgramDocument[]
}

const SearchIndexSchema: mongoose.Schema = new mongoose.Schema({
  slugKey: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  usedTime: {
    type: Number,
    default: 0,
  },
  programs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Program' }],
})
export const SearchIndex: mongoose.Model<SearchIndexDocument> = mongoose.model<SearchIndexDocument>('SearchIndex', SearchIndexSchema)
