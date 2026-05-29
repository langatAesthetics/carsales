export default function About() {
    return (
        <section className="max-w-7xl mx-auto px-6 py-24">

            {/* Heading */}
            <div className="max-w-3xl">
                <p className="text-red-600 font-semibold uppercase tracking-wider">
                    About Us
                </p>

                <h1 className="text-5xl md:text-6xl font-bold mt-4 leading-tight">
                    Driven By Quality, Built On Trust.
                </h1>

                <p className="mt-8 text-lg text-gray-600 leading-relaxed">
                    At DRIVEHUB, we believe purchasing a vehicle should feel simple,
                    transparent, and exciting. We are committed to connecting drivers
                    with premium vehicles that combine performance, reliability, and value.
                </p>

                <p className="mt-6 text-lg text-gray-600 leading-relaxed">
                    From luxury sedans and powerful SUVs to everyday reliable vehicles,
                    our inventory is carefully selected and professionally inspected
                    to ensure every customer drives away with confidence.
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">

                <div className="bg-gray-50 rounded-3xl p-8">
                    <h2 className="text-5xl font-bold text-red-600">
                        500+
                    </h2>

                    <p className="mt-4 text-gray-600 text-lg">
                        Vehicles Successfully Sold
                    </p>
                </div>

                <div className="bg-gray-50 rounded-3xl p-8">
                    <h2 className="text-5xl font-bold text-red-600">
                        100%
                    </h2>

                    <p className="mt-4 text-gray-600 text-lg">
                        Professionally Inspected Cars
                    </p>
                </div>

                <div className="bg-gray-50 rounded-3xl p-8">
                    <h2 className="text-5xl font-bold text-red-600">
                        24/7
                    </h2>

                    <p className="mt-4 text-gray-600 text-lg">
                        Dedicated Customer Support
                    </p>
                </div>
            </div>

            {/* Mission Section */}
            <div className="mt-28 grid md:grid-cols-2 gap-16 items-center">

                <div>
                    <img
                        src="https://images.unsplash.com/photo-1503376780353-7e6692767b70"
                        alt="Luxury Car"
                        className="rounded-3xl object-cover w-full h-[500px]"
                    />
                </div>

                <div>
                    <p className="text-red-600 font-semibold uppercase tracking-wider">
                        Our Mission
                    </p>

                    <h2 className="text-4xl md:text-5xl font-bold mt-4 leading-tight">
                        Delivering Excellence In Every Drive.
                    </h2>

                    <p className="mt-8 text-gray-600 text-lg leading-relaxed">
                        Our mission is to redefine the car buying experience by offering
                        trusted vehicles, transparent pricing, and exceptional customer care.
                    </p>

                    <p className="mt-6 text-gray-600 text-lg leading-relaxed">
                        We focus on quality, integrity, and customer satisfaction — ensuring
                        every client finds a vehicle that perfectly matches their lifestyle and needs.
                    </p>
                </div>
            </div>
        </section>
    );
}