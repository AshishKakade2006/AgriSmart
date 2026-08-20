import {
  LayoutDashboard,
  Sprout,
  PlusCircle,
  BarChart3,
  User,
  LogOut,
  ScanSearch,
  History,
  X,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

const Sidebar = ({ isOpen = true, onClose = () => {} }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
    onClose();
  };

  const handleNavClick = () => {
    onClose();
  };

  const menus = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/",
    },
    {
      name: "My Crops",
      icon: <Sprout size={20} />,
      path: "/crops",
    },
    {
      name: "Add Crop",
      icon: <PlusCircle size={20} />,
      path: "/add-crop",
    },
    {
      name: "Analytics",
      icon: <BarChart3 size={20} />,
      path: "/analytics",
    },
    {
      name: "Profile",
      icon: <User size={20} />,
      path: "/profile",
    },
    {
      name: "Disease Detection",
      icon: <ScanSearch size={20} />,
      path: "/disease",
    },
    {
      name: "Disease History",
      icon: <History size={20} />,
      path: "/disease-history",
    },
  ];

  return (
    <>
      <div
        className={
          isOpen
            ? "fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm lg:hidden"
            : "hidden"
        }
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={
          `fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-slate-200 shadow-xl transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 lg:shadow-none lg:border-r ${
            isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`
        }
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 lg:hidden">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <Sprout size={18} />
            </div>
            <span className="text-lg font-bold text-emerald-700">AgriSmart</span>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="space-y-2 p-4 lg:min-h-[calc(100vh-64px)] lg:p-5">
          {menus.map((menu) => (
            <NavLink
              key={menu.name}
              to={menu.path}
              onClick={handleNavClick}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
                }`
              }
            >
              {menu.icon}
              {menu.name}
            </NavLink>
          ))}

          <button
            onClick={handleLogout}
            className="mt-10 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={20} />
            Logout
          </button>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;