import { Router } from "express";

import {
  getFilmsServices,
  getFilmService,
  getIdFilmMiddleware
} from "@/services/filmServices";

const router = Router();

router.route("/").get(getFilmsServices);

router.route("/:id").all(getIdFilmMiddleware).get(getFilmService);

export default router;
