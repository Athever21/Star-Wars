import { NextFunction, Request, Response } from "express";
import CustomError from "./CustomError";

export default (
  error: CustomError,
  _: Request,
  res: Response,
  next: NextFunction
) => {
  if (!error) {
    return next();
  }

  return res
    .status(error.getCode())
    .json({ error: error.message });
};
