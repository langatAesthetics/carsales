import app from "./app";
import authRoutes from "./routes/auth.routes";
import carRoutes from "./routes/car.routes";
import dotenv from "dotenv";

dotenv.config();

app.use("/api/cars", carRoutes);

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});