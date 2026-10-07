import { useEffect, useMemo, useState } from "react";
import { api } from "../../services/api";
import { Link, useSearchParams } from "react-router-dom";

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

export default function Vehicles() {
    // ================= URL PARAMETERS =================

    const [searchParams, setSearchParams] = useSearchParams();

    // ================= VEHICLES =================

    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);

    // ================= FILTER STATES =================

    const [search, setSearch] = useState(
        searchParams.get("search") || ""
    );

    const [selectedBrand, setSelectedBrand] = useState(
        searchParams.get("brand") || ""
    );

    const [selectedModel, setSelectedModel] = useState(
        searchParams.get("model") || ""
    );

    const [selectedPriceRange, setSelectedPriceRange] = useState(
        searchParams.get("price") || ""
    );

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

    // ================= UPDATE URL =================

    const updateURL = (
        searchValue: string,
        brandValue: string,
        modelValue: string,
        priceValue: string
    ) => {
        const params = new URLSearchParams();

        if (brandValue) {
            params.set("brand", brandValue);
        }

        if (modelValue) {
            params.set("model", modelValue);
        }

        if (priceValue) {
            params.set("price", priceValue);
        }

        if (searchValue.trim()) {
            params.set("search", searchValue.trim());
        }

        setSearchParams(params, {
            replace: true,
        });
    };

    // ================= SEARCH CHANGE =================

    const handleSearchChange = (
        value: string
    ) => {
        setSearch(value);

        updateURL(
            value,
            selectedBrand,
            selectedModel,
            selectedPriceRange
        );
    };

    // ================= BRAND CHANGE =================

    const handleBrandChange = (
        value: string
    ) => {
        setSelectedBrand(value);

        // Changing brand resets model
        setSelectedModel("");

        updateURL(
            search,
            value,
            "",
            selectedPriceRange
        );
    };

    // ================= MODEL CHANGE =================

    const handleModelChange = (
        value: string
    ) => {
        setSelectedModel(value);

        updateURL(
            search,
            selectedBrand,
            value,
            selectedPriceRange
        );
    };

    // ================= PRICE CHANGE =================

    const handlePriceChange = (
        value: string
    ) => {
        setSelectedPriceRange(value);

        updateURL(
            search,
            selectedBrand,
            selectedModel,
            value
        );
    };

    // ================= FILTER VEHICLES =================

    const filteredCars = useMemo(() => {
        const searchTerm = search.trim().toLowerCase();

        return cars.filter((car) => {

            // ================= SEARCH =================

            const searchableText = `
                ${car.title}
                ${car.brand}
                ${car.model || ""}
                ${car.year || ""}
                ${car.fuelType || ""}
                ${car.transmission || ""}
                ${car.description || ""}
            `.toLowerCase();

            const matchesSearch =
                searchTerm === "" ||
                searchableText.includes(searchTerm);

            // ================= BRAND =================

            const matchesBrand =
                selectedBrand === "" ||
                car.brand === selectedBrand;

            // ================= MODEL =================

            const matchesModel =
                selectedModel === "" ||
                car.model === selectedModel;

            // ================= PRICE =================

            let matchesPrice = true;

            switch (selectedPriceRange) {
                case "under-1m":
                    matchesPrice =
                        car.price < 1_000_000;
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

                case "5m-10m":
                    matchesPrice =
                        car.price > 5_000_000 &&
                        car.price <= 10_000_000;
                    break;

                case "above-10m":
                    matchesPrice =
                        car.price > 10_000_000;
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

        return filteredCars.slice(0, 6);
    }, [search, filteredCars]);

    // ================= CLEAR FILTERS =================

    const clearFilters = () => {
        setSearch("");
        setSelectedBrand("");
        setSelectedModel("");
        setSelectedPriceRange("");

        setSearchParams({}, {
            replace: true,
        });
    };

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

                    {/* ================= BRAND ================= */}

                    <select
                        value={selectedBrand}
                        onChange={(e) =>
                            handleBrandChange(e.target.value)
                        }
                        className="border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
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
                            handleModelChange(e.target.value)
                        }
                        className="border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
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
                            handlePriceChange(e.target.value)
                        }
                        className="border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                    >
                        <option value="">
                            All Prices
                        </option>

                        <option value="under-1m">
                            Under Ksh 1M
                        </option>

                        <option value="1m-3m">
                            Ksh 1M - 3M
                        </option>

                        <option value="3m-5m">
                            Ksh 3M - 5M
                        </option>

                        <option value="5m-10m">
                            Ksh 5M - 10M
                        </option>

                        <option value="above-10m">
                            Above Ksh 10M
                        </option>
                    </select>

                    {/* ================= SEARCH ================= */}

                    <div className="relative">

                        <input
                            type="text"
                            placeholder="Search vehicles..."
                            value={search}
                            onChange={(e) =>
                                handleSearchChange(e.target.value)
                            }
                            className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                        />

                        {/* ================= LIVE SEARCH RESULTS ================= */}

                        {search.trim() &&
                            searchResults.length > 0 && (

                                <div className="absolute z-20 left-0 right-0 top-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">

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
                            searchResults.length === 0 && (

                                <div className="absolute z-20 left-0 right-0 top-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl p-4">

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

                        <div className="mt-5 flex justify-between items-center">

                            <p className="text-sm text-gray-500">
                                {filteredCars.length}{" "}
                                {filteredCars.length === 1
                                    ? "Vehicle"
                                    : "Vehicles"}{" "}
                                Found
                            </p>

                            <button
                                type="button"
                                onClick={clearFilters}
                                className="text-sm font-semibold text-gray-600 hover:text-green-600 transition"
                            >
                                Clear Filters
                            </button>

                        </div>
                    )}

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
                    {filteredCars.length}{" "}
                    {filteredCars.length === 1
                        ? "Vehicle"
                        : "Vehicles"}{" "}
                    Found
                </div>

            </div>

            {/* ================= VEHICLES GRID ================= */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">

                {loading ? (

                    <div className="col-span-full text-center py-20 text-gray-500">
                        Loading vehicles...
                    </div>

                ) : filteredCars.length === 0 ? (

                    <div className="col-span-full text-center py-20">

                        <p className="text-gray-500 text-lg">
                            No vehicles found matching your search.
                        </p>

                        <button
                            type="button"
                            onClick={clearFilters}
                            className="mt-5 bg-black hover:bg-green-600 text-white px-6 py-3 rounded-xl font-semibold transition"
                        >
                            Clear Filters
                        </button>

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

                                <div className="absolute top-4 right-4 bg-green-100 text-green-700 text-sm font-semibold px-4 py-2 rounded-full">
                                    {car.status === "AVAILABLE"
                                        ? "Available"
                                        : car.status || "Available"}
                                </div>

                            </div>

                            {/* ================= CONTENT ================= */}

                            <div className="p-5 flex flex-col flex-1">

                                {/* SPECS */}

                                <div className="grid grid-cols-3 gap-3 text-gray-500 text-sm leading-relaxed">

                                    <div>
                                        <p>
                                            {car.year || "-"}
                                        </p>
                                    </div>

                                    <div>
                                        <p>
                                            {car.transmission || "-"}
                                        </p>
                                    </div>

                                    <div>
                                        <p>
                                            {car.engineSize
                                                ? `${car.engineSize} cc`
                                                : "-"}
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
                                        Ksh{" "}
                                        {car.price.toLocaleString()}
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