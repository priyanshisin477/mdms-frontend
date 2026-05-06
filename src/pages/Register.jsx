import { useState } from "react";
import API from "../api";
function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await API.post("/api/auth/register", { name, email, password });
      localStorage.setItem("token", res.data.token);
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err.response?.data?.message || "Cannot connect with server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="bg-slate-800/60 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-[350px] border border-blue-500/20">
        
        <h2 className="text-2xl font-bold text-white text-center mb-6">
          Create Account
        </h2>

        {error && (
          <p className="text-red-400 text-sm text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Full Name"
            className="p-3 rounded-lg bg-slate-900 text-white border border-gray-600 focus:outline-none focus:border-blue-400"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Enter email"
            className="p-3 rounded-lg bg-slate-900 text-white border border-gray-600 focus:outline-none focus:border-blue-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Enter password"
            className="p-3 rounded-lg bg-slate-900 text-white border border-gray-600 focus:outline-none focus:border-blue-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white py-3 rounded-lg font-semibold transition"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        {/* Already have account */}
        <p className="text-gray-400 text-sm text-center mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-400 hover:underline">
            Login
          </a>
        </p>

      </div>
    </div>
  );
}

export default Register;