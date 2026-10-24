"use client";

import { useEffect, useState } from "react";
import { GymStore } from "@/lib/store";
import { SiteSettings } from "@/lib/types";
import { FileText, Save, CheckCircle2 } from "lucide-react";

export default function AdminContentPage() {
  const [settings, setSettings] = useState<SiteSettings>(GymStore.getSettings());
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSettings(GymStore.getSettings());
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    GymStore.saveSettings(settings, "Administrator");
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
            Website Content & Pricing Editor
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Modify the live gym name, monthly fee, hero copy, and about introduction without touching code.
          </p>
        </div>

        {saved && (
          <div className="px-3.5 py-1.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-semibold rounded-lg flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>Changes published live!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="bg-[#161616] border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl text-xs">
        {/* Core Pricing & Name */}
        <div className="space-y-4">
          <h3 className="font-heading text-base font-bold text-[#FFC857] border-b border-zinc-800 pb-2">
            1. Core Business Information & Membership Pricing
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Gym Name</label>
              <input
                type="text"
                required
                value={settings.gymName}
                onChange={(e) => setSettings({ ...settings, gymName: e.target.value })}
                className="w-full px-3 py-2 bg-[#121212] border border-zinc-700 rounded-lg text-white font-medium"
              />
            </div>
            <div>
              <label className="block text-zinc-300 font-semibold mb-1">
                Standard Monthly Membership Fee (PKR) <span className="text-[#FF6B00]">*</span>
              </label>
              <input
                type="number"
                required
                value={settings.standardMonthlyFee}
                onChange={(e) =>
                  setSettings({ ...settings, standardMonthlyFee: Number(e.target.value) })
                }
                className="w-full px-3 py-2 bg-[#121212] border border-zinc-700 rounded-lg text-white font-bold text-sm text-[#FF6B00]"
              />
            </div>
            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Brand Tagline</label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full px-3 py-2 bg-[#121212] border border-zinc-700 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Operating Hours</label>
              <input
                type="text"
                value={settings.openingHours || ""}
                onChange={(e) => setSettings({ ...settings, openingHours: e.target.value })}
                className="w-full px-3 py-2 bg-[#121212] border border-zinc-700 rounded-lg text-white"
              />
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="space-y-4 pt-2">
          <h3 className="font-heading text-base font-bold text-[#FFC857] border-b border-zinc-800 pb-2">
            2. Hero Banner Headline & Supporting Text
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Hero Main Headline</label>
              <input
                type="text"
                required
                value={settings.heroHeadline}
                onChange={(e) => setSettings({ ...settings, heroHeadline: e.target.value })}
                className="w-full px-3 py-2 bg-[#121212] border border-zinc-700 rounded-lg text-white font-bold"
              />
            </div>
            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Hero Supporting Subtitle</label>
              <textarea
                rows={2}
                value={settings.heroSupportingText}
                onChange={(e) => setSettings({ ...settings, heroSupportingText: e.target.value })}
                className="w-full px-3 py-2 bg-[#121212] border border-zinc-700 rounded-lg text-white"
              />
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="space-y-4 pt-2">
          <h3 className="font-heading text-base font-bold text-[#FFC857] border-b border-zinc-800 pb-2">
            3. About Section Content
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-zinc-300 font-semibold mb-1">About Section Heading</label>
              <input
                type="text"
                value={settings.aboutHeading}
                onChange={(e) => setSettings({ ...settings, aboutHeading: e.target.value })}
                className="w-full px-3 py-2 bg-[#121212] border border-zinc-700 rounded-lg text-white font-bold"
              />
            </div>
            <div>
              <label className="block text-zinc-300 font-semibold mb-1">About Body Text</label>
              <textarea
                rows={4}
                value={settings.aboutText}
                onChange={(e) => setSettings({ ...settings, aboutText: e.target.value })}
                className="w-full px-3 py-2 bg-[#121212] border border-zinc-700 rounded-lg text-white leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Location & Contact Info */}
        <div className="space-y-4 pt-2">
          <h3 className="font-heading text-base font-bold text-[#FFC857] border-b border-zinc-800 pb-2">
            4. Location & Contact Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-zinc-300 font-semibold mb-1">Physical Address</label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full px-3 py-2 bg-[#121212] border border-zinc-700 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Contact Phone</label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full px-3 py-2 bg-[#121212] border border-zinc-700 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-zinc-300 font-semibold mb-1">WhatsApp Number</label>
              <input
                type="text"
                value={settings.whatsapp}
                onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                className="w-full px-3 py-2 bg-[#121212] border border-zinc-700 rounded-lg text-white"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 bg-gradient-to-r from-[#FF6B00] to-[#FF8533] hover:from-[#e05e00] hover:to-[#ff6b00] text-white font-heading font-bold text-sm uppercase tracking-wider rounded-xl shadow-lg shadow-[#FF6B00]/30 transition-all flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>Save & Publish Live Changes</span>
        </button>
      </form>
    </div>
  );
}
