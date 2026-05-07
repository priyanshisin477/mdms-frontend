import { useEffect, useState } from "react";
import API from "../api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function SalesChart() {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchChartData = async () => {
    try {
      const res = await API.get(
        "/api/products/sales-history",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const sales = Array.isArray(res.data)
        ? res.data
        : res.data.sales || res.data.data || [];

      // ✅group sales accroding to month
      const monthMap = {
        0: "Jan", 1: "Feb", 2: "Mar", 3: "Apr",
        4: "May", 5: "Jun", 6: "Jul", 7: "Aug",
        8: "Sep", 9: "Oct", 10: "Nov", 11: "Dec",
      };

      // all month total
      const grouped = {};

      // initialize all month with 0 sales
      Object.values(monthMap).forEach((month) => {
        grouped[month] = 0;
      });

      // group sales data
      sales.forEach((s) => {
        const date = new Date(s.soldAt || s.createdAt);
        const month = monthMap[date.getMonth()];
        grouped[month] += Number(s.totalAmount || s.amount || 0);
      });

      // create array for chart
      const formatted = Object.entries(grouped).map(([name, sales]) => ({
        name,
        sales,
      }));

      setChartData(formatted);

    } catch (err) {
      console.log("Chart error:", err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, []);

  // calculate total revenue
  const totalRevenue = chartData.reduce((sum, d) => sum + d.sales, 0);

  return (
    <div className="bg-slate-800/60 p-6 rounded-2xl mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Sales Overview</h2>
        {/* ✅ show total revenue */}
        <span className="text-green-400 text-sm font-medium">
          Total: ₹{totalRevenue.toLocaleString()}
        </span>
      </div>

      {loading ? (
        <p className="text-gray-400 animate-pulse text-center py-10">
          Loading chart...
        </p>
      ) : chartData.every((d) => d.sales === 0) ? (
        
        <div className="text-center py-10">
          <p className="text-gray-400">No sales yet</p>
          <p className="text-gray-600 text-sm mt-1">
          Make a sale — chart will update!</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="name" stroke="#ccc" tick={{ fontSize: 12 }} />
            <YAxis stroke="#ccc" tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "1px solid #334155",
                borderRadius: "8px",
                color: "#fff",
              }}
              formatter={(value) => [`₹${Number(value).toLocaleString()}`, "Sales"]}
            />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: "#3b82f6", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}