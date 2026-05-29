export default function Contact() {
    return (
        <section className="max-w-7xl mx-auto px-6 py-24">

            {/* Heading */}
            <div className="text-center max-w-3xl mx-auto">
                <p className="text-red-600 font-semibold uppercase tracking-widest">
                    Contact Us
                </p>

                <h1 className="text-5xl md:text-6xl font-bold mt-4">
                    Let’s Get You On The Road.
                </h1>

                <p className="mt-8 text-lg text-gray-600 leading-relaxed">
                    Whether you’re searching for your next vehicle or need assistance,
                    our team is always ready to help.
                </p>
            </div>

            {/* Contact Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mt-20">

                {/* Left Info */}
                <div className="space-y-10">

                    <div>
                        <h2 className="text-2xl font-semibold">
                            Visit Our Showroom
                        </h2>

                        <p className="mt-3 text-gray-600 text-lg">
                            Nairobi, Kenya
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold">
                            Call Us
                        </h2>

                        <p className="mt-3 text-gray-600 text-lg">
                            +254 700 000 000
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold">
                            Email Address
                        </h2>

                        <p className="mt-3 text-gray-600 text-lg">
                            info@drivehub.com
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold">
                            Working Hours
                        </h2>

                        <p className="mt-3 text-gray-600 text-lg">
                            Monday - Saturday <br />
                            8:00 AM - 6:00 PM
                        </p>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="bg-gray-50 rounded-3xl p-8 md:p-10 shadow-sm">

                    <h2 className="text-3xl font-bold">
                        Send Us A Message
                    </h2>

                    <p className="mt-4 text-gray-600">
                        Fill out the form below and our team will get back to you shortly.
                    </p>

                    <form className="mt-8 space-y-6">

                        <div>
                            <input
                                type="text"
                                placeholder="Full Name"
                                className="w-full border border-gray-300 rounded-xl px-5 py-4 outline-none focus:ring-2 focus:ring-red-500"
                            />
                        </div>

                        <div>
                            <input
                                type="email"
                                placeholder="Email Address"
                                className="w-full border border-gray-300 rounded-xl px-5 py-4 outline-none focus:ring-2 focus:ring-red-500"
                            />
                        </div>

                        <div>
                            <input
                                type="text"
                                placeholder="Phone Number"
                                className="w-full border border-gray-300 rounded-xl px-5 py-4 outline-none focus:ring-2 focus:ring-red-500"
                            />
                        </div>

                        <div>
                            <textarea
                                rows={5}
                                placeholder="Your Message"
                                className="w-full border border-gray-300 rounded-xl px-5 py-4 outline-none focus:ring-2 focus:ring-red-500 resize-none"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-semibold transition"
                        >
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}