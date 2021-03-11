import * as mongoose from "mongoose";
import { ILog } from "../../../@types/common/log";
export interface LogModel extends ILog, mongoose.Document { }

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
            type: Object,
            required: true,
        },
        message: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ["error", "warning", "success"],
            required: true
        },
        statusCode: {
            type: Number
        },
        deletedAt: {
            type: Date,
            default: null
        }
    },
    { timestamps: true },
);
LogsSchema.pre<LogModel>("save", function () {
    this.createdAt = new Date();
});
LogsSchema.pre<LogModel>("updateOne", function () {
    this.updatedAt = new Date();
});
// TODO add the deleted_at support generally
export const Log = mongoose.model<LogModel>("Log", LogsSchema);
