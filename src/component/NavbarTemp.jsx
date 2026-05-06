import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex justify-between items-center mb-4">

      {/* Mobile menu button */}
      <button className="md:hidden text-xl" onClick={() => setOpen(!open)}>
        ☰
      </button>

      {/* Search */}
      <input
        type="text"
        placeholder="Search products..."
        className="bg-slate-800 p-2 rounded-lg w-1/2 md:w-1/3"
      />

      {/* User */}
      <span className="hidden sm:block">MDMS</span>
    </div>
  );
}