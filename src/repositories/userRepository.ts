import User from "@/models/User";
import CustomError from "@/errors/CustomError";
import { createUserMissing, userNotFound } from "@/errors/errorsMessages";

import argon2 from "argon2";

export const createUser = async (email: string, password: string) => {
  if (!email || !password) throw new CustomError(createUserMissing, 400);

  const hash = await argon2.hash(password);

  const user = new User({
    email,
    password: hash,
  });

  return user.save();
};

export const getAllUsers = () => {
  return User.find({});
};

export const getUserById = (id: string) => {
  return User.findById(id);
};

export const getUserByEmail = (email: string) => {
  return User.findOne({ email });
};

interface UserFields {
  email?: string;
  password?: string;
}

export const changeUser = async(id: string, fields: UserFields) => {
  const user = await getUserById(id);

  if (!user) throw new CustomError(userNotFound, 404);

  if (fields.password) {
    fields.password = await argon2.hash(fields.password);
  }

  for (const [key, value] of Object.entries(fields)) {
    //@ts-ignore
    user[key] = value;
  }

  return user.save();
}

export const deleteUser = async(id: string) => {
  await User.findByIdAndDelete(id);
}