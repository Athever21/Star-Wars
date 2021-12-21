import { NextFunction, Request, Response } from "express";

import CustomError from "@/errors/CustomError";
import { createUserMissing, invalidCredentials, invalidToken } from "@/errors/errorsMessages";
import { getUserByEmail } from "@/repositories/userRepository";
import argon from "argon2";
import { IUser } from "@/models/User";
import { createToken, getDataFromToken } from "@/helpers/jwt";

export const createTokenService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  const refreshToken = req.cookies["refreshToken"];

  if (!refreshToken && (!email || !password)) {
    if (!email || !password) return next(new CustomError(createUserMissing, 400));
    return next(new CustomError(invalidCredentials, 400));
  }
  
  if (refreshToken) {
    const tokenData = getDataFromToken(refreshToken, true);

    if (!tokenData) return next(new CustomError(invalidToken, 401));

    const newToken = createToken(tokenData, false);

    return res.json({ token: newToken });
  }
  
  
  const user = (await getUserByEmail(email)) as IUser;

  if (!user || !argon.verify(user.password, password))
    return next(new CustomError(invalidCredentials, 400));

  const token = createToken(user.toJSON(), false);
  const rToken = createToken(user.toJSON(), true);

  res.cookie('refreshToken', rToken, {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true
  });

  return res.json({token: token})
};

export const deleteRefreshToken = async(_: Request, res: Response) => {
  res.cookie('refreshToken', "", {
    maxAge: 0,
    httpOnly: true
  });

  return res.json({success: true});
}