import { useEffect, useState } from "react";
import API from "../api";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ name: "", price: "", expiryDate: "" });
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("token");
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  // FETCH data
  const fetchProducts = async () => {
    try {
      const res = await API.get("/api/products", authHeader);
  
      //  res.data.products 
      const list = Array.isArray(res.data)
        ? res.data
        : res.data.products || res.data.data || [];
  
      setProducts(list);
    } catch (err) {
      console.log("Fetch error:", err.response?.data || err.message);
      if (err.response?.status === 401) window.location.href = "/login";
    } finally {
      setLoading(false);
    }
  };

  // DELETE
  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await API.delete(`/api/products/${id}`, authHeader);
      fetchProducts();
    } catch (err) {
      console.log("Delete error:", err.response?.data);
    }
  };

  // EDIT — open inline form
  const startEdit = (p) => {
    setEditingId(p._id);
    setEditData({
      name: p.name,
      price: p.price,
      expiryDate: p.expiryDate?.slice(0, 10), // YYYY-MM-DD format
    });
  };

  // CANCEL EDIT
  const cancelEdit = () => {
    setEditingId(null);
    setEditData({ name: "", price: "", expiryDate: "" });
  };

  // UPDATE — save to backend
  const updateProduct = async (id) => {
    try {
      await API.put(
        `/api/products/${id}`,
        editData,
        authHeader
      );
      cancelEdit();
      fetchProducts();
    } catch (err) {
      console.log("Update error:", err.response?.data);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // SEARCH FILTER
  const filtered = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  // EXPIRY COLOR
  const expiryColor = (dateStr) => {
    if (!dateStr) return "text-gray-400";
    const diff = (new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24);
    if (diff < 0) return "text-red-500 font-bold";   // expired
    if (diff <= 7) return "text-orange-400 font-bold"; // expiring soon
    return "text-green-400";                           // safe
  };

  if (loading) {
    return (
      <div className="p-6 text-white min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-xl animate-pulse">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="p-6 text-white min-h-screen bg-slate-950">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Products  ({products.length})</h1>

        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 rounded-lg bg-slate-800 border border-slate-600 text-white focus:outline-none focus:border-blue-400 w-full sm:w-64"
        />
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <p className="text-gray-400">No products found.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl">
          <table className="w-full text-left bg-slate-800 rounded-xl overflow-hidden">
            <thead className="bg-slate-700 text-gray-300 text-sm uppercase">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">Name</th>
                <th className="p-3">Price</th>
                <th className="p-3">Expiry</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((p, index) => (
                <tr
                  key={p._id}
                  className="border-b border-slate-700 hover:bg-slate-700/40 transition"
                >
                  <td className="p-3 text-gray-400 text-sm">{index + 1}</td>

                  {/* EDIT MODE — inline form */}
                  {editingId === p._id ? (
                    <>
                      <td className="p-2">
                        <input
                          value={editData.name}
                          onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                          className="p-1.5 rounded bg-slate-900 border border-blue-400 text-white w-full focus:outline-none"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          value={editData.price}
                          onChange={(e) => setEditData({ ...editData, price: e.target.value })}
                          className="p-1.5 rounded bg-slate-900 border border-blue-400 text-white w-24 focus:outline-none"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="date"
                          value={editData.expiryDate}
                          onChange={(e) => setEditData({ ...editData, expiryDate: e.target.value })}
                          className="p-1.5 rounded bg-slate-900 border border-blue-400 text-white focus:outline-none"
                        />
                      </td>
                      <td className="p-2 space-x-2">
                        <button
                          onClick={() => updateProduct(p._id)}
                          className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded text-sm font-medium transition"
                        >
                          Save ✅
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="bg-slate-600 hover:bg-slate-500 px-3 py-1 rounded text-sm transition"
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    /* VIEW MODE — normal row */
                    <>
                      <td className="p-3 font-medium">{p.name}</td>
                      <td className="p-3 text-green-400 font-semibold">₹{p.price}</td>
                      <td className={`p-3 text-sm ${expiryColor(p.expiryDate)}`}>
                        {p.expiryDate
                          ? new Date(p.expiryDate).toDateString()
                          : "N/A"}
                      </td>
                      <td className="p-3 space-x-2">
                        <button
                          onClick={() => startEdit(p)}
                          className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded text-sm transition"
                        >
                          Edit ✏️
                        </button>
                        <button
                          onClick={() => deleteProduct(p._id)}
                          className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm transition"
                        >
                          Delete 
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}