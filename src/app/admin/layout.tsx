"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import { Menu, X, Shield, Bell } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  const isLoginPage = pathname === "/admin";

  useEffect(() => {
    if (isLoginPage) {
      setAuthenticated(true);
      return;
    }
    const auth =
      sessionStorage.getItem("sgk_admin_auth") ||
      localStorage.getItem("sgk_admin_auth");
    if (!auth) {
      router.push("/admin");
    } else {
      setAuthenticated(true);
    }
  }, [pathname, isLoginPage, router]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // If on login page, don't show the dashboard shell
  if (isLoginPage) {
    return <div className="min-h-screen bg-[#0E0E0E] text-white">{children}</div>;
  }

  if (authenticated === null) {
    return (
      <div className="min-h-screen bg-[#0E0E0E] flex items-center justify-center text-white text-sm">
        Verifying administrator authorization...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0E0E0E] text-white flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <AdminSidebar
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
        />
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative z-50 w-72 max-w-[85vw] h-full bg-[#121212] shadow-2xl flex flex-col">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-3 p-1.5 text-zinc-400 hover:text-white bg-zinc-800 rounded-lg z-50"
              aria-label="Close sidebar"
            >
              <X className="w-4 h-4" />
            </button>
            <AdminSidebar
              collapsed={false}
              onToggleCollapse={() => setMobileOpen(false)}
              onNavigate={() => setMobileOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          collapsed ? "lg:ml-20" : "lg:ml-64"
        }`}
      >
        {/* Top Header Bar */}
        <header className="h-16 bg-[#141414] border-b border-zinc-800 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 text-zinc-400 hover:text-white bg-[#1C1C1C] rounded-lg lg:hidden"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="block sm:hidden">
              <span className="font-heading text-xs font-bold text-white tracking-wider block">
                GYM KHAN’A
              </span>
              <span className="text-[9px] text-[#FF6B00] font-semibold block uppercase tracking-wider">
                Admin Portal
              </span>
            </div>
            <div className="hidden sm:block">
              <span className="text-xs text-zinc-400 block">Administration Management</span>
              <h2 className="font-heading text-base font-bold text-white tracking-wider">
                Safdarbad Gym Khan’a System
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/admin/notifications"
              className="p-2 text-zinc-400 hover:text-amber-400 bg-[#1C1C1C] hover:bg-zinc-800 rounded-lg relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF6B00]" />
            </Link>

            <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-zinc-800">
              <div className="w-8 h-8 rounded-full bg-[#FF6B00] text-black font-bold font-heading flex items-center justify-center text-xs">
                A
              </div>
              <div className="hidden sm:block text-left text-xs">
                <span className="font-semibold text-white block">Gym Administrator</span>
                <span className="text-[10px] text-emerald-400 font-mono">AUTHORIZED</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page View Body */}
        <main className="flex-1 p-3.5 sm:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
