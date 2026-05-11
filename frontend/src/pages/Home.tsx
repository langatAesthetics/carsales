import { useEffect, useState } from "react";
import { api } from "../services/api";

interface Car {
    id: string;
    title: string;
    brand: string;
    model?: string;
    year?: number;
    price: number;
    mileage?: number;
    transmission?: string;
    fuelType?: string;
    imageUrl?: string;
}

export default function Home() {
    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCars = async () => {
        try {
            const res = await api.get("/cars");

            setCars(res.data || []);
        } catch (error) {
            console.error("Failed to fetch cars", error);

            setCars([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCars();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* FEATURED */}
            <section
                id="featured"
                className="max-w-7xl mx-auto px-6 py-20"
            >
                
                {loading ? (
                    <div className="py-20 text-center text-gray-500">
                        Loading inventory...
                    </div>
                ) : cars.length === 0 ? (
                    <div className="py-20 text-center text-gray-500">
                        No vehicles available
                    </div>
                ) : (
                    <div
                        id="inventory"
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {cars.map((car) => (
                            <div
                                key={car.id}
                                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition duration-300 border"
                            >
                                {/* IMAGE */}
                                <div className="h-64 overflow-hidden bg-gray-100">
                                    {car.imageUrl ? (
                                        <img
                                            src={car.imageUrl}
                                            alt={car.title}
                                            className="w-full h-full object-cover hover:scale-105 transition duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            No Image
                                        </div>
                                    )}
                                </div>

                                {/* CONTENT */}
                                <div className="p-6">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-blue-600 font-semibold">
                                            {car.brand}
                                        </p>

                                        <p className="text-sm text-gray-500">
                                            {car.year}
                                        </p>
                                    </div>

                                    <h3 className="text-2xl font-bold mt-2">
                                        {car.title}
                                    </h3>

                                    <div className="flex flex-wrap gap-3 mt-5 text-sm text-gray-600">
                                        {car.transmission && (
                                            <span className="bg-gray-100 px-3 py-1 rounded-full">
                                                {car.transmission}
                                            </span>
                                        )}

                                        {car.fuelType && (
                                            <span className="bg-gray-100 px-3 py-1 rounded-full">
                                                {car.fuelType}
                                            </span>
                                        )}

                                        {car.mileage && (
                                            <span className="bg-gray-100 px-3 py-1 rounded-full">
                                                {car.mileage.toLocaleString()} km
                                            </span>
                                        )}
                                    </div>

                                    <div className="mt-6 flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Starting Price
                                            </p>

                                            <p className="text-3xl font-bold">
                                                $
                                                {car.price.toLocaleString()}
                                            </p>
                                        </div>

                                        <button className="bg-black text-white px-5 py-3 rounded-xl hover:bg-gray-800 transition">
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}