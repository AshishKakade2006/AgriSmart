import { Bell, Leaf, Menu } from "lucide-react";
import { useAuth } from "../context/authContext";

const Navbar = ({ onToggleSidebar }) => {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-4 md:px-8 shadow-sm">

      {/* Left: mobile menu + logo */}
      <div className="flex items-center gap-3">
        <button
          className="md:hidden p-2 rounded-md hover:bg-gray-100"
          onClick={onToggleSidebar}
          aria-label="Toggle menu"
        >
          <Menu />
        </button>

        <Leaf className="text-emerald-600" size={32} />

        <h1 className="text-xl md:text-2xl font-bold text-emerald-700">
          AgriSmart
        </h1>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-md hover:bg-gray-100">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500"></span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          <div className="hidden md:block">
            <p className="font-semibold text-sm">{user?.name}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
