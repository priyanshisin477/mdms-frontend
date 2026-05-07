import { useEffect, useState } from "react";
import API from "../api";

export default function Alerts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        window.location.href = "/login";
        return;
      }

      const res = await API.get("/api/products", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Alerts products:", res.data); 

      const list = Array.isArray(res.data)
        ? res.data
        : res.data.products || res.data.data || [];

      setProducts(list);
    } catch (err) {
      console.log("Error:", err.response?.data);
      if (err.response?.status === 401) window.location.href = "/login";
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const expiringSoon = products.filter((p) => {
    if (!p.expiryDate) return false;
    const diff = (new Date(p.expiryDate) - new Date()) / (1000 * 60 * 60 * 24);
    return diff > 0 && diff <= 30;
  });

  const lowStock = products.filter((p) => {
    const qty = p.quantity || p.stock || 0;
    return qty > 0 && qty < 10;
  });

  const outOfStock = products.filter((p) => {
    const qty = p.quantity || p.stock || 0;
    return qty === 0;
  });

  const expiryColor = (dateStr) => {
    const diff = (new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24);
    if (diff <= 7) return "text-red-400";
    if (diff <= 15) return "text-orange-400";
    return "text-yellow-400";
  };

  const expiryBadge = (dateStr) => {
    const diff = Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));
    if (diff <= 7) return { label: `${diff} days left`, color: "bg-red-500/20 text-red-400 border-red-500/30" };
    if (diff <= 15) return { label: `${diff} days left`, color: "bg-orange-500/20 text-orange-400 border-orange-500/30" };
    return { label: `${diff} days left`, color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" };
  };

  if (loading) {
    return (
      <div className="p-6 text-white min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-xl animate-pulse">Loading alerts...</p>
      </div>
    );
  }

  return (
    <div className="p-6 text-white min-h-screen bg-slate-950">

      <div className="mb-6">
        <h1 className="text-2xl font-bold">Alerts ⚠️</h1>
        <p className="text-gray-400 text-sm mt-1">Here you will see the important warnings of your inventory</p>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">⏳</span>
            <div>
              <p className="text-yellow-400 text-sm font-medium">Expiring Soon</p>
              <p className="text-3xl font-bold text-yellow-400">{expiringSoon.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📦</span>
            <div>
              <p className="text-orange-400 text-sm font-medium">Low Stock</p>
              <p className="text-3xl font-bold text-orange-400">{lowStock.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🚫</span>
            <div>
              <p className="text-red-400 text-sm font-medium">Out of Stock</p>
              <p className="text-3xl font-bold text-red-400">{outOfStock.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Koi alert nahi */}
      {expiringSoon.length === 0 && lowStock.length === 0 && outOfStock.length === 0 && (
        <div className="text-center py-20">
          <p className="text-6xl mb-4">✅</p>
          <p className="text-xl font-semibold text-green-400">Everything is fine!</p>
          <p className="text-gray-500 text-sm mt-2">No alerts at the moment</p>
        </div>
      )}

      {/* EXPIRING SOON */}
      {expiringSoon.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span>⏳</span>
            <span className="text-yellow-400">Expiring Soon</span>
            <span className="text-sm text-gray-500 font-normal">(After 30 days)</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {expiringSoon.map((p) => {
              const badge = expiryBadge(p.expiryDate);
              return (
                <div key={p._id} className="bg-slate-800 border border-yellow-500/20 rounded-2xl p-4 hover:border-yellow-500/40 transition">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-semibold text-white">{p.name}</p>
                      <p className="text-gray-400 text-xs mt-0.5">Batch: {p.batchNumber || "—"}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full border ${badge.color}`}>{badge.label}</span>
                  </div>
                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-700">
                    <div>
                      <p className="text-gray-400 text-xs">Expiry Date</p>
                      <p className={`font-medium text-sm ${expiryColor(p.expiryDate)}`}>
                        {new Date(p.expiryDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400 text-xs">Stock</p>
                      <p className="text-white font-medium text-sm">{p.quantity || p.stock || 0} units</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* LOW STOCK */}
      {lowStock.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span>📦</span>
            <span className="text-orange-400">Low Stock</span>
            <span className="text-sm text-gray-500 font-normal">(10 se kam)</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {lowStock.map((p) => {
              const qty = p.quantity || p.stock || 0;
              return (
                <div key={p._id} className="bg-slate-800 border border-orange-500/20 rounded-2xl p-4 hover:border-orange-500/40 transition">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-semibold text-white">{p.name}</p>
                      <p className="text-gray-400 text-xs mt-0.5">Batch: {p.batchNumber || "—"}</p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full border bg-orange-500/20 text-orange-400 border-orange-500/30">Low Stock</span>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">Stock remaining</span>
                      <span className="text-orange-400 font-bold">{qty} units</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div className="bg-orange-400 h-2 rounded-full transition-all" style={{ width: `${Math.min((qty / 10) * 100, 100)}%` }} />
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-700">
                    <div>
                      <p className="text-gray-400 text-xs">Price</p>
                      <p className="text-green-400 font-medium text-sm">₹{p.price}</p>
                    </div>
                    <a href="/add-product" className="text-xs bg-orange-500/20 text-orange-400 border border-orange-500/30 px-3 py-1 rounded-full hover:bg-orange-500/30 transition">Restock →</a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* OUT OF STOCK */}
{outOfStock.length > 0 && (
  <div className="mb-8">
    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
      <span>🚫</span>
      <span className="text-red-400">Out of Stock</span>
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {outOfStock.map((p) => (
        <div key={p._id} className="bg-slate-800 border border-red-500/20 rounded-2xl p-4 hover:border-red-500/40 transition">
          
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="font-semibold text-white">{p.name}</p>
              <p className="text-gray-400 text-xs mt-0.5">Batch: {p.batchNumber || "—"}</p>
            </div>
            <span className="text-xs px-2 py-1 rounded-full border bg-red-500/20 text-red-400 border-red-500/30">
              Out of Stock
            </span>
          </div>

          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-400">Stock remaining</span>
              <span className="text-red-400 font-bold">0 units</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div className="bg-red-500 h-2 rounded-full w-0" />
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-700">
            <p className="text-gray-400 text-xs mb-2">Price: <span className="text-green-400 font-medium">₹{p.price}</span></p>
            
            {/* ✅ Stock Update Input */}
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                placeholder="New qty..."
                id={`stock-${p._id}`}
                className="flex-1 p-2 rounded-lg bg-slate-900 border border-slate-600 text-white text-sm focus:outline-none focus:border-green-400"
              />
              <button
                onClick={async () => {
                  const qty = document.getElementById(`stock-${p._id}`).value;
                  
                  if (!qty || qty <= 0) {
                    alert("Quantity daalo!");
                    return;
                  }

                  try {
                    await API.patch(
                      `/api/products/${p._id}/stock`,
                      { quantity: Number(qty) },
                      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
                    );
                    fetchProducts(); // ✅ refresh the list
                  } catch (err) {
                    alert("❌ " + (err.response?.data?.message || "Update failed"));
                  }
                }}
                className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-2 rounded-lg transition font-medium"
              >
                Update ✅
              </button>
            </div>
          </div>

        </div>
      ))}
    </div>
  </div>
)}
    </div>
  );
}