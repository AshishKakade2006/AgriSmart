import { Bell, Leaf, Menu } from "lucide-react";
import { useAuth } from "../context/authContext";

const Navbar = ({ onMenuToggle }) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-20 h-16 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-sm">
      <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onMenuToggle}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 lg:hidden"
            aria-label="Toggle sidebar"
          >
            <Menu size={22} />
          </button>

          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <Leaf size={20} />
            </div>

            <h1 className="truncate text-xl font-bold text-emerald-700 sm:text-2xl">
              AgriSmart
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-5">
          <button
            type="button"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            aria-label="Notifications"
          >
            <Bell size={20} />
            <span className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white"></span>
          </button>

          <div className="hidden items-center gap-3 sm:flex">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white shadow-sm">
              {user?.name?.charAt(0)?.toUpperCase() || "A"}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800">{user?.name || "Farmer"}</p>
              <p className="truncate text-xs capitalize text-slate-500">{user?.role || "User"}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;