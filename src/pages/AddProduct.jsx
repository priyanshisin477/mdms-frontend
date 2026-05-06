import { useState } from "react";
import API from "../api";

export default function AddProduct() {
  const [form, setForm] = useState({
    name: "",
    price: "",
    expiryDate: "",
    quantity: "",
    batchNumber: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const token = localStorage.getItem("token");

      await API.post("/api/products", form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess("Product Added!");
      setForm({ name: "", price: "", expiryDate: "", quantity: "" , batchNumber: ""}); // form reset

    } catch (err) {
      setError(err.response?.data?.message || "something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-slate-950 text-white">
      <h1 className="text-2xl font-bold mb-6">Add Product</h1>

      <div className="bg-slate-800 rounded-2xl p-6 max-w-md">

        {success && <p className="text-green-400 mb-4">{success}</p>}
        {error && <p className="text-red-400 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-400">Product Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Paracetamol"
              required
              className="p-3 rounded-lg bg-slate-900 border border-slate-600 text-white focus:outline-none focus:border-blue-400"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-400">Price (₹)</label>
            <input
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              placeholder="e.g. 120"
              required
              className="p-3 rounded-lg bg-slate-900 border border-slate-600 text-white focus:outline-none focus:border-blue-400"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-400">Stock (quantity)</label>
            <input
              name="quantity"
              type="number"
              value={form.quantity}
              onChange={handleChange}
              placeholder="e.g. 50"
              className="p-3 rounded-lg bg-slate-900 border border-slate-600 text-white focus:outline-none focus:border-blue-400"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-400">Batch Number</label>
            <input
              name="batchNumber"
              value={form.batchNumber}
              onChange={handleChange}
              placeholder="e.g. BATCH-2024-001"
              required
              className="p-3 rounded-lg bg-slate-900 border border-slate-600 text-white focus:outline-none focus:border-blue-400"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-400">Expiry Date</label>
            <input
              name="expiryDate"
              type="date"
              value={form.expiryDate}
              onChange={handleChange}
              required
              className="p-3 rounded-lg bg-slate-900 border border-slate-600 text-white focus:outline-none focus:border-blue-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white py-3 rounded-lg font-semibold transition mt-2"
          >
            {loading ? "Adding..." : "Add Product"}
          </button>

        </form>
      </div>
    </div>
  );
}