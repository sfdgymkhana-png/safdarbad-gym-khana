"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, MapPin, MessageSquare, Clock, ShieldCheck } from "lucide-react";
import { GymStore } from "@/lib/store";
import { SiteSettings } from "@/lib/types";

export default function Footer() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [currentYear, setCurrentYear] = useState(2026);

  useEffect(() => {
    setSettings(GymStore.getSettings());
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-[#0A0A0A] border-t border-[#222222] text-zinc-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Column 1: Brand & Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#FF6B00]">
                <Image
                  src="/images/logo.png"
                  alt="Safdarbad Gym Khan'a"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-white tracking-wider leading-tight">
                  {settings?.gymName || "SAFDARBAD GYM KHAN’A"}
                </h3>
                <p className="text-xs text-[#FF6B00] font-semibold tracking-widest uppercase">
                  Strength • Discipline • Fitness
                </p>
              </div>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Safdarabad&apos;s premier strength and fitness training facility. Empowering individuals to build physical power, mental discipline, and enduring athletic health.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#141414] border border-zinc-800 rounded text-xs text-[#FFC857]">
              <span>Standard Monthly Fee:</span>
              <span className="font-bold text-white">PKR {settings?.standardMonthlyFee?.toLocaleString() || "2,500"}</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-heading text-white text-base font-semibold tracking-wider border-b border-zinc-800 pb-2">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-[#FF6B00] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/#about" className="hover:text-[#FF6B00] transition-colors">
                  About Our Gym
                </Link>
              </li>
              <li>
                <Link href="/#facilities" className="hover:text-[#FF6B00] transition-colors">
                  Facilities & Equipment
                </Link>
              </li>
              <li>
                <Link href="/#plans" className="hover:text-[#FF6B00] transition-colors">
                  Membership Plans
                </Link>
              </li>
              <li>
                <Link href="/#offers" className="hover:text-[#FF6B00] transition-colors">
                  Special Promotions
                </Link>
              </li>
              <li>
                <Link href="/#gallery" className="hover:text-[#FF6B00] transition-colors">
                  Photo Gallery
                </Link>
              </li>
              <li>
                <Link href="/admission" className="text-[#FF6B00] font-semibold hover:underline">
                  Online Admission Application
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Location */}
          <div className="space-y-3">
            <h4 className="font-heading text-white text-base font-semibold tracking-wider border-b border-zinc-800 pb-2">
              Location & Contact
            </h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#FF6B00] shrink-0 mt-0.5" />
                <span className="leading-snug">
                  {settings?.address || "City Safdarabad, Main Bazar, Fatima Center, Top Floor."}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#FF6B00] shrink-0" />
                <a href={`tel:${settings?.phone || "+923059422464"}`} className="hover:text-white transition-colors">
                  {settings?.phone || "+92 305 9422464"}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-emerald-500 shrink-0" />
                <a
                  href={`https://wa.me/${(settings?.whatsapp || "923059422464").replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                >
                  WhatsApp: {settings?.whatsapp || "+92 305 9422464"}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-zinc-500 shrink-0" />
                <span>{settings?.openingHours || "Mon - Sat: 6:00 AM - 11:00 PM"}</span>
              </div>
            </div>
          </div>

          {/* Column 4: WhatsApp Connect & Admin */}
          <div className="space-y-4">
            <h4 className="font-heading text-white text-base font-semibold tracking-wider border-b border-zinc-800 pb-2">
              Instant Connect
            </h4>
            <p className="text-xs text-zinc-400">
              Have questions regarding membership or workout timings? Reach out directly via WhatsApp.
            </p>
            <a
              href="https://wa.me/923059422464"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded transition-colors shadow-md shadow-emerald-950"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>

            {/* Social Icons (displayed ONLY if configured by administrator) */}
            {(settings?.instagramUrl || settings?.tiktokUrl || settings?.facebookUrl) && (
              <div className="pt-2 flex items-center gap-3">
                {settings.instagramUrl && (
                  <a
                    href={settings.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-[#1A1A1A] hover:bg-[#FF6B00] text-zinc-300 hover:text-white rounded transition-colors"
                    aria-label="Instagram"
                  >
                    Instagram
                  </a>
                )}
                {settings.tiktokUrl && (
                  <a
                    href={settings.tiktokUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-[#1A1A1A] hover:bg-[#FF6B00] text-zinc-300 hover:text-white rounded transition-colors"
                    aria-label="TikTok"
                  >
                    TikTok
                  </a>
                )}
              </div>
            )}


          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>© {currentYear} Safdarbad Gym Khan’a. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-zinc-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-zinc-300 cursor-pointer">Membership Terms</span>
            <span className="text-zinc-600">Built for Athletic Excellence</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
