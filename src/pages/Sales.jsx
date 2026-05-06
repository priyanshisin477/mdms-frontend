import { useEffect, useState } from "react";
import API from "../api";

export default function SalesHistory() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all, today, week, month

  const token = localStorage.getItem("token");
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  // FETCH SALES
  const fetchSales = async () => {
    try {
      const res = await API.get("/api/products/sales-history", authHeader);

      console.log("Sales Response:", res.data); // check structure

      const list =
        Array.isArray(res.data) ? res.data :
        res.data.sales || res.data.data || [];

      setSales(list);
    } catch (err) {
      console.log("Error:", err.response?.data || err.message);
      if (err.response?.status === 401) window.location.href = "/login";
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  // DATE FILTER
  const filterByDate = (sale) => {
    if (filter === "all") return true;

    const saleDate = new Date(sale.soldAt || sale.createdAt || sale.date);
    const today = new Date();

    if (filter === "today") {
      return saleDate.toDateString() === today.toDateString();
    }
    if (filter === "week") {
      const weekAgo = new Date();
      weekAgo.setDate(today.getDate() - 7);
      return saleDate >= weekAgo;
    }
    if (filter === "month") {
      return (
        saleDate.getMonth() === today.getMonth() &&
        saleDate.getFullYear() === today.getFullYear()
      );
    }
    return true;
  };

  // SEARCH + FILTER COMBINED
  const filtered = sales
    .filter(filterByDate)
    .filter((s) =>
      s.productName?.toLowerCase().includes(search.toLowerCase()) ||
      s.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      s.product?.name?.toLowerCase().includes(search.toLowerCase())
    );

  // TOTAL REVENUE
  const totalRevenue = filtered.reduce((sum, s) => {
    return sum + (s.totalAmount || s.amount || s.price || 0);
  }, 0);

  // STATUS COLOR
  const statusColor = (status) => {
    if (!status) return "text-gray-400";
    if (status === "completed") return "text-green-400";
    if (status === "pending") return "text-yellow-400";
    if (status === "cancelled") return "text-red-400";
    return "text-gray-400";
  };

  if (loading) {
    return (
      <div className="p-6 text-white min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-xl animate-pulse">Loading sales...</p>
      </div>
    );
  }

  return (
    <div className="p-6 text-white min-h-screen bg-slate-950">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Sales History 🧾</h1>

        <input
          type="text"
          placeholder="Search by product or customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 rounded-lg bg-slate-800 border border-slate-600 text-white focus:outline-none focus:border-blue-400 w-full sm:w-72"
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-800 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Total Sales</p>
          <p className="text-2xl font-bold mt-1">{filtered.length}</p>
        </div>
        <div className="bg-slate-800 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Total Revenue</p>
          <p className="text-2xl font-bold mt-1 text-green-400">
            ₹{totalRevenue.toLocaleString()}
          </p>
        </div>
        <div className="bg-slate-800 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Avg Per Sale</p>
          <p className="text-2xl font-bold mt-1 text-blue-400">
            ₹{filtered.length > 0 ? Math.round(totalRevenue / filtered.length).toLocaleString() : 0}
          </p>
        </div>
      </div>

      {/* Date Filter Buttons */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {["all", "today", "week", "month"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition capitalize
              ${filter === f
                ? "bg-blue-600 text-white"
                : "bg-slate-800 text-gray-400 hover:bg-slate-700"
              }`}
          >
            {f === "all" ? "All Time" :
             f === "today" ? "Today" :
             f === "week" ? "This Week" : "This Month"}
          </button>
        ))}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No sales found.</p>
          <p className="text-gray-600 text-sm mt-1">
            Try changing filter or search
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl">
          <table className="w-full text-left bg-slate-800 rounded-xl overflow-hidden">
            <thead className="bg-slate-700 text-gray-300 text-sm uppercase">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">Product</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Qty</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((s, index) => (
                <tr
                  key={s._id || index}
                  className="border-b border-slate-700 hover:bg-slate-700/40 transition"
                >
                  <td className="p-3 text-gray-400 text-sm">{index + 1}</td>

                  {/* Product Name */}
                  <td className="p-3 font-medium">
                    {s.productName || s.product?.name || "—"}
                  </td>

                  {/* Customer */}
                  <td className="p-3 text-gray-300">
                    {s.customerName || s.customer || "Walk-in"}
                  </td>

                  {/* Quantity */}
                  <td className="p-3 text-center">
                    <span className="bg-slate-700 px-2 py-0.5 rounded text-sm">
                      {s.quantitySold || s.quantity || 1}
                    </span>
                  </td>

                  {/* Amount */}
                  <td className="p-3 text-green-400 font-semibold">
                    ₹{Number(s.totalAmount || s.amount || s.price || 0).toLocaleString()}
                  </td>

                  {/* Status */}
                  <td className={`p-3 text-sm font-medium capitalize ${statusColor(s.status)}`}>
                    {s.status || "completed"}
                  </td>

                  {/* Date */}
                  <td className="p-3 text-gray-400 text-sm">
                    {s.soldAt || s.createdAt || s.date
                      ? new Date(s.soldAt || s.createdAt || s.date).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}