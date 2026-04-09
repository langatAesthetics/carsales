import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function Dashboard() {
  const [cars, setCars] = useState<any[]>([]);

  const fetchCars = async () => {
    try {
      const res = await api.get("/cars");
      setCars(res.data.data || res.data); // handle both formats
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      
      {/* Header */}
      <h1 className="text-2xl font-semibold mb-6">
        Car Listings
      </h1>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cars.map((car) => (
          <div
            key={car.id}
            className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition"
          >
            <h2 className="text-lg font-semibold">{car.title}</h2>
            <p className="text-gray-500">{car.brand}</p>

            <div className="mt-4 text-blue-600 font-bold">
              ${car.price}
            </div>

            <p className="text-sm text-gray-400 mt-2">
              {car.year}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
}