import app from "./app";
import authRoutes from "./routes/auth.routes";
import carRoutes from "./routes/car.routes";

app.use("/api/cars", carRoutes);

app.use("/api/auth", authRoutes);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});