"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Phone, User, ShieldCheck } from "lucide-react";
import { GymStore } from "@/lib/store";
import { SiteSettings } from "@/lib/types";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    setSettings(GymStore.getSettings());
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/#about" },
    { name: "Facilities", href: "/#facilities" },
    { name: "Plans & Pricing", href: "/#plans" },
    { name: "Offers", href: "/#offers" },
    { name: "Gallery", href: "/#gallery" },
    { name: "Contact", href: "/#contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#101010]/95 backdrop-blur-md shadow-lg shadow-black/40 border-b border-[#262626] py-2.5"
          : "bg-gradient-to-b from-black/80 via-black/40 to-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo & Name */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#FF6B00] shadow-md shadow-[#FF6B00]/20 group-hover:scale-105 transition-transform">
              <Image
                src="/images/logo.png"
                alt="Safdarbad Gym Khan'a"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div>
              <span className="font-heading text-lg sm:text-xl font-bold tracking-wider text-white group-hover:text-[#FF6B00] transition-colors block leading-tight">
                {settings?.gymName || "SAFDARBAD GYM KHAN’A"}
              </span>
              <span className="text-[10px] tracking-widest text-[#FFC857] font-semibold uppercase block">
                Fatima Center • Top Floor
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-zinc-300 hover:text-[#FF6B00] transition-colors tracking-wide"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-zinc-200 hover:text-white bg-[#1A1A1A] hover:bg-[#252525] border border-zinc-700/60 rounded-md transition-all"
            >
              <User className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span>Login</span>
            </Link>

            <Link
              href="/admission"
              className="relative inline-flex items-center justify-center px-5 py-2 text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-[#FF6B00] to-[#FF8533] hover:from-[#e05e00] hover:to-[#ff6b00] rounded-md shadow-md shadow-[#FF6B00]/30 hover:shadow-lg hover:shadow-[#FF6B00]/50 transition-all transform hover:-translate-y-0.5"
            >
              Join Now
            </Link>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex sm:hidden items-center gap-2">
            <Link
              href="/admission"
              className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white bg-[#FF6B00] rounded"
            >
              Join
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-zinc-300 hover:text-white bg-[#1A1A1A] border border-zinc-800 rounded-md"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6 text-[#FF6B00]" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="sm:hidden bg-[#141414] border-b border-zinc-800 px-5 pt-3 pb-6 space-y-3 animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-2 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-base font-medium text-zinc-300 hover:text-[#FF6B00] py-1.5 border-b border-zinc-800/40"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-3">
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 py-2.5 text-sm font-semibold bg-[#222222] text-zinc-200 rounded border border-zinc-700 w-full"
            >
              <User className="w-4 h-4 text-[#FF6B00]" />
              <span>Login to Member Portal</span>
            </Link>
          </div>

          <div className="pt-2 text-xs text-zinc-400 flex items-center justify-between border-t border-zinc-800/60 pt-3">
            <span>Call: +92 305 9422464</span>
            <span className="text-[#FFC857]">PKR 2,500/mo</span>
          </div>
        </div>
      )}
    </header>
  );
}
