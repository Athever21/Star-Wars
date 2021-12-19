import express from "express";
import cookieParser from "cookie-parser";

import { MongoMemoryServer } from "mongodb-memory-server";
import { Mongoose } from "mongoose";

import logger from "@/loaders/logger";
import initDb from "@/loaders/initDb";

import errorMiddleware from "@/errors/errorMiddleware";
import authMiddleware from "@/helpers/authMiddleware";

import userRoutes from "@/routes/userRoutes";
import tokenRoutes from "@/routes/tokenRoutes";

require("dotenv").config();

const app = express();

const dbPromise = initDb();
logger(app);
app.use(express.json());
app.use(cookieParser());
// @ts-ignore
app.use(authMiddleware);

app.use("/users", userRoutes);
app.use("/token", tokenRoutes);

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;

export const server = app.listen(PORT, () => {
  if (process.env.NODE_ENV !== "test") console.log(`server listening at ${PORT}`);
});

server.on("close", () => {
  dbPromise.then(
    ({
      mongod,
      mongooseC,
    }: {
      mongod: MongoMemoryServer | undefined;
      mongooseC: Mongoose | undefined;
    }) => {
      mongod?.stop();
      mongooseC?.connection.close();
    }
  );
});
