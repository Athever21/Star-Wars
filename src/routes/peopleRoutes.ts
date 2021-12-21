import { Router } from "express";

import {
  getPeopleService,
  getPeopleIdService,
} from "@/services/peopleServices";

const router = Router();

router.route("/").get(getPeopleService);

router.route("/:id").get(getPeopleIdService);

export default router;
