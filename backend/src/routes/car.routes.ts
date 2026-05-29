import { Router } from "express";

import {
  createCarController,
  getCarsController,
  getSingleCarController,
  updateCarController,
  deleteCarController,
} from "../controllers/car.controller";

import { authMiddleware } from "../middlewares/auth.middleware";

import { upload } from "../middlewares/upload.middleware";

const router = Router();

/* ================= PUBLIC ================= */

router.get("/", getCarsController);

router.get("/:id", getSingleCarController);

/* ================= ADMIN ================= */

router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  createCarController
);

router.put(
  "/:id",
  authMiddleware,
  upload.single("image"),
  updateCarController
);

router.delete(
  "/:id",
  authMiddleware,
  deleteCarController
);

export default router;