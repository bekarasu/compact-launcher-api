import * as mongoose from 'mongoose'
import { IProgram } from '../../../@types/common/program'
import { IProgramImage } from './../../../@types/common/program.d'
export interface ProgramImageDocument extends IProgramImage, mongoose.Document {
  _id: mongoose.Types.ObjectId
}

export interface ProgramDocument extends IProgram, mongoose.Document {
  _id: mongoose.Types.ObjectId
  images: Array<ProgramImageDocument>
}
const ProgramImageSchema = new mongoose.Schema({
  path: String,
  resolation: {
    width: Number,
    height: Number,
  },
  chosenTime: {
    type: Number,
    default: 0,
  },
  isLocal: {
    type: Boolean,
    default: false,
  },
  isThumbnail: {
    type: Boolean,
    default: false,
  },
})

const ProgramSchema: mongoose.Schema = new mongoose.Schema({
  name: String,
  content: String,
  status: {
    type: Boolean,
    required: true,
    default: false,
  },
  lastFetchTime: {
    type: Date,
    default: null,
  },
  images: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProgramImage' }],
  deletedAt: {
    type: Date,
    default: null,
  },
})
export const Program: mongoose.Model<ProgramDocument> = mongoose.model<ProgramDocument>('Program', ProgramSchema)
export const ProgramImage: mongoose.Model<ProgramImageDocument> = mongoose.model<ProgramImageDocument>('ProgramImage', ProgramImageSchema)
