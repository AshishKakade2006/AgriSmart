import { Bell, Leaf } from "lucide-react";
import { useAuth } from "../context/authContext";

const Navbar = () => {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-8 shadow-sm">

      {/* Logo */}

      <div className="flex items-center gap-3">
        <Leaf className="text-emerald-600" size={32} />

        <h1 className="text-2xl font-bold text-emerald-700">
          AgriSmart
        </h1>
      </div>

      {/* Right Side */}

      <div className="flex items-center gap-6">

        <button className="relative">
          <Bell size={22} />

          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500"></span>
        </button>

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          <div>

            <p className="font-semibold">
              {user?.name}
            </p>

            <p className="text-sm text-gray-500 capitalize">
              {user?.role}
            </p>

          </div>

        </div>

      </div>

    </header>
  );
};

export default Navbar;