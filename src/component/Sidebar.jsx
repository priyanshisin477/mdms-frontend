import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

export default function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const token = localStorage.getItem("token");
let userRole = "user";
if (token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    userRole = payload.role || "user";
  } catch (err) {
    console.log("Token decode error:", err);
  }
}
    const allMenuItems = [
      { label: "Dashboard",     path: "/dashboard",    icon: "📊", roles: ["admin", "staff", "user"] },
      { label: "Products",      path: "/products",     icon: "📦", roles: ["admin", "staff", "user"] },
      { label: "Sell Product",  path: "/selldata",     icon: "💊", roles: ["admin", "staff"] },
      { label: "Add Product",   path: "/add-product",  icon: "➕", roles: ["admin"] },
      { label: "Sales History", path: "/saleshistory", icon: "🧾", roles: ["admin", "staff"] },
      { label: "Alerts",        path: "/alerts",       icon: "⚠️", roles: ["admin", "staff"] },
      { label: "Users",         path: "/users",        icon: "👥", roles: ["admin"] },
      { label: "Profile",       path: "/profile",      icon: "👤", roles: ["admin", "staff", "user"] },
    ];
    
    const menuItems = allMenuItems.filter(item =>
      item.roles.includes(userRole)
    );


  return (
    <div className={`min-h-screen bg-slate-900 flex flex-col transition-all duration-300 ${collapsed ? "w-16" : "w-64"}`}>

      {/* Header + Toggle */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        {!collapsed && (
          <h1 className="text-lg font-bold text-white">MDMS</h1>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-slate-700 transition ml-auto text-xs"
        >
          {collapsed ? "▶" : "◀"}
        </button>
      </div>

      {/* Menu */}
      <nav className="space-y-1 flex-1 p-2 mt-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              title={item.label}
              className={`flex items-center gap-3 p-3 rounded-xl transition font-medium text-sm
                ${isActive ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-slate-800 hover:text-white"}
                ${collapsed ? "justify-center" : ""}`}
            >
              <span className="text-lg">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-2 mb-2">
        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
          title="Logout"
          className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition ${collapsed ? "justify-center" : ""}`}
        >
          <span className="text-lg">🚪</span>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

    </div>
  );
}