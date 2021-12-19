import { model, Schema, Document } from "mongoose";
import uniqueV from "mongoose-unique-validator";
import { v4 as uuidv4 } from "uuid";

import userValidator from "@/helpers/userValidator";

const userSchema = new Schema(
  {
    _id: {
      type: String,
      default: uuidv4
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export interface IUser extends Document {
  _id: string;
  email: string;
  password: string;
}

userSchema.post('save', userValidator);

userSchema.plugin(uniqueV);
userSchema.set("toJSON", {
  transform: (_, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.password;
    delete ret.__v;
  }
});

export default model("User", userSchema);