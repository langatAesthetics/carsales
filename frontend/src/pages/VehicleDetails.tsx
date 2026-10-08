import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
    Gauge,
    Fuel,
    Cog,
    Settings2,
    CarFront,
    CalendarDays,
    Route,
    ChevronLeft,
    ChevronRight,
    Heart,
} from "lucide-react";

import { api } from "../../services/api";
import SEO from "../seo/SEO";

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
    driveType?: string;
    engineSize?: number;
    condition?: string;
    status?: string;
    description?: string;
    imageUrl?: string;
}

export default function VehicleDetails() {
    const { id } = useParams();

    const [car, setCar] = useState<Car | null>(null);
    const [similarCars, setSimilarCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentImage, setCurrentImage] = useState<string>("");

    /*
     * Placeholder thumbnails for now.
     * Later these can be replaced with actual Cloudinary vehicle images.
     */
    const placeholderImages = [
        "https://via.placeholder.com/120x80?text=Image+1",
        "https://via.placeholder.com/120x80?text=Image+2",
        "https://via.placeholder.com/120x80?text=Image+3",
        "https://via.placeholder.com/120x80?text=Image+4",
        "https://via.placeholder.com/120x80?text=Image+5",
    ];

    const fetchCar = async () => {
        try {
            const res = await api.get(`/cars/${id}`);

            const vehicle = res.data;

            setCar(vehicle);
            setCurrentImage(
                vehicle.imageUrl ||
                "https://via.placeholder.com/900x600?text=No+Vehicle+Image"
            );

            /*
             * Fetch other vehicles for the Similar Vehicles section.
             */
            try {
                const vehiclesRes = await api.get("/cars");

                const otherVehicles = vehiclesRes.data
                    .filter((vehicleItem: Car) => vehicleItem.id !== vehicle.id)
                    .filter((vehicleItem: Car) => vehicleItem.status !== "SOLD")
                    .slice(0, 6);

                setSimilarCars(otherVehicles);
            } catch (similarError) {
                console.error(
                    "Failed to fetch similar vehicles",
                    similarError
                );
            }
        } catch (error) {
            console.error("Failed to fetch vehicle", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCar();
    }, [id]);

    /*
     * =========================
     * LOADING
     * =========================
     */

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                Loading vehicle...
            </div>
        );
    }

    /*
     * =========================
     * VEHICLE NOT FOUND
     * =========================
     */

    if (!car) {
        return (
            <>
                <SEO
                    title="Vehicle Not Found | Carsales"
                    description="The vehicle you are looking for could not be found on Carsales."
                    canonical={`/vehicles/${id || ""}`}
                    noIndex
                />

                <div className="min-h-screen flex flex-col items-center justify-center px-6">
                    <h1 className="text-4xl font-bold">
                        Vehicle Not Found
                    </h1>

                    <Link
                        to="/vehicles"
                        className="mt-6 bg-black text-white px-6 py-3 rounded-xl hover:bg-green-600 transition"
                    >
                        Back to Vehicles
                    </Link>
                </div>
            </>
        );
    }

    /*
     * =========================
     * SEO
     * =========================
     */

    const vehicleName = `${car.model || car.brand}${car.year ? ` ${car.year}` : ""
        }`;

    const seoTitle = `${vehicleName} for Sale | Carsales`;

    const seoDescription =
        car.description ||
        `${vehicleName} for sale in Kenya. ${car.transmission || ""
        } ${car.fuelType || ""} vehicle priced at Ksh ${car.price.toLocaleString()}. View specifications, mileage and availability on Carsales.`;

    const vehicleStructuredData = {
        "@context": "https://schema.org",
        "@type": "Product",

        name: vehicleName,

        description:
            car.description ||
            `${vehicleName} for sale in Kenya.`,

        image: car.imageUrl
            ? [car.imageUrl]
            : undefined,

        brand: {
            "@type": "Brand",
            name: car.brand,
        },

        model: car.model || undefined,

        offers: {
            "@type": "Offer",

            url: `https://carsales-4ew6.vercel.app/vehicles/${car.id}`,

            priceCurrency: "KES",

            price: car.price,

            availability:
                car.status?.toUpperCase() === "SOLD"
                    ? "https://schema.org/SoldOut"
                    : "https://schema.org/InStock",

            itemCondition:
                car.condition?.toUpperCase() === "NEW"
                    ? "https://schema.org/NewCondition"
                    : "https://schema.org/UsedCondition",
        },
    };

    return (
        <>
            <SEO
                title={seoTitle}
                description={seoDescription}
                canonical={`/vehicles/${car.id}`}
                image={car.imageUrl}
                type="website"
                structuredData={vehicleStructuredData}
            />

            <section className="min-h-screen bg-gray-50">

                {/* ================= MAIN CONTENT ================= */}

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                    {/* ================= BACK ================= */}

                    <Link
                        to="/vehicles"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-black transition mb-6"
                    >
                        <ChevronLeft size={18} />
                        Back to Vehicles
                    </Link>


                    {/* ================= VEHICLE ================= */}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

                        {/* ================= IMAGE GALLERY ================= */}

                        <div>

                            {/* MAIN IMAGE */}

                            <div className="relative bg-white rounded-2xl overflow-hidden border border-gray-200">

                                <div className="absolute top-4 right-4 z-10">

                                    <button
                                        type="button"
                                        className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition"
                                        aria-label="Save vehicle"
                                    >
                                        <Heart
                                            size={19}
                                            className="text-gray-600"
                                        />
                                    </button>

                                </div>

                                <img
                                    src={currentImage}
                                    alt={car.title}
                                    className="w-full h-87.5 sm:h-112.5 lg:h-130 object-cover"
                                />

                                {/* IMAGE NAVIGATION */}

                                <button
                                    type="button"
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-sm hover:bg-white transition"
                                    aria-label="Previous image"
                                >
                                    <ChevronLeft size={20} />
                                </button>

                                <button
                                    type="button"
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-sm hover:bg-white transition"
                                    aria-label="Next image"
                                >
                                    <ChevronRight size={20} />
                                </button>

                            </div>


                            {/* ================= THUMBNAILS ================= */}

                            <div className="flex gap-3 mt-4 overflow-x-auto pb-2">

                                {placeholderImages.map(
                                    (image, index) => (

                                        <button
                                            key={index}
                                            type="button"
                                            className="shrink-0 w-20 h-16 rounded-lg overflow-hidden border border-gray-200 hover:border-black transition"
                                        >
                                            <img
                                                src={image}
                                                alt={`Vehicle thumbnail ${index + 1
                                                    }`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>

                                    )
                                )}

                            </div>

                        </div>


                        {/* ================= VEHICLE INFORMATION ================= */}

                        <div>

                            {/* STATUS */}

                            <div className="flex flex-wrap items-center gap-3">

                                <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-xs font-semibold">
                                    {car.status === "AVAILABLE"
                                        ? "Available"
                                        : car.status || "Available"}
                                </span>

                                {car.condition && (
                                    <span className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-xs font-semibold">
                                        {car.condition}
                                    </span>
                                )}

                            </div>


                            {/* TITLE */}

                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-5 leading-tight text-gray-900">
                                {car.title}
                            </h1>


                            {/* BRAND / MODEL */}

                            <p className="text-gray-500 text-base sm:text-lg mt-2">
                                {car.brand}
                                {car.model
                                    ? ` • ${car.model}`
                                    : ""}
                            </p>


                            {/* PRICE */}

                            <div className="mt-6">

                                <p className="text-sm text-gray-500">
                                    Price
                                </p>

                                <h2 className="text-3xl sm:text-4xl font-bold text-green-600 mt-1">
                                    Ksh{" "}
                                    {car.price.toLocaleString()}
                                </h2>

                            </div>


                            {/* ================= SPECS ================= */}

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-8">

                                {/* YEAR */}

                                <div className="bg-white border border-gray-200 rounded-xl p-4">

                                    <CalendarDays
                                        size={19}
                                        className="text-gray-400"
                                    />

                                    <p className="text-xs text-gray-400 mt-3">
                                        Year
                                    </p>

                                    <p className="font-semibold text-gray-800 mt-1">
                                        {car.year || "-"}
                                    </p>

                                </div>


                                {/* MILEAGE */}

                                <div className="bg-white border border-gray-200 rounded-xl p-4">

                                    <Gauge
                                        size={19}
                                        className="text-gray-400"
                                    />

                                    <p className="text-xs text-gray-400 mt-3">
                                        Mileage
                                    </p>

                                    <p className="font-semibold text-gray-800 mt-1">
                                        {car.mileage
                                            ? `${car.mileage.toLocaleString()} km`
                                            : "-"}
                                    </p>

                                </div>


                                {/* ENGINE */}

                                <div className="bg-white border border-gray-200 rounded-xl p-4">

                                    <Cog
                                        size={19}
                                        className="text-gray-400"
                                    />

                                    <p className="text-xs text-gray-400 mt-3">
                                        Engine
                                    </p>

                                    <p className="font-semibold text-gray-800 mt-1">
                                        {car.engineSize
                                            ? `${car.engineSize} CC`
                                            : "-"}
                                    </p>

                                </div>


                                {/* TRANSMISSION */}

                                <div className="bg-white border border-gray-200 rounded-xl p-4">

                                    <Settings2
                                        size={19}
                                        className="text-gray-400"
                                    />

                                    <p className="text-xs text-gray-400 mt-3">
                                        Transmission
                                    </p>

                                    <p className="font-semibold text-gray-800 mt-1">
                                        {car.transmission || "-"}
                                    </p>

                                </div>


                                {/* FUEL */}

                                <div className="bg-white border border-gray-200 rounded-xl p-4">

                                    <Fuel
                                        size={19}
                                        className="text-gray-400"
                                    />

                                    <p className="text-xs text-gray-400 mt-3">
                                        Fuel
                                    </p>

                                    <p className="font-semibold text-gray-800 mt-1">
                                        {car.fuelType || "-"}
                                    </p>

                                </div>


                                {/* DRIVE TYPE */}

                                <div className="bg-white border border-gray-200 rounded-xl p-4">

                                    <Route
                                        size={19}
                                        className="text-gray-400"
                                    />

                                    <p className="text-xs text-gray-400 mt-3">
                                        Drive Type
                                    </p>

                                    <p className="font-semibold text-gray-800 mt-1">
                                        {car.driveType || "-"}
                                    </p>

                                </div>

                            </div>


                            {/* ================= DESCRIPTION ================= */}

                            <div className="bg-white border border-gray-200 rounded-2xl p-6 mt-8">

                                <h2 className="text-xl font-bold text-gray-900">
                                    Vehicle Description
                                </h2>

                                <p className="text-gray-600 leading-relaxed mt-4 whitespace-pre-line">
                                    {car.description ||
                                        "No description available for this vehicle."}
                                </p>

                            </div>


                            {/* ================= ACTIONS ================= */}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">

                                <button
                                    type="button"
                                    className="bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-semibold transition"
                                >
                                    Contact Dealer
                                </button>

                                <button
                                    type="button"
                                    className="bg-black hover:bg-gray-800 text-white py-4 rounded-xl font-semibold transition"
                                >
                                    Schedule Viewing
                                </button>

                            </div>

                        </div>

                    </div>


                    {/* ================= SIMILAR VEHICLES ================= */}

                    {similarCars.length > 0 && (

                        <section className="mt-16">

                            <div className="flex items-center justify-between mb-6">

                                <div>

                                    <h2 className="text-2xl sm:text-3xl font-bold">
                                        Similar Vehicles
                                    </h2>

                                    <p className="text-gray-500 mt-1">
                                        You may also be interested in these vehicles.
                                    </p>

                                </div>

                                <Link
                                    to="/vehicles"
                                    className="hidden sm:block text-sm font-semibold text-green-600 hover:text-green-700"
                                >
                                    View All
                                </Link>

                            </div>


                            {/* ================= SIMILAR VEHICLE GRID ================= */}

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

                                {similarCars.map((similarCar) => (

                                    <Link
                                        key={similarCar.id}
                                        to={`/vehicles/${similarCar.id}`}
                                        className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition group"
                                    >

                                        {/* IMAGE */}

                                        <div className="h-44 bg-gray-200 overflow-hidden relative">

                                            <img
                                                src={
                                                    similarCar.imageUrl ||
                                                    "https://via.placeholder.com/600x400?text=No+Image"
                                                }
                                                alt={similarCar.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />

                                            {similarCar.condition && (
                                                <span className="absolute top-3 right-3 bg-white/90 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                                                    {similarCar.condition}
                                                </span>
                                            )}

                                        </div>


                                        {/* CONTENT */}

                                        <div className="p-4">

                                            <p className="text-xs text-gray-400">
                                                {similarCar.year || "-"}
                                                {similarCar.transmission
                                                    ? ` • ${similarCar.transmission}`
                                                    : ""}
                                            </p>

                                            <h3 className="font-bold text-lg mt-1 line-clamp-1">
                                                {similarCar.title}
                                            </h3>


                                            <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">

                                                <span className="flex items-center gap-1">
                                                    <Gauge size={14} />

                                                    {similarCar.mileage
                                                        ? `${similarCar.mileage.toLocaleString()} km`
                                                        : "-"}
                                                </span>

                                                <span className="flex items-center gap-1">
                                                    <Fuel size={14} />

                                                    {similarCar.fuelType || "-"}
                                                </span>

                                            </div>


                                            <p className="text-lg font-bold text-green-600 mt-4">
                                                Ksh{" "}
                                                {similarCar.price.toLocaleString()}
                                            </p>

                                        </div>

                                    </Link>

                                ))}

                            </div>

                        </section>

                    )}

                </div>

            </section>
        </>
    );
}