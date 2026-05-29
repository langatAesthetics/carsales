import { useEffect, useState } from "react";
import { api } from "../services/api";
import { Link } from "react-router-dom";

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
    engineSize?: string;
    imageUrl?: string;
    status?: string;
    description?: string;
}

export default function Vehicles() {
    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    // ================= FETCH VEHICLES =================
    const fetchCars = async () => {
        try {
            const res = await api.get("/cars");

            setCars(res.data || []);
        } catch (error) {
            console.error("Failed to fetch vehicles", error);
            setCars([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCars();
    }, []);

    // ================= SEARCH FILTER =================
    const filteredCars = cars.filter((car) =>
        `${car.title} ${car.brand} ${car.model}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    return (
        <section className="max-w-7xl mx-auto px-6 py-24">

            {/* ================= HERO ================= */}
            <div className="text-center max-w-4xl mx-auto">

                <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                    Explore Premium Vehicles
                </h1>

                <p className="mt-8 text-lg text-gray-600 leading-relaxed">
                    Browse our carefully selected collection of premium vehicles
                    built for performance, comfort, and reliability.
                </p>
            </div>

            {/* ================= FILTERS ================= */}
            <div className="bg-white shadow-lg rounded-3xl p-6 mt-16">

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                    {/* Brand */}
                    <select className="border rounded-xl px-4 py-3 outline-none">
                        <option>Brand</option>
                    </select>

                    {/* Model */}
                    <select className="border rounded-xl px-4 py-3 outline-none">
                        <option>Model</option>
                    </select>

                    {/* Price */}
                    <select className="border rounded-xl px-4 py-3 outline-none">
                        <option>Price Range</option>
                    </select>

                    {/* Search */}
                    <input
                        type="text"
                        placeholder="Search vehicles..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                    />
                </div>
            </div>

            {/* ================= RESULTS INFO ================= */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-16 gap-4">

                <div>
                    <h2 className="text-3xl font-bold">
                        Available Vehicles
                    </h2>

                    <p className="text-gray-600 mt-2">
                        Showing vehicles currently available in our inventory.
                    </p>
                </div>

                <div className="text-gray-500">
                    {filteredCars.length} Vehicles Found
                </div>
            </div>

            {/* ================= VEHICLES GRID ================= */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">

                {loading ? (
                    <div className="col-span-full text-center py-20 text-gray-500">
                        Loading vehicles...
                    </div>
                ) : filteredCars.length === 0 ? (
                    <div className="col-span-full text-center py-20 text-gray-500">
                        No vehicles found
                    </div>
                ) : (
                    filteredCars.map((car) => (
                        <div
                            key={car.id}
                            className="bg-white rounded-[20px] overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition duration-300 flex flex-col"
                        >

                            {/* ================= IMAGE ================= */}
                            <div className="relative overflow-hidden">

                                <img
                                    src={
                                        car.imageUrl ||
                                        "https://via.placeholder.com/600x400"
                                    }
                                    alt={car.title}
                                    className="w-full h-[320px] object-cover hover:scale-105 transition duration-500"
                                />

                                {/* STATUS BADGE */}
                                <div className="absolute top-4 right-4 bg-green-100 text-green-700 text-sm font-semibold px-4 py-2 rounded-full">
                                    {car.status || "Available"}
                                </div>
                            </div>

                            {/* ================= CONTENT ================= */}
                            <div className="p-5 flex flex-col flex-1">

                                {/* SPECS */}
                                <div className="grid grid-cols-3 gap-3 text-gray-500 text-sm leading-relaxed">

                                    <div>
                                        <p>{car.year || "-"}</p>
                                    </div>

                                    <div>
                                        <p>
                                            {car.transmission || "-"}
                                        </p>
                                    </div>

                                    <div>
                                        <p>
                                            {car.engineSize || "-"}
                                        </p>
                                    </div>
                                </div>

                                {/* TITLE */}
                                <h2 className="text-[32px] font-bold mt-4 leading-tight">
                                    {car.title}
                                </h2>

                                {/* DESCRIPTION */}
                                <p className="text-gray-500 mt-4 leading-relaxed line-clamp-3">
                                    {car.description ||
                                        "Premium vehicle with excellent performance, comfort, and reliability."}
                                </p>

                                {/* PRICE */}
                                <div className="mt-auto pt-8">
                                    <h3 className="text-4xl font-bold text-green-600">
                                        Ksh {car.price.toLocaleString()}
                                    </h3>
                                </div>

                                {/* BUTTON */}
                                <Link
                                    to={`/vehicles/${car.id}`}
                                    className="mt-6 w-full bg-black hover:bg-green-600 text-white py-4 rounded-2xl text-center font-semibold transition"
                                >
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* ================= CTA ================= */}
            <div className="bg-black rounded-3xl text-white mt-28 p-10 md:p-16 text-center">

                <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                    Looking For Something Specific?
                </h2>

                <p className="mt-6 text-gray-300 text-lg max-w-2xl mx-auto">
                    Contact our team and we’ll help you find the perfect vehicle
                    that matches your needs and budget.
                </p>

                <button className="mt-8 bg-green-600 hover:bg-green-700 px-8 py-4 rounded-2xl font-semibold transition">
                    Contact Us
                </button>
            </div>
        </section>
    );
}