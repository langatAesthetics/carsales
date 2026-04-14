import { useEffect, useState } from "react";
import {api} from "../services/api";

interface Car {
    id: string;
    title: string;
    brand: string;
    price: number;
    imageUrl?: string;
}

export default function Home() {
    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCars = async () => {
        try {
            const res = await api.get("/cars");

            console.log("API RESPONSE:", res.data);

            setCars(res.data?.data || []); // ✅ SAFE FIX
        } catch (error) {
            console.error("Failed to fetch cars", error);
            setCars([]); // ✅ fallback safety
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCars();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* HERO */}
            <div className="bg-black text-white p-10 text-center">
                <h1 className="text-3xl font-bold">Find Your Dream Car</h1>
                <p className="text-gray-300 mt-2">
                    Browse our premium collection
                </p>
            </div>

            {/* CONTENT */}
            <div className="p-6 max-w-6xl mx-auto">
                {loading ? (
                    <p className="text-center">Loading cars...</p>
                ) : cars.length === 0 ? (
                    <p className="text-center text-gray-500">
                        No cars available
                    </p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {cars.map((car) => (
                            <div
                                key={car.id}
                                className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
                            >
                                {/* IMAGE */}
                                <div className="h-48 bg-gray-200">
                                    {car.imageUrl ? (
                                        <img
                                            src={car.imageUrl}
                                            alt={car.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-400">
                                            No Image
                                        </div>
                                    )}
                                </div>

                                {/* DETAILS */}
                                <div className="p-4">
                                    <h2 className="font-semibold text-lg">
                                        {car.title}
                                    </h2>
                                    <p className="text-gray-500">{car.brand}</p>

                                    <p className="mt-2 font-bold text-black">
                                        ${car.price}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}