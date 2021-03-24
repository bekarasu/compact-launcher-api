import * as mongoose from "mongoose";
import { IAdminMenu } from "../../../@types/common/admin_menu";
export interface AdminMenuDocument extends IAdminMenu, mongoose.Document { }

const AdminMenuSchema: mongoose.Schema = new mongoose.Schema({
    ID: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    label: {
        type: Object,
        required: true,
    },
    url: {
        type: String
    },
    parentID: {
        type: Number,
        required: true,
        default: 0
    }
});
export const AdminMenu = mongoose.model<AdminMenuDocument>("AdminMenu", AdminMenuSchema, 'admin_menu');
