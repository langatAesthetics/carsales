import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { api }from "../services/api";

export default function Dashboard() {
  const [cars, setCars] = useState<any[]>([]);
  const [form, setForm] = useState({
    title: "",
    brand: "",
    price: "",
    year: "",
    imageUrl: "",
  });

  const fetchCars = async () => {
    try {
      const res = await api.get("/cars");
      setCars(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddCar = async () => {
    try {
      await api.post("/cars", {
        ...form,
        price: Number(form.price),
        year: Number(form.year),
      });

      setForm({
        title: "",
        brand: "",
        price: "",
        year: "",
        imageUrl: "",
      });

      fetchCars();
    } catch (err: any) {
      alert(err.response?.data?.message || "Error adding car");
    }
  };

  return (
    <Layout>

      {/* Add Car */}
      <div className="bg-white p-6 rounded-2xl shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Add New Car</h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input
            name="title"
            placeholder="Car Name"
            value={form.title}
            onChange={handleChange}
            className="p-3 border rounded-lg"
          />

          <input
            name="brand"
            placeholder="Brand"
            value={form.brand}
            onChange={handleChange}
            className="p-3 border rounded-lg"
          />

          <input
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            className="p-3 border rounded-lg"
          />

          <input
            name="year"
            placeholder="Year"
            value={form.year}
            onChange={handleChange}
            className="p-3 border rounded-lg"
          />

          <input
            name="image"
            placeholder="Image URL"
            value={form.imageUrl}
            onChange={handleChange}
            className="p-3 border rounded-lg"
          />
        </div>

        <button
          onClick={handleAddCar}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Add Car
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-gray-600 text-sm">
            <tr>
              <th className="p-4">Image</th>
              <th className="p-4">Name</th>
              <th className="p-4">Brand</th>
              <th className="p-4">Price</th>
              <th className="p-4">Year</th>
            </tr>
          </thead>

          <tbody>
            {cars.map((car) => (
              <tr key={car.id} className="border-t hover:bg-gray-50">
                <td className="p-4">
                  <img
                    src={car.image || "https://via.placeholder.com/80"}
                    className="w-16 h-12 object-cover rounded"
                  />
                </td>
                <td className="p-4 font-medium">{car.title}</td>
                <td className="p-4">{car.brand}</td>
                <td className="p-4">${car.price}</td>
                <td className="p-4">{car.year}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </Layout>
  );
}