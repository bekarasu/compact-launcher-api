import { IAdminUser } from "./../../../../../common/resources/types/user";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import jwt, { Secret, VerifyErrors } from "jsonwebtoken";
import HttpException from "../../../../exceptions/api/http-exception";
import "../../../../libraries/ApiResponse";
import * as AdminUserService from "../../../../services/admin_users.service";
dotenv.config();

class AuthController {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const adminUser = await AdminUserService.find(req.body.username);
      if (
        adminUser == null ||
        !(await bcrypt.compare(req.body.password, adminUser.password))
      ) {
        throw new HttpException(400, "Admin Not Found");
      }
      const user: object = {
        username: adminUser.username,
        name: adminUser.name,
      };
      if (process.env.JWT_SECRET == null) {
        throw new HttpException(500, "JWT Secret Token Not Defined");
      }
      const jwtToken = jwt.sign(user, process.env.JWT_SECRET, {
        expiresIn: "360000s",
      });
      res.customResponse({ access_token: jwtToken, user: user });
    } catch (e) {
      next(e);
    }
  }
  async getUserByToken(req: Request, response: Response) {
    let token: any = req.headers.authorization; // Express headers are auto converted to lowercase

    if (typeof token !== "undefined" && token.startsWith("Bearer ")) {
      token = token.slice(7, token.length); // Remove Bearer from string
    }
    if(typeof process.env.JWT_SECRET === 'undefined'){
      throw new HttpException(500, "JWT Secret Token Not Defined");
    }
    const JWT_SECRET:Secret = process.env.JWT_SECRET;
    jwt.verify(
      token,
      JWT_SECRET,
      (err: VerifyErrors | null, decoded: object|undefined): void => {
        if (err) {
          response
          .status(401)
          .setMessage("Unauthenticated")
          .customResponse();
        }else{
          response
            .status(200)
            .setMessage("Authorized")
            .customResponse({ user: decoded });
        }
       
      }
    );
    return response;
  }
}

export default new AuthController();
