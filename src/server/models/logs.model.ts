import * as mongoose from 'mongoose'
import { ILog } from '../../../@types/common/log'
export interface LogDocument extends ILog, mongoose.Document {
  _id: string
}

const LogsSchema: mongoose.Schema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ['rest', 'cli'],
    },
    endpoint: {
      type: String,
      required: true,
    },
    log: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['error', 'warning', 'success'],
      required: true,
    },
    statusCode: {
      type: Number,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
)
LogsSchema.pre<LogDocument>('save', function (next) {
  this.createdAt = new Date()
  next()
})
LogsSchema.pre<LogDocument>('updateOne', function (next) {
  this.updatedAt = new Date()
  next()
})
// TODO add the deleted_at support generally
export const Log = mongoose.model<LogDocument>('Log', LogsSchema)
