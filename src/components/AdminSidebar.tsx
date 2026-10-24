"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  CreditCard,
  Percent,
  Sparkles,
  Dumbbell,
  Image as ImageIcon,
  FileText,
  Share2,
  BarChart3,
  Bell,
  ScrollText,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ExternalLink,
  Lock,
} from "lucide-react";

interface AdminSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export default function AdminSidebar({ collapsed, onToggleCollapse }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    sessionStorage.removeItem("sgk_admin_auth");
    localStorage.removeItem("sgk_admin_auth");
    router.push("/admin");
  };

  const navItems = [
    { name: "Overview Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Members Management", href: "/admin/members", icon: Users },
    { name: "Admission Applications", href: "/admin/admissions", icon: UserCheck },
    { name: "Memberships & Renewals", href: "/admin/memberships", icon: ShieldCheck },
    { name: "Payments & Receipts", href: "/admin/payments", icon: CreditCard },
    { name: "Discounts & Coupons", href: "/admin/discounts", icon: Percent },
    { name: "Special Offers", href: "/admin/offers", icon: Sparkles },
    { name: "Gym Programs", href: "/admin/programs", icon: Dumbbell },
    { name: "Gallery & Photos", href: "/admin/gallery", icon: ImageIcon },
    { name: "Website Content", href: "/admin/content", icon: FileText },
    { name: "Social Media Links", href: "/admin/settings/social", icon: Share2 },
    { name: "Reports & CSV Export", href: "/admin/reports", icon: BarChart3 },
    { name: "Notifications & Alerts", href: "/admin/notifications", icon: Bell },
    { name: "Security & Credentials", href: "/admin/settings/security", icon: Lock },
    { name: "Audit Logs", href: "/admin/audit-logs", icon: ScrollText },
  ];

  return (
    <aside
      className={`fixed top-0 bottom-0 left-0 z-40 bg-[#121212] border-r border-[#262626] flex flex-col justify-between transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Brand Header */}
      <div>
        <div className="h-16 flex items-center justify-between px-4 border-b border-zinc-800">
          <Link href="/admin/dashboard" className="flex items-center gap-3 overflow-hidden">
            <div className="relative w-9 h-9 rounded-full overflow-hidden border border-[#FF6B00] shrink-0">
              <Image src="/images/logo.png" alt="Logo" fill className="object-cover" />
            </div>
            {!collapsed && (
              <div className="truncate">
                <span className="font-heading text-sm font-bold text-white tracking-wider block truncate">
                  GYM KHAN’A
                </span>
                <span className="text-[10px] text-[#FF6B00] font-semibold uppercase tracking-widest block">
                  Admin Portal
                </span>
              </div>
            )}
          </Link>
          <button
            onClick={onToggleCollapse}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors hidden lg:block"
            aria-label="Toggle sidebar collapse"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? "bg-[#FF6B00] text-white font-bold shadow-md shadow-[#FF6B00]/20"
                    : "text-zinc-400 hover:text-white hover:bg-[#1A1A1A]"
                }`}
                title={collapsed ? item.name : undefined}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-zinc-400"}`} />
                {!collapsed && <span className="truncate">{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / Actions */}
      <div className="p-3 border-t border-zinc-800 space-y-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          title="View Public Site"
        >
          <ExternalLink className="w-4 h-4 shrink-0 text-zinc-400" />
          {!collapsed && <span>View Public Site</span>}
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-red-400 hover:bg-red-950/40 transition-colors"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Log Out Admin</span>}
        </button>
      </div>
    </aside>
  );
}
