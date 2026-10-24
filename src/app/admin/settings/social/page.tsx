"use client";

import { useEffect, useState } from "react";
import { GymStore } from "@/lib/store";
import { SiteSettings } from "@/lib/types";
import { Share2, Save, CheckCircle2, MessageSquare, ExternalLink } from "lucide-react";

export default function AdminSocialSettingsPage() {
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
    <div className="space-y-6 max-w-3xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
            Social Media & WhatsApp Settings
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Configure social media profile links. Social icons remain hidden on the website until you supply verified URLs.
          </p>
        </div>

        {saved && (
          <div className="px-3.5 py-1.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-semibold rounded-lg flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>Links updated!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="bg-[#161616] border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-5 shadow-xl text-xs">
        <div>
          <label className="block text-zinc-300 font-semibold mb-1">
            WhatsApp Contact Number (Active)
          </label>
          <input
            type="text"
            required
            value={settings.whatsapp}
            onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
            placeholder="+92 305 9422464"
            className="w-full px-3 py-2 bg-[#121212] border border-zinc-700 rounded-lg text-white"
          />
          <p className="text-[11px] text-zinc-500 mt-1">
            Destination: https://wa.me/{settings.whatsapp.replace(/\D/g, "")}
          </p>
        </div>

        <div>
          <label className="block text-zinc-300 font-semibold mb-1">
            Instagram Profile URL (Optional)
          </label>
          <input
            type="url"
            value={settings.instagramUrl}
            onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })}
            placeholder="https://instagram.com/safdarbadgymkhana"
            className="w-full px-3 py-2 bg-[#121212] border border-zinc-700 rounded-lg text-white"
          />
          <p className="text-[11px] text-zinc-500 mt-1">
            Leave blank if you do not have an official account yet. Public button will stay hidden.
          </p>
        </div>

        <div>
          <label className="block text-zinc-300 font-semibold mb-1">
            TikTok Profile URL (Optional)
          </label>
          <input
            type="url"
            value={settings.tiktokUrl}
            onChange={(e) => setSettings({ ...settings, tiktokUrl: e.target.value })}
            placeholder="https://tiktok.com/@safdarbadgymkhana"
            className="w-full px-3 py-2 bg-[#121212] border border-zinc-700 rounded-lg text-white"
          />
          <p className="text-[11px] text-zinc-500 mt-1">
            Leave blank if you do not have an official account yet.
          </p>
        </div>

        <div>
          <label className="block text-zinc-300 font-semibold mb-1">
            Facebook Page URL (Optional)
          </label>
          <input
            type="url"
            value={settings.facebookUrl || ""}
            onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value })}
            placeholder="https://facebook.com/safdarbadgymkhana"
            className="w-full px-3 py-2 bg-[#121212] border border-zinc-700 rounded-lg text-white"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-[#FF6B00] hover:bg-[#e05e00] text-white font-heading font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Social Media Links</span>
        </button>
      </form>
    </div>
  );
}
