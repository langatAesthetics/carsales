import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
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
    const [loading, setLoading] = useState(true);

    const fetchCar = async () => {
        try {
            const res = await api.get(`/cars/${id}`);

            setCar(res.data);
        } catch (error) {
            console.error("Failed to fetch vehicle", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCar();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                Loading vehicle...
            </div>
        );
    }

    if (!car) {
        return (
            <>
                <SEO
                    title="Vehicle Not Found | Carsales"
                    description="The vehicle you are looking for could not be found on Carsales."
                    canonical={`/vehicles/${id || ""}`}
                    noIndex
                />

                <div className="min-h-screen flex flex-col items-center justify-center">
                    <h1 className="text-4xl font-bold">
                        Vehicle Not Found
                    </h1>

                    <Link
                        to="/vehicles"
                        className="mt-6 bg-black text-white px-6 py-3 rounded-xl"
                    >
                        Back to Vehicles
                    </Link>
                </div>
            </>
        );
    }

    const vehicleName = `${car.model || car.brand}${car.year ? ` ${car.year}` : ""
        }`;
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
    const seoTitle = `${vehicleName} for Sale | Carsales`;

    const seoDescription =
        car.description ||
        `${vehicleName} for sale in Kenya. ${car.transmission || ""} ${car.fuelType || ""
        } vehicle priced at Ksh ${car.price.toLocaleString()}. View specifications, mileage and availability on Carsales.`;

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

            <section className="min-h-screen">
                {/* TOP */}
                <div className="max-w-7xl mx-auto">
                    <Link
                        to="/vehicles"
                        className="text-gray-600 hover:text-black transition"
                    >
                        ← Back to Vehicles
                    </Link>

                    {/* FLEX */}
                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 p-6">
                        {/* IMAGE */}
                        <div className="lg:w-5/12">
                            <div className="sticky top-24 overflow-hidden rounded-2xl">
                                <div className="relative w-full h-full">
                                    {car.imageUrl ? (
                                        <img
                                            src={car.imageUrl}
                                            alt={car.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="h-[500px] flex items-center justify-center text-gray-400">
                                            No Image
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* DETAILS */}
                        <div className="lg:w-7/12">
                            {/* STATUS */}
                            <div className="flex items-center gap-3">
                                <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-semibold">
                                    {car.status}
                                </span>

                                <span className="bg-gray-200 text-gray-700 px-4 py-1 rounded-full text-sm font-semibold">
                                    {car.condition}
                                </span>
                            </div>

                            {/* TITLE */}
                            <h1 className="text-5xl font-bold mt-6 leading-tight">
                                {car.title}
                            </h1>

                            <p className="text-gray-500 text-lg mt-3">
                                {car.brand} {car.model}
                            </p>

                            {/* PRICE */}
                            <div className="mt-8">
                                <p className="text-gray-500">
                                    Price
                                </p>

                                <h2 className="text-5xl font-bold text-red-600 mt-2">
                                    Ksh {car.price.toLocaleString()}
                                </h2>
                            </div>

                            {/* SPECS */}
                            <div className="grid grid-cols-2 gap-6 mt-10">
                                <div className="bg-gray-50 rounded-2xl p-5 shadow-sm">
                                    <p className="text-gray-500 text-sm">
                                        Year
                                    </p>

                                    <h3 className="font-bold text-xl mt-2">
                                        {car.year || "-"}
                                    </h3>
                                </div>

                                <div className="bg-gray-50 rounded-2xl p-5 shadow-sm">
                                    <p className="text-gray-500 text-sm">
                                        Transmission
                                    </p>

                                    <h3 className="font-bold text-xl mt-2">
                                        {car.transmission || "-"}
                                    </h3>
                                </div>

                                <div className="bg-gray-50 rounded-2xl p-5 shadow-sm">
                                    <p className="text-gray-500 text-sm">
                                        Fuel Type
                                    </p>

                                    <h3 className="font-bold text-xl mt-2">
                                        {car.fuelType || "-"}
                                    </h3>
                                </div>

                                <div className="bg-gray-50 rounded-2xl p-5 shadow-sm">
                                    <p className="text-gray-500 text-sm">
                                        Mileage
                                    </p>

                                    <h3 className="font-bold text-xl mt-2">
                                        {car.mileage
                                            ? `${car.mileage.toLocaleString()} km`
                                            : "-"}
                                    </h3>
                                </div>

                                <div className="bg-gray-50 rounded-2xl p-5 shadow-sm">
                                    <p className="text-gray-500 text-sm">
                                        Drive Type
                                    </p>

                                    <h3 className="font-bold text-xl mt-2">
                                        {car.driveType || "-"}
                                    </h3>
                                </div>

                                <div className="bg-gray-50 rounded-2xl p-5 shadow-sm">
                                    <p className="text-gray-500 text-sm">
                                        Engine Size
                                    </p>

                                    <h3 className="font-bold text-xl mt-2">
                                        {car.engineSize
                                            ? `${car.engineSize} CC`
                                            : "-"}
                                    </h3>
                                </div>
                            </div>

                            {/* DESCRIPTION */}
                            <div className="bg-white rounded-3xl p-8 mt-10 shadow-sm">
                                <h2 className="text-2xl font-bold">
                                    Vehicle Description
                                </h2>

                                <p className="text-gray-600 leading-relaxed mt-5">
                                    {car.description ||
                                        "No description available for this vehicle."}
                                </p>
                            </div>

                            {/* CTA */}
                            <div className="flex flex-col sm:flex-row gap-4 mt-10">
                                <button className="flex-1 bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-semibold transition">
                                    Contact Dealer
                                </button>

                                <button className="flex-1 border border-black hover:bg-black hover:text-white py-4 rounded-2xl font-semibold transition">
                                    Schedule Viewing
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}