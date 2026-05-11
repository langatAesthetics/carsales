import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { api } from "../services/api";
import toast from "react-hot-toast";

export default function Dashboard() {
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [editingCar, setEditingCar] = useState<any | null>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    title: "",
    brand: "",
    model: "",
    year: "",
    price: "",

    mileage: "",
    engineSize: "",

    fuelType: "",
    transmission: "",
    driveType: "",

    condition: "",
    status: "AVAILABLE",

    description: "",
  });

  const fetchCars = async () => {
    try {
      const res = await api.get("/cars");

      setCars(res.data);
    } catch {
      toast.error("Failed to load cars");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const resetForm = () => {
    setForm({
      title: "",
      brand: "",
      model: "",
      year: "",
      price: "",

      mileage: "",
      engineSize: "",

      fuelType: "",
      transmission: "",
      driveType: "",

      condition: "",
      status: "AVAILABLE",

      description: "",
    });

    setImageFile(null);

    setEditingCar(null);
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);

      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });

      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (editingCar) {
        await api.put(`/cars/${editingCar.id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        toast.success("Car updated successfully");
      } else {
        await api.post("/cars", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        toast.success("Car added successfully");
      }

      resetForm();

      fetchCars();
    } catch (error) {
      console.error(error);

      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (car: any) => {
    setEditingCar(car);

    setForm({
      title: car.title || "",
      brand: car.brand || "",
      model: car.model || "",
      year: car.year?.toString() || "",
      price: car.price?.toString() || "",

      mileage: car.mileage?.toString() || "",
      engineSize: car.engineSize?.toString() || "",

      fuelType: car.fuelType || "",
      transmission: car.transmission || "",
      driveType: car.driveType || "",

      condition: car.condition || "",
      status: car.status || "AVAILABLE",

      description: car.description || "",
    });
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this car?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/cars/${id}`);

      setCars((prev) => prev.filter((car) => car.id !== id));

      toast.success("Car deleted successfully");
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <Layout>
      {/* FORM */}
      <div className="bg-white rounded-2xl shadow p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-6">
          {editingCar ? "Edit Car" : "Add New Car"}
        </h2>

        {/* BASIC INFO */}
        <div className="mb-8">
          <h3 className="font-semibold mb-4 text-gray-700">
            Basic Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={form.title}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />

            <input
              type="text"
              name="brand"
              placeholder="Brand"
              value={form.brand}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />

            <input
              type="text"
              name="model"
              placeholder="Model"
              value={form.model}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />

            <input
              type="number"
              name="year"
              placeholder="Year"
              value={form.year}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />
          </div>
        </div>

        {/* PRICING */}
        <div className="mb-8">
          <h3 className="font-semibold mb-4 text-gray-700">
            Pricing
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={form.price}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            >
              <option value="AVAILABLE">AVAILABLE</option>
              <option value="SOLD">SOLD</option>
            </select>
          </div>
        </div>

        {/* SPECIFICATIONS */}
        <div className="mb-8">
          <h3 className="font-semibold mb-4 text-gray-700">
            Specifications
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="number"
              name="mileage"
              placeholder="Mileage"
              value={form.mileage}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />

            <input
              type="number"
              name="engineSize"
              placeholder="Engine Size"
              value={form.engineSize}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />

            <select
              name="fuelType"
              value={form.fuelType}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            >
              <option value="">Fuel Type</option>
              <option value="PETROL">PETROL</option>
              <option value="DIESEL">DIESEL</option>
              <option value="HYBRID">HYBRID</option>
              <option value="ELECTRIC">ELECTRIC</option>
            </select>

            <select
              name="transmission"
              value={form.transmission}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            >
              <option value="">Transmission</option>
              <option value="AUTOMATIC">AUTOMATIC</option>
              <option value="MANUAL">MANUAL</option>
            </select>

            <select
              name="driveType"
              value={form.driveType}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            >
              <option value="">Drive Type</option>
              <option value="AWD">AWD</option>
              <option value="FWD">FWD</option>
              <option value="RWD">RWD</option>
            </select>

            <select
              name="condition"
              value={form.condition}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            >
              <option value="">Condition</option>
              <option value="NEW">NEW</option>
              <option value="USED">USED</option>
            </select>
          </div>
        </div>

        {/* MEDIA */}
        <div className="mb-8">
          <h3 className="font-semibold mb-4 text-gray-700">
            Media & Description
          </h3>

          <div className="grid grid-cols-1 gap-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="border p-3 rounded-lg"
            />

            {imageFile && (
              <img
                src={URL.createObjectURL(imageFile)}
                alt="Preview"
                className="w-48 h-32 object-cover rounded-lg border"
              />
            )}

            {editingCar?.imageUrl && !imageFile && (
              <img
                src={editingCar.imageUrl}
                alt="Current"
                className="w-48 h-32 object-cover rounded-lg border"
              />
            )}

            <textarea
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              className="border p-3 rounded-lg min-h-[120px]"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting
              ? "Processing..."
              : editingCar
                ? "Update Car"
                : "Add Car"}
          </button>

          {editingCar && (
            <button
              onClick={resetForm}
              className="bg-gray-200 px-6 py-3 rounded-lg"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        {loading ? (
          <p className="p-6 text-center">
            Loading cars...
          </p>
        ) : cars.length === 0 ? (
          <p className="p-6 text-center text-gray-500">
            No cars added yet
          </p>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-100 text-sm text-gray-600">
              <tr>
                <th className="p-4">Image</th>
                <th className="p-4">Title</th>
                <th className="p-4">Brand</th>
                <th className="p-4">Price</th>
                <th className="p-4">Condition</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {cars.map((car) => (
                <tr
                  key={car.id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="p-4">
                    <img
                      src={
                        car.imageUrl ||
                        "https://via.placeholder.com/80"
                      }
                      alt={car.title}
                      className="w-16 h-12 object-cover rounded"
                    />
                  </td>

                  <td className="p-4 font-medium">
                    {car.title}
                  </td>

                  <td className="p-4">
                    {car.brand}
                  </td>

                  <td className="p-4">
                    ${car.price}
                  </td>

                  <td className="p-4">
                    {car.condition}
                  </td>

                  <td className="p-4">
                    {car.status}
                  </td>

                  <td className="p-4 space-x-3">
                    <button
                      onClick={() => handleEdit(car)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(car.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
}