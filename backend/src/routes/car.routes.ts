import { Router } from "express";
import { createCarController,} from "../controllers/car.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", authMiddleware, createCarController);

export default router;