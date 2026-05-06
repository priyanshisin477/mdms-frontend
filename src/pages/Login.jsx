import { useState } from "react";
import API from "../api";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
  
    try {
      const res = await API.post("/api/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err.response?.data?.message || "Cannot connect with server");
    }
  };
    

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="bg-slate-800/60 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-[350px] border border-blue-500/20">
        
        <h2 className="text-2xl font-bold text-white text-center mb-6">
          Login
        </h2>

        {error && (
          <p className="text-red-400 text-sm text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Enter email"
            className="p-3 rounded-lg bg-slate-900 text-white border border-gray-600 focus:outline-none focus:border-blue-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Enter password"
            className="p-3 rounded-lg bg-slate-900 text-white border border-gray-600 focus:outline-none focus:border-blue-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition"
          >
            Login
          </button>
        </form>
        <p className="text-gray-400 text-sm text-center mt-4">
  New user?{" "}
  <a href="/register" className="text-blue-400 hover:underline">
    Create account
  </a>
</p>
      </div>
    </div>
  );
}

export default Login;