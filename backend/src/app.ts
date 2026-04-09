import express from "express";
import cors from "cors";
import carRoutes from "./routes/car.routes";
import { errorMiddleware } from "./middlewares/error.middleware";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/cars", carRoutes);

app.get("/", (req, res) => {
  res.send("API is running ");
});

app.use(errorMiddleware);
export default app;