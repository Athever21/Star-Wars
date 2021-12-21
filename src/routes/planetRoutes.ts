import { Router } from "express";

import {
  getPlanetsService,
  getPlanetService,
} from "@/services/planetServices";

const router = Router();

router.route("/").get(getPlanetsService);

router.route("/:id").get(getPlanetService);

export default router;
