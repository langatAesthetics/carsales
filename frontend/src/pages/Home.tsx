import { useEffect, useMemo, useState } from "react";
import {
    Search,
    ShieldCheck,
    BadgeCheck,
    Headphones,
    ChevronDown,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import carsHero from "../assets/hero_illustration.png";
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
    engineSize?: number;
    imageUrl?: string;
    status?: string;
    description?: string;
}

const faqs = [
    {
        question: "Do you sell inspected vehicles?",
        answer:
            "Yes. Every vehicle undergoes a full inspection to ensure quality and performance.",
    },
    {
        question: "Can I schedule a test drive?",
        answer:
            "Absolutely. Contact us directly and we’ll arrange a convenient test drive for you.",
    },
    {
        question: "Do you offer financing assistance?",
        answer:
            "Yes, we work with trusted financing partners to help you acquire your dream car.",
    },
];

export default function Home() {
    const navigate = useNavigate();

    const browseFilteredVehicles = () => {
        const params = new URLSearchParams();

        if (selectedBrand) {
            params.set("brand", selectedBrand);
        }

        if (selectedModel) {
            params.set("model", selectedModel);
        }

        if (selectedPriceRange) {
            params.set("price", selectedPriceRange);
        }

        if (search.trim()) {
            params.set("search", search.trim());
        }

        const queryString = params.toString();

        navigate(
            queryString
                ? `/vehicles?${queryString}`
                : "/vehicles"
        );
    };
    const [openFAQ, setOpenFAQ] = useState<number | null>(0);

    // ================= VEHICLES =================

    const [cars, setCars] = useState<Car[]>([]);
    const [loadingCars, setLoadingCars] = useState(true);

    // ================= SEARCH / FILTER STATES =================

    const [search, setSearch] = useState("");
    const [selectedBrand, setSelectedBrand] = useState("");
    const [selectedModel, setSelectedModel] = useState("");
    const [selectedPriceRange, setSelectedPriceRange] = useState("");

    // ================= FETCH VEHICLES =================

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const res = await api.get("/cars");

                setCars(res.data || []);
            } catch (error) {
                console.error("Failed to fetch vehicles", error);
                setCars([]);
            } finally {
                setLoadingCars(false);
            }
        };

        fetchCars();
    }, []);

    // ================= BRANDS =================

    const brands = useMemo(() => {
        return Array.from(
            new Set(
                cars
                    .map((car) => car.brand)
                    .filter(Boolean)
            )
        ).sort();
    }, [cars]);

    // ================= MODELS =================

    const models = useMemo(() => {
        return Array.from(
            new Set(
                cars
                    .filter(
                        (car) =>
                            !selectedBrand ||
                            car.brand === selectedBrand
                    )
                    .map((car) => car.model)
                    .filter(Boolean) as string[]
            )
        ).sort();
    }, [cars, selectedBrand]);

    // ================= FILTER VEHICLES =================

    const filteredCars = useMemo(() => {
        const searchTerm = search.trim().toLowerCase();

        return cars.filter((car) => {
            const searchableText = `
                ${car.title}
                ${car.brand}
                ${car.model || ""}
                ${car.year || ""}
                ${car.fuelType || ""}
                ${car.transmission || ""}
                ${car.description || ""}
            `.toLowerCase();

            // Search
            const matchesSearch =
                searchTerm === "" ||
                searchableText.includes(searchTerm);

            // Brand
            const matchesBrand =
                selectedBrand === "" ||
                car.brand === selectedBrand;

            // Model
            const matchesModel =
                selectedModel === "" ||
                car.model === selectedModel;

            // Price
            let matchesPrice = true;

            switch (selectedPriceRange) {
                case "under-1m":
                    matchesPrice = car.price < 1_000_000;
                    break;

                case "1m-3m":
                    matchesPrice =
                        car.price >= 1_000_000 &&
                        car.price <= 3_000_000;
                    break;

                case "3m-5m":
                    matchesPrice =
                        car.price > 3_000_000 &&
                        car.price <= 5_000_000;
                    break;

                case "5m-plus":
                    matchesPrice = car.price > 5_000_000;
                    break;

                default:
                    matchesPrice = true;
            }

            return (
                matchesSearch &&
                matchesBrand &&
                matchesModel &&
                matchesPrice
            );
        });
    }, [
        cars,
        search,
        selectedBrand,
        selectedModel,
        selectedPriceRange,
    ]);

    // ================= LIVE SEARCH RESULTS =================

    const searchResults = useMemo(() => {
        if (!search.trim()) {
            return [];
        }

        return filteredCars.slice(0, 5);
    }, [search, filteredCars]);

    // ================= CLEAR FILTERS =================

    const clearFilters = () => {
        setSearch("");
        setSelectedBrand("");
        setSelectedModel("");
        setSelectedPriceRange("");
    };

    return (
        <main className="min-h-screen bg-white text-gray-900">

            {/* ================= SEO ================= */}
            <SEO
                title="Carsales Kenya | Quality Cars for Sale"
                description="Discover quality cars for sale in Kenya. Browse vehicles by brand, model, price and specifications on Carsales."
                canonical="/"
            />

            {/* ================= HERO ================= */}

            <section className="w-full min-h-[75vh] flex items-center justify-center px-6">

                <div className="max-w-7xl mx-auto grid items-center">

                    {/* Content */}

                    <div className="text-center">

                        <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                            Find Your Dream Car
                        </h1>

                        <p className="text-lg mt-4 text-gray-600">
                            Premium vehicles with trusted quality and unbeatable prices.
                        </p>

                    </div>

                    {/* Image */}

                    <div>
                        <img
                            src={carsHero}
                            alt="Cars"
                            className="w-full md:h-100 object-contain"
                        />
                    </div>

                </div>

            </section>

            {/* ================= FILTER SECTION ================= */}

            <section className="max-w-7xl mx-auto ">

                <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8">

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                        {/* ================= BRAND ================= */}

                        <select
                            value={selectedBrand}
                            onChange={(e) => {
                                setSelectedBrand(e.target.value);
                                setSelectedModel("");
                            }}
                            disabled={loadingCars}
                            className="border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-100"
                        >
                            <option value="">
                                All Brands
                            </option>

                            {brands.map((brand) => (
                                <option
                                    key={brand}
                                    value={brand}
                                >
                                    {brand}
                                </option>
                            ))}
                        </select>

                        {/* ================= MODEL ================= */}

                        <select
                            value={selectedModel}
                            onChange={(e) =>
                                setSelectedModel(e.target.value)
                            }
                            disabled={loadingCars}
                            className="border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-100"
                        >
                            <option value="">
                                All Models
                            </option>

                            {models.map((model) => (
                                <option
                                    key={model}
                                    value={model}
                                >
                                    {model}
                                </option>
                            ))}
                        </select>

                        {/* ================= PRICE ================= */}

                        <select
                            value={selectedPriceRange}
                            onChange={(e) =>
                                setSelectedPriceRange(e.target.value)
                            }
                            className="border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-red-500"
                        >
                            <option value="">
                                All Prices
                            </option>

                            <option value="under-1m">
                                Under KES 1M
                            </option>

                            <option value="1m-3m">
                                KES 1M - 3M
                            </option>

                            <option value="3m-5m">
                                KES 3M - 5M
                            </option>

                            <option value="5m-plus">
                                KES 5M+
                            </option>
                        </select>

                        {/* ================= SEARCH ================= */}

                        <div className="relative">

                            <div className="flex items-center border rounded-xl px-4">

                                <Search className="text-gray-500 w-5 h-5 shrink-0" />

                                <input
                                    type="text"
                                    placeholder="Search vehicles..."
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(e.target.value)
                                    }
                                    className="w-full px-3 py-3 outline-none"
                                />

                            </div>

                            {/* ================= LIVE SEARCH LIST ================= */}

                            {search.trim() &&
                                searchResults.length > 0 && (
                                    <div className="absolute z-30 left-0 right-0 top-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">

                                        {searchResults.map((car) => (
                                            <Link
                                                key={car.id}
                                                to={`/vehicles/${car.id}`}
                                                className="block px-4 py-3 hover:bg-gray-50 transition border-b last:border-b-0"
                                            >

                                                <div className="flex items-center justify-between gap-4">

                                                    <div className="min-w-0">

                                                        <p className="font-semibold truncate">
                                                            {car.title}
                                                        </p>

                                                        <p className="text-sm text-gray-500 mt-1">
                                                            {car.brand}

                                                            {car.model
                                                                ? ` • ${car.model}`
                                                                : ""}

                                                            {car.year
                                                                ? ` • ${car.year}`
                                                                : ""}
                                                        </p>

                                                    </div>

                                                    <p className="font-semibold text-green-600 whitespace-nowrap">
                                                        Ksh{" "}
                                                        {car.price.toLocaleString()}
                                                    </p>

                                                </div>

                                            </Link>
                                        ))}

                                    </div>
                                )}

                            {/* ================= NO RESULTS ================= */}

                            {search.trim() &&
                                searchResults.length === 0 &&
                                !loadingCars && (
                                    <div className="absolute z-30 left-0 right-0 top-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl p-4">

                                        <p className="text-sm text-gray-500">
                                            No matching vehicles found.
                                        </p>

                                    </div>
                                )}

                        </div>

                    </div>

                    {/* ================= FILTER ACTIONS ================= */}

                    {(search ||
                        selectedBrand ||
                        selectedModel ||
                        selectedPriceRange) && (

                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-5">

                                <p className="text-sm text-gray-500">
                                    {filteredCars.length}{" "}
                                    {filteredCars.length === 1
                                        ? "vehicle"
                                        : "vehicles"}{" "}
                                    found
                                </p>

                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="text-sm font-semibold text-gray-600 hover:text-red-600 transition"
                                >
                                    Clear Filters
                                </button>

                            </div>
                        )}

                    {/* ================= BROWSE RESULTS ================= */}

                    <div className="mt-6 flex justify-center">

                        <button
                            type="button"
                            onClick={browseFilteredVehicles}
                            className="bg-black hover:bg-red-600 text-white px-8 py-3 rounded-xl font-semibold transition"
                        >
                            Browse Vehicles
                        </button>

                    </div>

                </div>

            </section>

            {/* ================= WHY CHOOSE US ================= */}

            <section className="max-w-7xl mx-auto px-6 py-24">

                <div className="text-center max-w-2xl mx-auto">

                    <h2 className="text-4xl font-bold">
                        Why Choose us?
                    </h2>

                    <p className="mt-4 text-gray-600">
                        We provide trusted vehicles, excellent customer service,
                        and a smooth buying experience.
                    </p>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">

                    {/* Card 1 */}

                    <div className="bg-gray-50 rounded-3xl p-8 shadow-sm hover:shadow-lg transition">

                        <ShieldCheck className="w-12 h-12 text-red-600" />

                        <h3 className="text-2xl font-semibold mt-6">
                            Fully Inspected Cars
                        </h3>

                        <p className="text-gray-600 mt-4">
                            Every vehicle is professionally inspected for
                            quality and reliability.
                        </p>

                    </div>

                    {/* Card 2 */}

                    <div className="bg-gray-50 rounded-3xl p-8 shadow-sm hover:shadow-lg transition">

                        <Headphones className="w-12 h-12 text-red-600" />

                        <h3 className="text-2xl font-semibold mt-6">
                            Excellent Support
                        </h3>

                        <p className="text-gray-600 mt-4">
                            Our support team is always ready to assist you
                            through every step.
                        </p>

                    </div>

                    {/* Card 3 */}

                    <div className="bg-gray-50 rounded-3xl p-8 shadow-sm hover:shadow-lg transition">

                        <BadgeCheck className="w-12 h-12 text-red-600" />

                        <h3 className="text-2xl font-semibold mt-6">
                            Trusted Dealership
                        </h3>

                        <p className="text-gray-600 mt-4">
                            We offer transparent pricing and genuine vehicle history.
                        </p>

                    </div>

                </div>

            </section>

            {/* ================= FAQ SECTION ================= */}

            <section className="bg-gray-50 py-24">

                <div className="max-w-4xl mx-auto px-6">

                    <div className="text-center">

                        <h2 className="text-4xl font-bold">
                            Frequently Asked Questions
                        </h2>

                        <p className="mt-4 text-gray-600">
                            Everything you need to know before purchasing your next vehicle.
                        </p>

                    </div>

                    <div className="mt-12 space-y-4">

                        {faqs.map((faq, index) => (

                            <div
                                key={index}
                                className="bg-white rounded-2xl shadow-sm overflow-hidden"
                            >

                                <button
                                    onClick={() =>
                                        setOpenFAQ(
                                            openFAQ === index
                                                ? null
                                                : index
                                        )
                                    }
                                    className="w-full flex items-center justify-between p-6 text-left"
                                >

                                    <span className="font-semibold text-lg">
                                        {faq.question}
                                    </span>

                                    <ChevronDown
                                        className={`transition ${openFAQ === index
                                                ? "rotate-180"
                                                : ""
                                            }`}
                                    />

                                </button>

                                {openFAQ === index && (

                                    <div className="px-6 pb-6 text-gray-600">
                                        {faq.answer}
                                    </div>

                                )}

                            </div>

                        ))}

                    </div>

                </div>

            </section>

        </main>
    );
}