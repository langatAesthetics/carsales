export default function Layout({ children }: any) {
    return (
        <div className="flex min-h-screen bg-gray-100">

            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-lg p-6 flex flex-col justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-10">
                        Car Admin
                    </h2>

                    <nav className="space-y-4">
                        <p className="text-gray-700 font-medium cursor-pointer">
                            Dashboard
                        </p>
                        <p className="text-gray-400 text-sm">
                            Manage cars
                        </p>
                    </nav>
                </div>

                <button
                    onClick={() => {
                        localStorage.removeItem("token");
                        window.location.href = "/";
                    }}
                    className="text-red-500 hover:text-red-700 text-sm"
                >
                    Logout
                </button>
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col">

                {/* Header */}
                <header className="bg-white shadow px-6 py-4">
                    <h1 className="text-xl font-semibold text-gray-800">
                        Dashboard
                    </h1>
                </header>

                {/* Content */}
                <main className="p-6">
                    {children}
                </main>

            </div>
        </div>
    );
}