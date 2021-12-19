import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

export default async () => {
  let uri = process.env.MONGO_URI || "mongodb://localhost/starWars";
  let mongod;
  let mongooseC;

  if (process.env.NODE_ENV === "test") {
    mongod = await MongoMemoryServer.create();
    uri = mongod.getUri();
  }

  try {
    mongooseC = await mongoose.connect(uri, {
      useNewUrlParser: true,
      // useCreateIndex: true,
      useUnifiedTopology: true,
      // useFindAndModify: false,
    });
  } catch (err) {
    console.log("Unable to connect to database", err);
  }

  return {
    mongod,
    mongooseC
  };
};
