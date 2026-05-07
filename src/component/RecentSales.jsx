import { useEffect, useState } from "react";
import API from "../api";

export default function RecentSales() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchRecentSales = async () => {
    try {
      const res = await API.get(
        "/api/products/sales-history",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Recent Sales Response:", res.data);

      const list =
        Array.isArray(res.data) ? res.data :
        res.data.sales || res.data.data || [];

      setSales(list.slice(0, 5));

    } catch (err) {
      console.log("RecentSales error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentSales();
  }, []);

  if (loading) {
    return (
      <div className="bg-slate-800/60 p-6 rounded-2xl mt-6">
        <h2 className="text-lg font-semibold mb-4">Recent Sales</h2>
        <p className="text-gray-400 animate-pulse text-sm">Loading...</p>
      </div>
    );
  }

  if (sales.length === 0) {
    return (
      <div className="bg-slate-800/60 p-6 rounded-2xl mt-6">
        <h2 className="text-lg font-semibold mb-4">Recent Sales</h2>
        <p className="text-gray-400 text-sm">No Sales.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/60 p-6 rounded-2xl mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Recent Sales</h2>

  
        <a href="/saleshistory"className="text-blue-400 text-sm hover:underline">
          View All →
        </a> 
      </div>
      <table className="w-full text-left">
      <thead>
        <tr className="text-gray-400 border-b border-gray-700 text-sm">
          <th className="py-2">Customer</th>
          <th>Product</th>
          <th>Amount</th>
          <th>Date</th>
        </tr>
      </thead>

      <tbody>
        {sales.map((sale, index) => (
          <tr
            key={sale._id || index}
            className="border-b border-gray-700 hover:bg-slate-700/40 transition"
          >
            <td className="py-3 font-medium">
              {sale.customerName || sale.customer || "Walk-in"}
            </td>

            <td className="text-gray-300">
              {sale.productName || sale.product?.name || "—"}
            </td>

            <td className="text-green-400 font-semibold">
              ₹{(sale.totalAmount || sale.amount || sale.price || 0).toLocaleString()}
            </td>

            <td className="text-gray-400 text-sm">
              {sale.soldAt || sale.createdAt
                ? new Date(sale.soldAt || sale.createdAt).toLocaleDateString("en-IN", {
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
);
}

