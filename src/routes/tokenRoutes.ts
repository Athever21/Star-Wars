import { Router } from "express";

import {
  createTokenService,
  deleteRefreshToken,
} from "@/services/tokenServices";

const router = Router();

router.route("/").post(createTokenService).delete(deleteRefreshToken);

export default router;
