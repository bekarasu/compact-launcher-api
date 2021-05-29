import { IUser, IAdminUser } from "../common/user";

declare namespace Express {
  export interface Request {
    user?: IUser;
    adminUser?: IAdminUser;
  }
}
