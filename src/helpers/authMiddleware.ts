import { Request, Response, NextFunction } from "express";
import { invalidAuthHeader } from "@/errors/errorsMessages";
import CustomError from "@/errors/CustomError";
import { getDataFromToken } from "./jwt";
import { IUser } from "@/models/User";

export interface AuthRequest extends Request {
  authUser: IUser;
}

export default (req: AuthRequest, _: Response, next: NextFunction) => {
  const auth = req.headers.authorization;

  if (!auth) return next();

  if (!auth.startsWith("Bearer ")) return next(new CustomError(invalidAuthHeader, 401));

  try {
    const tokenData = getDataFromToken(auth.substring(7), false);

    req.authUser = tokenData as IUser;
    return next();
  } catch {
    return next(new CustomError(invalidAuthHeader, 401));
  }
}