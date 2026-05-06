import { useEffect, useState } from "react";
import API from "../api";


export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("info"); // info | password

  // Password form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordMsg, setPasswordMsg] = useState({ text: "", type: "" });
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Profile picture
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const token = localStorage.getItem("token");

  // FETCH USER — JWT + API both
  const fetchUser = async () => {
    try {
      // Step 1 — decode JWT token
      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser((prev) => ({ ...prev, id: payload.id, role: payload.role }));
      }

      // Step 2 — fetch data from api
      const res = await API.get("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("User data:", res.data);
      setUser(res.data.user || res.data);

    } catch (err) {
      console.log("Profile error:", err.response?.data);
      if (err.response?.status === 401) window.location.href = "/login";
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // AVATAR CHANGE
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  // CHANGE PASSWORD
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordMsg({ text: "", type: "" });

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMsg({ text: "passwords do not match!", type: "error" });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordMsg({ text: "password must be at least 6 characters long!", type: "error" });
      return;
    }

    setPasswordLoading(true);

    try {
      await API.put(
        "/api/auth/change-password",
        {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPasswordMsg({ text: "password changed successfully!", type: "success" });
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });

    } catch (err) {
      setPasswordMsg({
        text: err.response?.data?.message || "password change failed!",
        type: "error",
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  // AVATAR INITIALS — agar photo nahi hai
  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  if (loading) {
    return (
      <div className="p-6 text-white min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-xl animate-pulse">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="p-6 text-white min-h-screen bg-slate-950">

      <div className="mb-6">
        <h1 className="text-2xl font-bold">Profile 👤</h1>
        <p className="text-gray-400 text-sm mt-1">Manage your account details</p>
      </div>

      <div className="max-w-2xl">

        {/* AVATAR SECTION */}
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 mb-6">
          <div className="flex items-center gap-6">

            {/* Avatar */}
            <div className="relative">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-blue-500"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-3xl font-bold border-4 border-blue-500">
                  {getInitials(user?.name)}
                </div>
              )}

              {/* Upload button */}
              <label className="absolute bottom-0 right-0 bg-slate-700 hover:bg-slate-600 p-1.5 rounded-full cursor-pointer transition border border-slate-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </label>
            </div>

            {/* User Info */}
            <div>
              <h2 className="text-xl font-bold">{user?.name || "User"}</h2>
              <p className="text-gray-400 text-sm mt-0.5">{user?.email || "—"}</p>
              <span className={`text-xs px-3 py-1 rounded-full mt-2 inline-block font-medium
                ${user?.role === "admin"
                  ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                  : "bg-green-500/20 text-green-400 border border-green-500/30"
                }`}>
                {user?.role || "user"}
              </span>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("info")}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition
              ${activeTab === "info"
                ? "bg-blue-600 text-white"
                : "bg-slate-800 text-gray-400 hover:bg-slate-700"
              }`}
          >
            User Info
          </button>
          <button
            onClick={() => setActiveTab("password")}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition
              ${activeTab === "password"
                ? "bg-blue-600 text-white"
                : "bg-slate-800 text-gray-400 hover:bg-slate-700"
              }`}
          >
            Change Password
          </button>
        </div>

        {/* TAB 1 — USER INFO */}
        {activeTab === "info" && (
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <h3 className="font-semibold mb-4 text-gray-300">Account Information</h3>

            <div className="flex flex-col gap-4">

              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500 uppercase tracking-wide">Full Name</label>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-600 text-white">
                  {user?.name || "—"}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500 uppercase tracking-wide">Email</label>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-600 text-white">
                  {user?.email || "—"}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500 uppercase tracking-wide">Role</label>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-600">
                  <span className={`text-sm font-medium capitalize
                    ${user?.role === "admin" ? "text-blue-400" : "text-green-400"}`}>
                    {user?.role || "user"}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500 uppercase tracking-wide">Member Since</label>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-600 text-gray-400">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit", month: "long", year: "numeric"
                      })
                    : "—"}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2 — CHANGE PASSWORD */}
        {activeTab === "password" && (
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <h3 className="font-semibold mb-4 text-gray-300">Change Password</h3>

            <form onSubmit={handlePasswordChange} className="flex flex-col gap-4">

              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-400">Current Password</label>
                <input
                  type="password"
                  placeholder="Current password dalو"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  required
                  className="p-3 rounded-lg bg-slate-900 border border-slate-600 text-white focus:outline-none focus:border-blue-400"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-400">New Password</label>
                <input
                  type="password"
                  placeholder="Naya password dalو"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  required
                  className="p-3 rounded-lg bg-slate-900 border border-slate-600 text-white focus:outline-none focus:border-blue-400"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-400">Confirm New Password</label>
                <input
                  type="password"
                  placeholder="Password confirm karo"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  required
                  className="p-3 rounded-lg bg-slate-900 border border-slate-600 text-white focus:outline-none focus:border-blue-400"
                />
              </div>

              {passwordMsg.text && (
                <p className={`text-sm text-center font-medium p-3 rounded-lg
                  ${passwordMsg.type === "success"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-red-500/20 text-red-400"
                  }`}>
                  {passwordMsg.text}
                </p>
              )}

              <button
                type="submit"
                disabled={passwordLoading}
                className="py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 font-semibold transition"
              >
                {passwordLoading ? "Changing..." : "Change Password"}
              </button>

            </form>
          </div>
        )}

        {/* LOGOUT BUTTON */}
        <button
          onClick={handleLogout}
          className="w-full mt-6 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-semibold transition"
        >
          Logout 🚪
        </button>

      </div>
    </div>
  );
}