"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, X, Calendar } from "lucide-react";
import { GymStore } from "@/lib/store";
import { SiteSettings } from "@/lib/types";

export default function AnnouncementBar() {
  const [settings, setSettings] = useState<SiteSettings>(GymStore.getSettings());
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setSettings(GymStore.getSettings());
    const isDismissed = sessionStorage.getItem("sgk_announcement_dismissed") === "true";
    setDismissed(isDismissed);

    return GymStore.subscribe(() => {
      setSettings(GymStore.getSettings());
    });
  }, []);

  const enabled = settings.announcementEnabled ?? true;
  const text =
    settings.announcementText ||
    "🎉 Grand Opening on 30 October 2026! Early admissions are now open — Register online today!";
  const link = settings.announcementLink || "/admission";

  if (!enabled || dismissed) return null;

  const handleDismiss = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDismissed(true);
    sessionStorage.setItem("sgk_announcement_dismissed", "true");
  };

  return (
    <div className="relative z-50 bg-gradient-to-r from-[#FF6B00] via-[#E05E00] to-[#FF8533] text-white shadow-md border-b border-amber-500/30">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-3 text-xs sm:text-sm">
        <Link
          href={link}
          className="flex-1 flex items-center justify-center gap-2 text-center group cursor-pointer overflow-hidden"
        >
          <span className="hidden sm:inline-flex items-center gap-1 bg-black/25 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-200 shrink-0">
            <Calendar className="w-3 h-3 text-[#FFC857]" />
            Grand Opening
          </span>
          <span className="font-semibold tracking-wide truncate group-hover:underline">
            {text}
          </span>
          <span className="inline-flex items-center gap-1 font-bold text-black bg-white/95 hover:bg-white px-2.5 py-0.5 rounded-full text-[11px] uppercase tracking-wider shrink-0 transition-transform group-hover:translate-x-0.5 shadow-sm">
            <span>Register</span>
            <ArrowRight className="w-3 h-3" />
          </span>
        </Link>

        <button
          onClick={handleDismiss}
          className="p-1 rounded-full text-white/80 hover:text-white hover:bg-black/20 transition-colors shrink-0"
          title="Dismiss announcement"
          aria-label="Dismiss announcement"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
