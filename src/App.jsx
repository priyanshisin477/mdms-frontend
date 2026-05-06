import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";
import SellData from "./pages/SellData";
import SalesHistory from "./pages/Sales";
import Alerts from "./pages/Alerts";
import Profile from "./pages/Profile";
import Users from "./pages/Users";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ✅ /login route add kiya */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/selldata" element={<SellData />} />
        <Route path="/saleshistory" element={<SalesHistory />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/Profile" element={<Profile />} />
        {/* ✅ Koi bhi unknown route → login pe bhejo */}
        <Route path="/users" element={<Users />} />
        <Route path="*" element={<Login />} />
             </Routes>
    </BrowserRouter>
  );
}

export default App;