import { useEffect, useState } from "react";
import axios from "axios";
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
      const res = await axios.get(
        "http://localhost:5000/api/products/sales-history",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const sales = Array.isArray(res.data)
        ? res.data
        : res.data.sales || res.data.data || [];

      // ✅ Sales ko month ke hisaab se group karo
      const monthMap = {
        0: "Jan", 1: "Feb", 2: "Mar", 3: "Apr",
        4: "May", 5: "Jun", 6: "Jul", 7: "Aug",
        8: "Sep", 9: "Oct", 10: "Nov", 11: "Dec",
      };

      // Har month ka total nikalo
      const grouped = {};

      // Pehle sab months 0 se initialize karo
      Object.values(monthMap).forEach((month) => {
        grouped[month] = 0;
      });

      // Sales data group karo
      sales.forEach((s) => {
        const date = new Date(s.soldAt || s.createdAt);
        const month = monthMap[date.getMonth()];
        grouped[month] += Number(s.totalAmount || s.amount || 0);
      });

      // Chart ke liye array banao
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

  // Total revenue calculate karo
  const totalRevenue = chartData.reduce((sum, d) => sum + d.sales, 0);

  return (
    <div className="bg-slate-800/60 p-6 rounded-2xl mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Sales Overview</h2>
        {/* ✅ Total revenue dikhaao */}
        <span className="text-green-400 text-sm font-medium">
          Total: ₹{totalRevenue.toLocaleString()}
        </span>
      </div>

      {loading ? (
        <p className="text-gray-400 animate-pulse text-center py-10">
          Loading chart...
        </p>
      ) : chartData.every((d) => d.sales === 0) ? (
        // ✅ Koi sale nahi — message dikhaao
        <div className="text-center py-10">
          <p className="text-gray-400">Abhi koi sales nahi hui</p>
          <p className="text-gray-600 text-sm mt-1">
            Sell karo — chart update ho jaayega!
          </p>
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