import { useEffect, useMemo, useState } from "react";
import { api } from "../../services/api";
import { Link, useSearchParams } from "react-router-dom";
import SEO from "../seo/SEO";
import { Cog, Fuel, Gauge, Settings2 } from "lucide-react";

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

interface Pagination {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}


export default function Vehicles() {
    // ================= URL PARAMETERS =================

    const [searchParams, setSearchParams] = useSearchParams();

    // ================= VEHICLES AND PAGINATION =================

    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);

    const [pagination, setPagination] = useState<Pagination>({
        page: 1,
        limit: 12,
        totalItems: 0,
        totalPages: 1,
        hasPreviousPage: false,
        hasNextPage: false,
    });

    const [currentPage, setCurrentPage] = useState(
        Math.max(1, Number(searchParams.get("page")) || 1)
    );

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

    // ================= FETCH PAGINATED VEHICLES =================

    const queryString = searchParams.toString();

    useEffect(() => {
        let cancelled = false;

        const fetchCars = async () => {
            setLoading(true);

            try {
                const params = new URLSearchParams(queryString);

                const requestedPage = Math.max(
                    1,
                    Number(params.get("page")) || 1
                );

                params.set("page", String(requestedPage));
                params.set("limit", "12");

                const res = await api.get("/cars", {
                    params: Object.fromEntries(params.entries()),
                });

                const response = res.data;

                if (cancelled) return;

                const vehicleList = Array.isArray(response)
                    ? response
                    : Array.isArray(response?.data)
                        ? response.data
                        : [];

                setCars(vehicleList);

                setPagination({
                    page: Number(response?.pagination?.page) || requestedPage,
                    limit: Number(response?.pagination?.limit) || 12,
                    totalItems: Number(response?.pagination?.totalItems) || 0,
                    totalPages: Math.max(
                        1,
                        Number(response?.pagination?.totalPages) || 1
                    ),
                    hasPreviousPage: Boolean(
                        response?.pagination?.hasPreviousPage
                    ),
                    hasNextPage: Boolean(
                        response?.pagination?.hasNextPage
                    ),
                });

                setCurrentPage(
                    Math.max(
                        1,
                        Number(response?.pagination?.page) || requestedPage
                    )
                );

            } catch (error) {
                if (!cancelled) {
                    console.error("Failed to fetch vehicles", error);

                    setCars([]);
                    setPagination({
                        page: 1,
                        limit: 12,
                        totalItems: 0,
                        totalPages: 1,
                        hasPreviousPage: false,
                        hasNextPage: false,
                    });

                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        const timer = window.setTimeout(fetchCars, 250);

        return () => {
            cancelled = true;
            window.clearTimeout(timer);
        };
    }, [queryString]);

    // ================= UPDATE URL =================

   const updateURL = (
    searchValue: string,
    brandValue: string,
    modelValue: string,
    priceValue: string,
    pageValue = 1
) => {
    const params = new URLSearchParams();

    if (brandValue) params.set("brand", brandValue);
    if (modelValue) params.set("model", modelValue);
    if (priceValue) params.set("price", priceValue);
    if (searchValue.trim()) {
        params.set("search", searchValue.trim());
    }

    if (pageValue > 1) {
        params.set("page", String(pageValue));
    }

    setSearchParams(params, { replace: true });
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
        return cars.filter((car) => {
            const matchesSearch =
                !search.trim() ||
                `${car.title} ${car.brand} ${car.model ?? ""}`
                    .toLowerCase()
                    .includes(search.trim().toLowerCase());

            const matchesBrand =
                !selectedBrand || car.brand === selectedBrand;

            const matchesModel =
                !selectedModel || car.model === selectedModel;

            let matchesPrice = true;

            if (selectedPriceRange === "under-1m") {
                matchesPrice = car.price < 1_000_000;
            } else if (selectedPriceRange === "1m-3m") {
                matchesPrice =
                    car.price >= 1_000_000 && car.price < 3_000_000;
            } else if (selectedPriceRange === "3m-5m") {
                matchesPrice =
                    car.price >= 3_000_000 && car.price < 5_000_000;
            } else if (selectedPriceRange === "5m-10m") {
                matchesPrice =
                    car.price >= 5_000_000 && car.price <= 10_000_000;
            } else if (selectedPriceRange === "above-10m") {
                matchesPrice = car.price > 10_000_000;
            }

            return matchesSearch && matchesBrand && matchesModel && matchesPrice;
        });
    }, [cars, search, selectedBrand, selectedModel, selectedPriceRange]);

    const brands = useMemo(
        () => [...new Set(cars.map((car) => car.brand).filter(Boolean))],
        [cars]
    );

    const models = useMemo(
        () =>
            [
                ...new Set(
                    cars
                        .filter(
                            (car) =>
                                !selectedBrand || car.brand === selectedBrand
                        )
                        .map((car) => car.model)
                        .filter((model): model is string => Boolean(model))
                ),
            ],
        [cars, selectedBrand]
    );

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

        setCurrentPage(1);

        setSearchParams({}, {
            replace: true,
        });
    };

    return (
        <section className="max-w-7xl mx-auto px-6 py-12">

            {/* ================= SEO ================= */}
            <SEO
                title="Cars for Sale in Kenya | Carsales"
                description="Browse quality cars for sale in Kenya. Search and filter vehicles by brand, model, price, year, fuel type and transmission on Carsales."
                canonical="/vehicles"
            />
            {/* ================= FILTERS ================= */}

            <div className="bg-white shadow-lg rounded-3xl p-6">

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
                            {filteredCars.length === 1 ? "Vehicle" : "Vehicles"}{" "}
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">

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

                        <Link
                            key={car.id}
                            to={`/vehicles/${car.id}`}
                            className="bg-white rounded-[20px] overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg  flex flex-col cursor-pointer group"
                        >

                            {/* ================= IMAGE ================= */}

                            <div className="bg-gray-200 h-48 relative overflow-hidden">

                                <img
                                    src={
                                        car.imageUrl ||
                                        "https://via.placeholder.com/600x400"
                                    }
                                    alt={car.title}
                                    className="w-full h-full object-cover "
                                />

                                <div className="absolute top-4 right-4 bg-green-100 text-green-700 text-sm font-semibold px-4 py-2 rounded-full">
                                    {car.status === "AVAILABLE" ? "Available" : car.status || "Available"}
                                </div>

                            </div>

                            {/* ================= CONTENT ================= */}

                            <div className="p-5 flex flex-col">

                                {/* VEHICLE NAME */}

                                <h2 className="text-xl font-bold leading-tight">
                                    {car.title}
                                </h2>

                                {/* PRICE */}

                                <p className="text-2xl font-bold text-green-600 mt-3">
                                    Ksh {car.price.toLocaleString()}
                                </p>

                                {/* ================= SPECS ================= */}

                                <div className="grid grid-cols-2 gap-4 mt-6">

                                    {/* MILEAGE */}

                                    <div className="flex items-center gap-2 text-gray-600">

                                        <Gauge
                                            size={18}
                                            className="text-gray-400 shrink-0"
                                        />

                                        <span className="text-sm">
                                            {car.mileage
                                                ? `${car.mileage.toLocaleString()} km`
                                                : "-"}
                                        </span>

                                    </div>

                                    {/* ENGINE */}

                                    <div className="flex items-center gap-2 text-gray-600">

                                        <Cog
                                            size={18}
                                            className="text-gray-400 shrink-0"
                                        />

                                        <span className="text-sm">
                                            {car.engineSize
                                                ? `${car.engineSize} cc`
                                                : "-"}
                                        </span>

                                    </div>

                                    {/* TRANSMISSION */}

                                    <div className="flex items-center gap-2 text-gray-600">

                                        <Settings2
                                            size={18}
                                            className="text-gray-400 shrink-0"
                                        />

                                        <span className="text-sm">
                                            {car.transmission || "-"}
                                        </span>

                                    </div>

                                    {/* FUEL */}

                                    <div className="flex items-center gap-2 text-gray-600">

                                        <Fuel
                                            size={18}
                                            className="text-gray-400 shrink-0"
                                        />

                                        <span className="text-sm">
                                            {car.fuelType || "-"}
                                        </span>

                                    </div>

                                </div>

                            </div>

                        </Link>

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

            {/* ================= PAGINATION ================= */}

            {!loading && pagination.totalPages > 1 && (
                <div className="flex flex-wrap items-center justify-center gap-2 mt-12">
                    <button
                        type="button"
                        disabled={currentPage <= 1}
                        onClick={() =>
                            updateURL(
                                search,
                                selectedBrand,
                                selectedModel,
                                selectedPriceRange,
                                currentPage - 1
                            )
                        }
                        className="px-4 py-2 rounded-lg border disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
                    >
                        Previous
                    </button>

                    {Array.from(
                        { length: pagination.totalPages },
                        (_, index) => index + 1
                    )
                        .filter(
                            (page) =>
                                page === 1 ||
                                page === pagination.totalPages ||
                                Math.abs(page - currentPage) <= 1
                        )
                        .map((page, index, pages) => (
                            <span
                                key={page}
                                className="contents"
                            >
                                {index > 0 &&
                                    page - pages[index - 1] > 1 && (
                                        <span className="px-1 text-gray-400">
                                            ...
                                        </span>
                                    )}

                                <button
                                    type="button"
                                    onClick={() =>
                                        updateURL(
                                            search,
                                            selectedBrand,
                                            selectedModel,
                                            selectedPriceRange,
                                            page
                                        )
                                    }
                                    aria-current={
                                        page === currentPage ? "page" : undefined
                                    }
                                    className={`min-w-10 px-3 py-2 rounded-lg border ${page === currentPage
                                            ? "bg-green-600 text-white border-green-600"
                                            : "hover:bg-gray-100"
                                        }`}
                                >
                                    {page}
                                </button>
                            </span>
                        ))}

                    <button
                        type="button"
                        disabled={currentPage >= pagination.totalPages}
                        onClick={() =>
                            updateURL(
                                search,
                                selectedBrand,
                                selectedModel,
                                selectedPriceRange,
                                currentPage + 1
                            )
                        }
                        className="px-4 py-2 rounded-lg border disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
                    >
                        Next
                    </button>
                </div>
            )}

        </section>
    );
}