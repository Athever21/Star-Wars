import { Router } from "express";

import {
  getSpeciesService,
  getSpecieService,
} from "@/services/specieServices";

const router = Router();

router.route("/").get(getSpeciesService);

router.route("/:id").get(getSpecieService);

export default router;
