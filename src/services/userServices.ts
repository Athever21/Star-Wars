import { NextFunction, Request, Response } from "express";

import CustomError from "@/errors/CustomError";
import { forbidden, userNotFound } from "@/errors/errorsMessages";

import { IUser } from "@/models/User";

import { changeUser, createUser, deleteUser, getAllUsers, getUserById } from "@/repositories/userRepository";
import { AuthRequest } from "@/helpers/authMiddleware";

interface UserRequest extends AuthRequest {
  user?: IUser
}

export const createUserService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user = await createUser(email, password);

    return res.json(user);
  } catch(e) {
    next(e);
  }
};

export const getAllUsersService = async (_: Request, res: Response) => {
  const users = await getAllUsers();
  return res.json(users);
}

export const userMiddleware = async (req: UserRequest, _: Response, next: NextFunction) => {
  const user = await getUserById(req.params.id) as IUser;

  if (!user) next(new CustomError(userNotFound, 404));

  req.user = user;

  if (req.method === "GET") return next();

  next();
};

export const getUserService = async (req: UserRequest, res: Response) => {
  return res.json(req.user);
}

export const changeUserService = async (req: UserRequest, res: Response, next: NextFunction) => {
  if (req.user?._id !== req.authUser.id) next(new CustomError(forbidden, 403));

  try {
    const user = await changeUser(req.authUser.id, req.body);
    return res.json(user);
  } catch(e) {
    return next(e);
  }
}

export const deleteUserService = async (req: UserRequest, res: Response, next: NextFunction) => {
  if (req.user?._id !== req.authUser.id) return next(new CustomError(forbidden, 403));

  await deleteUser(req.authUser.id || "");
  return res.json({success: true});
}