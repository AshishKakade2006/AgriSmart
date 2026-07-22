import {
  LayoutDashboard,
  Sprout,
  PlusCircle,
  BarChart3,
  User,
  LogOut,
  ScanSearch,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

const Sidebar = ({ onClose, isMobile }) => {

  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
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
  ];

  return (
    // On mobile, show overlay panel when opened; on md+ show static sidebar
    <aside className={`bg-white border-r ${isMobile ? "fixed inset-y-16 left-0 z-40 w-64" : "w-64 min-h-[calc(100vh-64px)]"}`}>

      <nav className="p-5 space-y-2">

        {menus.map((menu) => (

          <NavLink
            key={menu.name}
            to={menu.path}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                isActive
                  ? "bg-emerald-600 text-white"
                  : "hover:bg-emerald-100"
              }`
            }
          >
            {menu.icon}

            {menu.name}

          </NavLink>

        ))}

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl w-full hover:bg-red-100 mt-10"
        >
          <LogOut size={20} />

          Logout

        </button>

      </nav>

    </aside>
  );
};

export default Sidebar;