import Sidebar from "../component/Sidebar";
import Navbar from "../component/NavbarTemp";
import StatCard from "../component/CardTemp";
import SalesChart from "../component/SalesChart";
import RecentSales from "../component/RecentSales";
import Alert from "../component/Alert";


import API from "../api";;
import { useEffect, useState } from "react";

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");

      //  Token check
      if (!token) {
        window.location.href = "/login";
        return;
      }

      const res = await API.get("/api/products", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Handle both array and {data: [...]}
      const list = Array.isArray(res.data)
        ? res.data
        : res.data.data || res.data.products || [];

      setProducts(list);
    } catch (err) {
      console.log("Dashboard fetch error:", err.response?.data || err.message);

      // if 401 go back in login page 
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserName(res.data.user?.name || res.data.name || "User");
    } catch (err) {
      console.log("User fetch error:", err);
    }
  };

  const updateProduct = async (id, updatedData) => {
    try {
      const token = localStorage.getItem("token");
      await API.put(
        `/api/products/${id}`,
        updatedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Updated ");
      fetchProducts();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchUser();
  }, []);

  // Safe expiry check
  const expiringProducts = products.filter((p) => {
    if (!p?.expiryDate) return false;
    const diff = (new Date(p.expiryDate) - new Date()) / (1000 * 60 * 60 * 24);
    return diff <= 7;
  });

  //  Inventory value calculate
  const inventoryValue = products.reduce((sum, p) => {
    return sum + (p.price || 0) * (p.stock || 1);
  }, 0);

  //  Low stock
  const lowStockCount = products.filter((p) => (p.stock || 0) < 10).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-xl">
        Loading dashboard...
      </div>
    );
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white flex">
    
        {/* Sidebar */}
        <div className={`${sidebarOpen ? "flex" : "hidden"} md:flex fixed md:relative z-50`}>
          <Sidebar />
        </div>
    
        {/* Overlay — mobile pe sidebar open ho to background dark karo */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
    
        {/* Main content */}
        <div className="flex-1 p-4 md:p-6 min-w-0">
          <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
    
          <div className="mt-6">
            <h1 className="text-2xl md:text-4xl font-bold">
              Welcome back, {userName} 💛
            </h1>
            <p className="text-gray-400 mt-2">
              Manage your medical inventory smartly
            </p>
          </div>
    
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            <StatCard title="Total Products" value={products.length} />
            <StatCard title="Low Stock" value={lowStockCount} />
            <StatCard title="Expiring Soon" value={expiringProducts.length} />
            <StatCard title="Inventory Value" value={`₹${inventoryValue.toLocaleString()}`} />
          </div>
    
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
            <div className="xl:col-span-2">
              <SalesChart />
            </div>
            <RecentSales />
            <Alert data={expiringProducts ?? []} />
          </div>
        </div>
    
      </div>
  );
}

export default Dashboard;