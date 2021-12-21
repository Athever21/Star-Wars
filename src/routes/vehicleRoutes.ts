import { Router } from "express";

import {
  getVehiclesServices,
  getVehicleServices,
} from "@/services/vehicleServices";

const router = Router();

router.route("/").get(getVehiclesServices);

router.route("/:id").get(getVehicleServices);

export default router;
