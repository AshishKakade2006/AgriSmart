import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const DashboardLayout = ({ children }) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const toggleSidebar = () => setMobileSidebarOpen((s) => !s);
  const closeSidebar = () => setMobileSidebarOpen(false);

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar onToggleSidebar={toggleSidebar} />

      <div className="flex">
        {/* Desktop sidebar */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Mobile overlay sidebar */}
        {mobileSidebarOpen && (
          <div className="md:hidden">
            <div
              className="fixed inset-0 bg-black/30 z-30"
              onClick={closeSidebar}
            />
            <Sidebar isMobile onClose={closeSidebar} />
          </div>
        )}

        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;