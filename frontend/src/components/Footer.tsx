import { Car } from "lucide-react";
import { Link } from "react-router-dom";


export default function Footer() {
    return (
        <footer className="bg-black text-white">
            <div className="max-w-7xl mx-auto px-6 py-16">

                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2">
                            <Car className="w-8 h-8 text-red-500" />

                            <h2 className="text-2xl font-bold">
                                Logo
                            </h2>
                        </div>

                        <p className="mt-4 text-gray-400 leading-relaxed">
                            Premium vehicles and trusted automotive solutions
                            for modern drivers.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">
                            Quick Links
                        </h3>

                        <ul className="space-y-3 text-gray-400">
                            <li>
                                <Link
                                    to="/vehicles"
                                    className="hover:text-white transition"
                                >
                                    Vehicles
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/bikes"
                                    className="hover:text-white transition"
                                >
                                    Bikes
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/about"
                                    className="hover:text-white transition"
                                >
                                    About
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/contact"
                                    className="hover:text-white transition"
                                >
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">
                            Services
                        </h3>

                        <ul className="space-y-3 text-gray-400">
                            <li>Car Sales</li>
                            <li>Vehicle Inspection</li>
                            <li>Financing</li>
                            <li>Customer Support</li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">
                            Contact
                        </h3>

                        <ul className="space-y-3 text-gray-400">
                            <li>Nairobi, Kenya</li>
                            <li>+254 700 000 000</li>
                            <li>info@drivehub.com</li>
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="border-t border-gray-800 mt-12 pt-6 text-center text-gray-500 text-sm">
                    © 2026 DRIVEHUB. All rights reserved.
                </div>
            </div>
        </footer>
    );
}