import { useState } from "react";

export default function Navbar({ onMenuClick }) {
  return (
    <div className="flex justify-between items-center mb-4">

      {/* Mobile hamburger */}
      <button
        className="md:hidden text-xl text-white p-2"
        onClick={onMenuClick}
      >
        ☰
      </button>

      {/* Search */}
      <input
        type="text"
        placeholder="Search products..."
        className="bg-slate-800 p-2 rounded-lg w-1/2 md:w-1/3 text-white"
      />

      {/* Logo */}
      <span className="hidden sm:block text-white font-bold">MDMS</span>

    </div>
  );
}