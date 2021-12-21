import { Router } from "express";

import {
  getAllFilmsMiddleware,
  uniqueWordsService,
  charactersService,
} from "@/services/additionalServices";

const router = Router();

router
  // @ts-ignore ???
  .use(getAllFilmsMiddleware)
  .get("/unique_words", uniqueWordsService)
  .get("/character_most_apperance", charactersService);

export default router;
