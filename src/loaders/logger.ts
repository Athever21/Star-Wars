import { Application } from "express";

import morgan from "morgan";

export default (app: Application) => {
  if (process.env.NODE_ENV !== "test") {
    app.use(morgan('dev'));
  }
};