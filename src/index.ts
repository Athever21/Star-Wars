import express from "express";
import cookieParser from "cookie-parser";

import { MongoMemoryServer } from "mongodb-memory-server";
import { Mongoose } from "mongoose";

import logger from "@/loaders/logger";
import initDb from "@/loaders/initDb";
import cache from "@/loaders/cache";
import swagger from "@/loaders/swagger";

import errorMiddleware from "@/errors/errorMiddleware";
import authMiddleware from "@/helpers/authMiddleware";
import canAccessMiddleware from "@/helpers/canAccessMiddleware";

import userRoutes from "@/routes/userRoutes";
import tokenRoutes from "@/routes/tokenRoutes";
import filmRoutes from "@/routes/filmRoutes";
import peopleRoutes from "@/routes/peopleRoutes";
import planetRoutes from "@/routes/planetRoutes";
import spieceRoutes from "@/routes/spieceRoutes";
import starshipRoutes from "@/routes/starshipRoutes";
import vehicleRoutes from "@/routes/vehicleRoutes";
import additionalRoutes from "@/routes/additionalRoutes";

require("dotenv").config();

const app = express();

const dbPromise = initDb();
logger(app);
swagger(app);
cache();
app.use(express.json());
app.use(cookieParser());
// @ts-ignore
app.use(authMiddleware);

app.use("/users", userRoutes);
app.use("/token", tokenRoutes);

// @ts-ignore
app.use(canAccessMiddleware);
app.use("/films", filmRoutes);
app.use("/people", peopleRoutes);
app.use("/planets", planetRoutes);
app.use("/species", spieceRoutes);
app.use("/starships", starshipRoutes);
app.use("/vehicles", vehicleRoutes);
app.use("/", additionalRoutes);

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
