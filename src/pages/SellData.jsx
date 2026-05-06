import { useEffect, useState } from "react";
import API from "../api";

export default function SellProduct() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ customerName: "", quantity: 1 });
  const [sellLoading, setSellLoading] = useState(false);
  const [recentSales, setRecentSales] = useState([]);
  const [msg, setMsg] = useState({ text: "", type: "" });

  const token = localStorage.getItem("token");
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  // FETCH PRODUCTS
  const fetchProducts = async () => {
    try {
      const res = await API.get("/api/products", authHeader);
      const list = Array.isArray(res.data) ? res.data : res.data.products || res.data.data || [];
      setProducts(list);
    } catch (err) {
      console.log("Products error:", err.response?.data);
      if (err.response?.status === 401) window.location.href = "/login";
    } finally {
      setLoading(false);
    }
  };

  // FETCH RECENT SALES
  const fetchRecentSales = async () => {
    try {
      const res = await API.get(
        "/api/products/sales-history",
        authHeader
      );
      const list = Array.isArray(res.data) ? res.data : res.data.sales || res.data.data || [];
      setRecentSales(list.slice(0, 8)); // last 8 sales
    } catch (err) {
      console.log("Sales error:", err.response?.data);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchRecentSales();
  }, []);

  // PRODUCT SELECT
  const handleSelect = (product) => {
    setSelected(product);
    setForm({ customerName: "", quantity: 1 });
    setMsg({ text: "", type: "" });
  };

  // SELL SUBMIT
  const handleSell = async (e) => {
    e.preventDefault();
    setSellLoading(true);
    setMsg({ text: "", type: "" });

    try {
      await API.post(
        `/api/products/${selected._id}/sell`,
        {
          customerName: form.customerName,
          quantity: Number(form.quantity),
        },
        authHeader
      );

      setMsg({ text: " Sale successfully recorded!", type: "success" });

      // Sab refresh karo
      fetchProducts();
      fetchRecentSales();

      // Form reset
      setForm({ customerName: "", quantity: 1 });
      setSelected(null);

    } catch (err) {
      setMsg({
        text: err.response?.data?.message || " Sales failed!",
        type: "error",
      });
    } finally {
      setSellLoading(false);
    }
  };

  // SEARCH FILTER
  const filtered = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  // STATS
  const totalSalesCount = recentSales.length;
  const totalRevenue = recentSales.reduce(
    (sum, s) => sum + Number(s.totalAmount || s.amount || 0), 0
  );
  const totalQuantitySold = recentSales.reduce(
    (sum, s) => sum + Number(s.quantitySold || s.quantity || 0), 0
  );

  if (loading) {
    return (
      <div className="p-6 text-white min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-xl animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6 text-white min-h-screen bg-slate-950">

      <h1 className="text-2xl font-bold mb-6">Sell Product </h1>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <p className="text-gray-400 text-sm">Total Sales</p>
          <p className="text-3xl font-bold mt-1 text-blue-400">{totalSalesCount}</p>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <p className="text-gray-400 text-sm">Total Revenue</p>
          <p className="text-3xl font-bold mt-1 text-green-400">
            ₹{totalRevenue.toLocaleString()}
          </p>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <p className="text-gray-400 text-sm">Units Sold</p>
          <p className="text-3xl font-bold mt-1 text-purple-400">{totalQuantitySold}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* LEFT — Product Select + Form */}
        <div className="flex flex-col gap-4">

          {/* Search Product */}
          <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700">
            <h2 className="font-semibold mb-3 text-gray-300">
              Step-1 Select the Product 
            </h2>
            <input
              type="text"
              placeholder="Search Product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-3 rounded-lg bg-slate-900 border border-slate-600 text-white focus:outline-none focus:border-blue-400 mb-3"
            />

            {/* Product List */}
            <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
              {filtered.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">
                  Their is no product
                </p>
              ) : (
                filtered.map((p) => (
                  <button
                    key={p._id}
                    onClick={() => handleSelect(p)}
                    className={`w-full text-left p-3 rounded-xl border transition
                      ${selected?._id === p._id
                        ? "border-blue-500 bg-blue-500/20"
                        : "border-slate-600 bg-slate-900 hover:border-slate-400"
                      }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{p.name}</p>
                        <p className="text-green-400 text-sm">₹{p.price}</p>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs px-2 py-1 rounded-full
                          ${(p.quantity || p.stock || 0) < 10
                            ? "bg-red-500/20 text-red-400"
                            : "bg-green-500/20 text-green-400"
                          }`}>
                          Stock: {p.quantity || p.stock || 0}
                        </span>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Sell Form */}
          {selected && (
            <div className="bg-slate-800 rounded-2xl p-4 border border-blue-500/40">
              <h2 className="font-semibold mb-4 text-gray-300">
                Step 2 — Fill the Sales Detail 
              </h2>

              {/* Selected Product Info */}
              <div className="bg-slate-900 rounded-xl p-3 mb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-lg">{selected.name}</p>
                    <p className="text-gray-400 text-sm">
                      Batch: {selected.batchNumber || "—"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 font-bold text-lg">₹{selected.price}</p>
                    <p className="text-gray-400 text-xs">
                      Stock left: {selected.quantity || selected.stock || 0}
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSell} className="flex flex-col gap-4">

                {/* Customer Name */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-400">Customer Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Rahul Sharma"
                    value={form.customerName}
                    onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                    required
                    className="p-3 rounded-lg bg-slate-900 border border-slate-600 text-white focus:outline-none focus:border-blue-400"
                  />
                </div>

                {/* Quantity */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-400">Quantity</label>
                  <div className="flex items-center gap-3">
                    {/* Minus button */}
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, quantity: Math.max(1, form.quantity - 1) })}
                      className="w-10 h-10 rounded-lg bg-slate-700 hover:bg-slate-600 text-xl font-bold transition"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={selected.quantity || selected.stock || 999}
                      value={form.quantity}
                      onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
                      required
                      className="flex-1 p-3 rounded-lg bg-slate-900 border border-slate-600 text-white text-center focus:outline-none focus:border-blue-400"
                    />
                    {/* Plus button */}
                    <button
                      type="button"
                      onClick={() => setForm({
                        ...form,
                        quantity: Math.min(
                          selected.quantity || selected.stock || 999,
                          form.quantity + 1
                        )
                      })}
                      className="w-10 h-10 rounded-lg bg-slate-700 hover:bg-slate-600 text-xl font-bold transition"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Total Amount */}
                <div className="bg-slate-900 rounded-xl p-4 flex justify-between items-center">
                  <span className="text-gray-400">Total Amount</span>
                  <span className="text-green-400 font-bold text-2xl">
                    ₹{(selected.price * form.quantity).toLocaleString()}
                  </span>
                </div>

                {/* Message */}
                {msg.text && (
                  <p className={`text-sm text-center font-medium p-3 rounded-lg
                    ${msg.type === "success"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                    }`}>
                    {msg.text}
                  </p>
                )}

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setSelected(null)}
                    className="flex-1 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={sellLoading}
                    className="flex-1 py-3 rounded-xl bg-green-600 hover:bg-green-700 disabled:opacity-50 font-semibold transition"
                  >
                    {sellLoading ? "Processing..." : "Confirm Sale "}
                  </button>
                </div>

              </form>
            </div>
          )}
        </div>

        {/* RIGHT — Recent Sales */}
        <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-300">Recent Sales </h2>
            <a
              href="/saleshistory">
              View All →
            </a>
          </div>

          {recentSales.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-4xl mb-3">🧾</p>
              <p className="text-gray-400">Their is no sale</p>
              <p className="text-gray-600 text-sm mt-1">
                Show the Sales <details></details>
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2 max-h-96 overflow-y-auto pr-1">
              {recentSales.map((s, index) => (
                <div
                  key={s._id || index}
                  className="bg-slate-900 rounded-xl p-3 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium text-sm">
                      {s.productName || s.product?.name || "—"}
                    </p>
                    <p className="text-gray-500 text-xs mt-0.5">
                      {s.customerName || "Walk-in"} • Qty: {s.quantitySold || s.quantity || 1}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 font-semibold text-sm">
                      ₹{(s.totalAmount || s.amount || 0).toLocaleString()}
                    </p>
                    <p className="text-gray-500 text-xs mt-0.5">
                      {s.soldAt || s.createdAt
                        ? new Date(s.soldAt || s.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                          })
                        : "—"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}