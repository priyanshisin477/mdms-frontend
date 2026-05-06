import { useEffect, useState } from "react";
import axios from "axios";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const token = localStorage.getItem("token");
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/auth/users", authHeader);
      setUsers(res.data.users || []);
    } catch (err) {
      console.log("Users error:", err.response?.data);
      if (err.response?.status === 401) window.location.href = "/login";
      if (err.response?.status === 403) window.location.href = "/dashboard";
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (userId, newRole) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/auth/users/${userId}/role`,
        { role: newRole },
        authHeader
      );
      setMsg(` Role updated to ${newRole}!`);
      fetchUsers(); // list refresh karo
      setTimeout(() => setMsg(""), 3000);
    } catch (err) {
      setMsg(" Role update failed!");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const roleColor = (role) => {
    if (role === "admin") return "text-blue-400 bg-blue-500/20 border-blue-500/30";
    if (role === "staff") return "text-green-400 bg-green-500/20 border-green-500/30";
    return "text-gray-400 bg-gray-500/20 border-gray-500/30";
  };

  if (loading) {
    return (
      <div className="p-6 text-white min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="animate-pulse text-xl">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="p-6 text-white min-h-screen bg-slate-950">

      <div className="mb-6">
        <h1 className="text-2xl font-bold">User Management 👥</h1>
        <p className="text-gray-400 text-sm mt-1">
          Only admin can change the role of users
        </p>
      </div>

      {/* Success/Error Message */}
      {msg && (
        <p className={`mb-4 p-3 rounded-lg text-sm font-medium
          ${msg.includes("✅")
            ? "bg-green-500/20 text-green-400"
            : "bg-red-500/20 text-red-400"
          }`}>
          {msg}
        </p>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <p className="text-gray-400 text-sm">Total Users</p>
          <p className="text-2xl font-bold text-white mt-1">{users.length}</p>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <p className="text-gray-400 text-sm">Admins</p>
          <p className="text-2xl font-bold text-blue-400 mt-1">
            {users.filter(u => u.role === "admin").length}
          </p>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <p className="text-gray-400 text-sm">Staff</p>
          <p className="text-2xl font-bold text-green-400 mt-1">
            {users.filter(u => u.role === "staff").length}
          </p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700">
        <table className="w-full text-left">
          <thead className="bg-slate-700 text-gray-300 text-sm uppercase">
            <tr>
              <th className="p-4">#</th>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Current Role</th>
              <th className="p-4">Change Role</th>
              <th className="p-4">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, index) => (
              <tr key={u._id} className="border-b border-slate-700 hover:bg-slate-700/40 transition">
                <td className="p-4 text-gray-400 text-sm">{index + 1}</td>

                {/* Name */}
                <td className="p-4 font-medium">{u.name}</td>

                {/* Email */}
                <td className="p-4 text-gray-400 text-sm">{u.email}</td>

                {/* Current Role Badge */}
                <td className="p-4">
                  <span className={`text-xs px-3 py-1 rounded-full border font-medium capitalize ${roleColor(u.role)}`}>
                    {u.role}
                  </span>
                </td>

                {/* Role Change Dropdown */}
                <td className="p-4">
                  <select
                    defaultValue={u.role}
                    onChange={(e) => updateRole(u._id, e.target.value)}
                    className="bg-slate-900 border border-slate-600 text-white text-sm p-2 rounded-lg focus:outline-none focus:border-blue-400"
                  >
                    <option value="user">User</option>
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>

                {/* Joined Date */}
                <td className="p-4 text-gray-400 text-sm">
                  {u.createdAt
                    ? new Date(u.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit", month: "short", year: "numeric"
                      })
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}