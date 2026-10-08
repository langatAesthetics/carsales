import { Link } from "react-router-dom";



export default function Header() {
    return (
        <header className="w-full border-b border-gray-100 bg-white sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

                {/* Logo */}
                <div className="flex items-center gap-2">
                    <Link to="/" className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold tracking-wide">
                            Logo
                        </h1>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="hidden md:flex items-center gap-8 font-medium">
                    <Link
                        to="/vehicles"
                        className="hover:text-red-600 transition"
                    >
                        Vehicles
                    </Link>

                    <Link
                        to="/about"
                        className="hover:text-red-600 transition"
                    >
                        About
                    </Link>

                    <Link
                        to="/contact"
                        className="hover:text-red-600 transition"
                    >
                        Contact
                    </Link>
                </nav>
            </div>
        </header>
    );
}