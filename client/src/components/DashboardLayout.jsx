import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { useLocation } from "react-router-dom";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <Navbar onMenuToggle={() => setIsSidebarOpen((prev) => !prev)} />

      <div className="flex min-h-[calc(100vh-64px)]">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>

      <button
        type="button"
        onClick={() => setIsSidebarOpen(true)}
        className="fixed bottom-5 left-5 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 transition hover:bg-emerald-500 lg:hidden"
        aria-label="Open sidebar menu"
      >
        <Menu size={22} />
      </button>
    </div>
  );
};

export default DashboardLayout;