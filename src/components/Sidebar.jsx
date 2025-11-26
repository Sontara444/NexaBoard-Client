"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Users, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Sidebar = ({ isOpen, closeSidebar }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-20 md:hidden"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 shadow-sm z-30 transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="h-16 flex items-center justify-center border-b border-gray-200">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            NexaBoard
          </h1>
        </div>

        <nav className="mt-4 px-4">
          <SidebarLink
            href="/dashboard"
            icon={<LayoutDashboard size={18} />}
            label="Dashboard"
            active={pathname === "/dashboard"}
            onClick={closeSidebar}
          />

          <SidebarLink
            href="/dashboard/tasks"
            icon={<Users size={18} />}
            label="Tasks"
            active={pathname.startsWith("/dashboard/tasks")}
            onClick={closeSidebar}
          />

          <SidebarLink
            href="/dashboard/profile"
            icon={<Settings size={18} />}
            label="Profile"
            active={pathname.startsWith("/dashboard/profile")}
            onClick={closeSidebar}
          />

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 mb-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium mt-4"
          >
            <LogOut size={18} /> Logout
          </button>
        </nav>
      </aside>
    </>
  );
};

const SidebarLink = ({ href, icon, label, active, onClick }) => (
  <Link
    href={href}
    className={`flex items-center gap-3 px-4 py-2 mb-2 rounded-lg text-sm font-medium transition-colors ${active
        ? "bg-blue-600 text-white"
        : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
      }`}
    onClick={onClick}
  >
    {icon} {label}
  </Link>
);

export default Sidebar;
