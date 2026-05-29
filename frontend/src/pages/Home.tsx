import { useState } from "react";
import { Search, ShieldCheck, BadgeCheck, Headphones, ChevronDown, } from "lucide-react";
import carsHero from "../assets/hero_illustration.png";

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
    const [openFAQ, setOpenFAQ] = useState<number | null>(0);

    return (
        <main className="min-h-screen bg-white text-gray-900">
            {/* ================= HERO ================= */}
            <section className="w-full min-h-screen flex items-center justify-center px-6">

                <div className="max-w-7xl mx-auto grid  items-center">

                    {/* Image */}
                    <div>
                        <img
                            src={carsHero}
                            alt="Cars"
                            className="w-full md:h-[400px] object-contain"
                        />
                    </div>

                    {/* Content */}
                    <div className="text-center ">
                        <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                            Find Your Dream Car
                        </h1>

                        <p className=" text-lg">
                            Premium vehicles with trusted quality and unbeatable prices.
                        </p>
                    </div>

                </div>
            </section>


            {/* ================= FILTER SECTION ================= */}
            <section className="max-w-7xl mx-auto px-6 py-12">
                <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Brand */}
                        <select className="border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-red-500">
                            <option>Brand</option>
                            <option>Toyota</option>
                            <option>BMW</option>
                            <option>Mercedes</option>
                            <option>Audi</option>
                        </select>

                        {/* Model */}
                        <select className="border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-red-500">
                            <option>Model</option>
                            <option>Land Cruiser</option>
                            <option>X5</option>
                            <option>C200</option>
                        </select>

                        {/* Price */}
                        <select className="border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-red-500">
                            <option>Price Range</option>
                            <option>Under KES 1M</option>
                            <option>KES 1M - 3M</option>
                            <option>KES 3M - 5M</option>
                            <option>KES 5M+</option>
                        </select>

                        {/* Search */}
                        <div className="flex items-center border rounded-xl px-4">
                            <Search className="text-gray-500 w-5 h-5" />

                            <input
                                type="text"
                                placeholder="Search vehicles..."
                                className="w-full px-3 py-3 outline-none"
                            />
                        </div>
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
                        We provide trusted vehicles, excellent customer service, and a smooth buying experience.
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
                            Every vehicle is professionally inspected for quality and reliability.
                        </p>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-gray-50 rounded-3xl p-8 shadow-sm hover:shadow-lg transition">
                        <Headphones className="w-12 h-12 text-red-600" />

                        <h3 className="text-2xl font-semibold mt-6">
                            Excellent Support
                        </h3>

                        <p className="text-gray-600 mt-4">
                            Our support team is always ready to assist you through every step.
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
                                        setOpenFAQ(openFAQ === index ? null : index)
                                    }
                                    className="w-full flex items-center justify-between p-6 text-left"
                                >
                                    <span className="font-semibold text-lg">
                                        {faq.question}
                                    </span>

                                    <ChevronDown
                                        className={`transition ${openFAQ === index ? "rotate-180" : ""
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