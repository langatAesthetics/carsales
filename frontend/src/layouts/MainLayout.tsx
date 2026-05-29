// src/layouts/MainLayout.tsx

import { Outlet } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";

export default function MainLayout() {
    return (
        <div className="min-h-screen flex flex-col">

            {/* Shared Header */}
            <Header />

            {/* Dynamic Page Content */}
            <main className="flex-1">
                <Outlet />
            </main>

            {/* Shared Footer */}
            <Footer />
        </div>
    );
}