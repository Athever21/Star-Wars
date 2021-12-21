import { Router } from "express";

import {
  getStarshipsService,
  getStarshipService,
} from "@/services/starshipServices";

const router = Router();

router.route("/").get(getStarshipsService);

router.route("/:id").get(getStarshipService);

export default router;
