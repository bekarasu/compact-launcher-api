import mongoose, { Schema, Document } from "mongoose";

// useful for sql actions
export interface AdminUserDocument extends Document {
  name: string;
  username: string;
  password: string;
  status: boolean;
  avatar?: string;
}

const AdminUserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
  },
  avatar: String,
});
export const AdminUser = mongoose.model<AdminUserDocument>(
  "AdminUser",
  AdminUserSchema,
  "admin_users"
);
