import { Request, Response, NextFunction } from "express";
import { forbidden } from "@/errors/errorsMessages";
import CustomError from "@/errors/CustomError";
import { IUser } from "@/models/User";

export interface AuthRequest extends Request {
  authUser: IUser;
}

export default (req: AuthRequest, _: Response, next: NextFunction) => {
  if (!req.authUser) {
    return next(new CustomError(forbidden, 403))
  }

  return next();
}