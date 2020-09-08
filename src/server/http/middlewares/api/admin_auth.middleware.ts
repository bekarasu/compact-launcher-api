import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import HttpException from '../../../exceptions/api/http-exception';
import "../../../libraries/ApiResponse";
import "../../../libraries/ApiRequest";
export const Auth = (req: Request, response: Response, next: NextFunction) => {
    if (process.env.JWT_SECRET == null) {
        throw new HttpException(500, "JWT Secret Token Not Defined");
    }
    let token: string | null | undefined = req.headers.authorization; // Express headers are auto converted to lowercase

    if (typeof token !== 'undefined' && token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);// Remove Bearer from string
    }

    if (!token) {
        return response.status(401).setMessage("Unauthenticated").customResponse();
    }
    let tokenVerified: any = jwt.verify(token, process.env.JWT_SECRET, (err): boolean => {
        if (err) {
            return false;
        } else {
            return true;
        }
    });

    if (!tokenVerified) {
        return response.status(401).setMessage("Token Is Invalid").customResponse();
    }

    // TODO use real user
    req.user = {
        email: "burakarasu@sd.com",
        name: "burak",
        surname: "karasu"
    }

    next();
}