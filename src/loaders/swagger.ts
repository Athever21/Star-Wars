import swaggerUi from "swagger-ui-express";
import swaggerDocument from "@/../swagger.json";
import { Application } from "express";

export default (app: Application) => {
  if (process.env.NODE_ENV !== "test") {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  }
}