import { Router } from "express";
import { createCarController,} from "../controllers/car.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  try { 
    const cars = await prisma.car.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });
    res.json(cars);
  }catch (error) {
    res.status(500).json({ message: "Error fetching cars"
    });
  }
});

router.post("/", authMiddleware, createCarController);

export default router;