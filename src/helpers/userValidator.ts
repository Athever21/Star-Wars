import CustomError from "@/errors/CustomError";
import { existingEmailError } from "@/errors/errorsMessages";

export default (error: any, _: any, next: any) => {
  if (error.name === "ValidationError" && error.errors.email && error.errors.email.kind === "unique") {
    throw new CustomError(existingEmailError, 400);
  }

  next(error);
}