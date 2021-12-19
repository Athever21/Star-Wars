import { Router } from "express";

import {
  createUserService,
  getAllUsersService,
  userMiddleware,
  getUserService,
  changeUserService,
  deleteUserService
} from "@/services/userServices";

const router = Router();

router.route("/").get(getAllUsersService).post(createUserService);

// @ts-ignore ???
router.route("/:id").all(userMiddleware).get(getUserService).put(changeUserService).delete(deleteUserService);

export default router;
