"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { GymStore } from "@/lib/store";
import { SiteSettings } from "@/lib/types";
import { readMediaFile } from "@/lib/imageUtils";
import { FileText, Save, CheckCircle2, Upload, Video, Image as ImageIcon, RotateCcw, Sparkles } from "lucide-react";

export default function AdminContentPage() {
  const [settings, setSettings] = useState<SiteSettings>(GymStore.getSettings());
  const [saved, setSaved] = useState(false);
  const [uploadingTarget, setUploadingTarget] = useState<string | null>(null);

  const heroFileInputRef = useRef<HTMLInputElement>(null);
  const aboutFileInputRef = useRef<HTMLInputElement>(null);
  const logoFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSettings(GymStore.getSettings());
  }, []);

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: "hero" | "about" | "logo") => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingTarget(target);
    try {
      const res = await readMediaFile(file);
      if (target === "hero") {
        setSettings((prev) => ({
          ...prev,
          heroMediaUrl: res.url,
          heroMediaType: res.mediaType,
        }));
      } else if (target === "about") {
        setSettings((prev) => ({
          ...prev,
          aboutMediaUrl: res.url,
          aboutMediaType: res.mediaType,
        }));
      } else if (target === "logo") {
        setSettings((prev) => ({
          ...prev,
          logoUrl: res.url,
        }));
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to process media file.");
    } finally {
      setUploadingTarget(null);
    }
  };

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
            Website Content & Media Editor
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Modify live pricing, hero media (image or video), about media (image or video), logo, and text copy.
          </p>
        </div>

        {saved && (
          <div className="px-3.5 py-1.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-semibold rounded-lg flex items-center gap-1.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Changes published live!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="bg-[#161616] border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-8 shadow-xl text-xs">
        {/* Section 1: Core Pricing & Name */}
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
              <label className="block text-zinc-300 font-semibold mb-1">Brand Tagline</label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full px-3 py-2 bg-[#121212] border border-zinc-700 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1">
                New Member Admission Fee (PKR) <span className="text-[#FF6B00]">*</span>
              </label>
              <input
                type="number"
                required
                value={settings.standardAdmissionFee ?? 3000}
                onChange={(e) =>
                  setSettings({ ...settings, standardAdmissionFee: Number(e.target.value) })
                }
                className="w-full px-3 py-2 bg-[#121212] border border-zinc-700 rounded-lg text-white font-bold text-sm text-[#FFC857]"
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

            <div className="sm:col-span-2">
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

        {/* Section 2: Website Media & Visuals (Hero, About & Logo) */}
        <div className="space-y-4 pt-2">
          <h3 className="font-heading text-base font-bold text-[#FFC857] border-b border-zinc-800 pb-2 flex items-center justify-between">
            <span>2. Website Media & Visual Assets (Image or Video)</span>
            <span className="text-xs text-zinc-400 font-normal">All media can be replaced</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Hero Background Media Card */}
            <div className="p-4 bg-[#121212] border border-zinc-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white block">Hero Banner Media</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#FF6B00]/20 text-[#FF6B00] border border-[#FF6B00]/30">
                  {settings.heroMediaType === "video" ? "Video" : "Image"}
                </span>
              </div>

              {/* Preview Window */}
              <div className="relative h-44 w-full rounded-lg overflow-hidden border border-zinc-700 bg-black flex items-center justify-center">
                {settings.heroMediaType === "video" ? (
                  <video
                    src={settings.heroMediaUrl}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image
                    src={settings.heroMediaUrl || "/images/gym-interior-1.jpg"}
                    alt="Hero Preview"
                    fill
                    className="object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                  <span className="text-[10px] text-zinc-300">
                    {settings.heroMediaType === "video" ? "Ambient Background Video Active" : "Background Image Active"}
                  </span>
                </div>
              </div>

              <input
                type="file"
                ref={heroFileInputRef}
                accept="image/*,video/*"
                onChange={(e) => handleMediaUpload(e, "hero")}
                className="hidden"
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => heroFileInputRef.current?.click()}
                  disabled={uploadingTarget === "hero"}
                  className="flex-1 py-2 bg-[#FF6B00] hover:bg-[#e05e00] text-white font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploadingTarget === "hero" ? "Processing..." : "Upload Hero Image / Video"}</span>
                </button>

                {settings.heroMediaUrl && (
                  <button
                    type="button"
                    onClick={() =>
                      setSettings((prev) => ({
                        ...prev,
                        heroMediaUrl: undefined,
                        heroMediaType: "image",
                      }))
                    }
                    className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg border border-zinc-700 flex items-center gap-1"
                    title="Reset to default image"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                )}
              </div>
            </div>

            {/* About Section Media Card */}
            <div className="p-4 bg-[#121212] border border-zinc-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white block">About Section Media</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  {settings.aboutMediaType === "video" ? "Video" : "Image"}
                </span>
              </div>

              {/* Preview Window */}
              <div className="relative h-44 w-full rounded-lg overflow-hidden border border-zinc-700 bg-black flex items-center justify-center">
                {settings.aboutMediaType === "video" ? (
                  <video
                    src={settings.aboutMediaUrl}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image
                    src={settings.aboutMediaUrl || "/images/gym-workout.jpg"}
                    alt="About Preview"
                    fill
                    className="object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                  <span className="text-[10px] text-zinc-300">
                    {settings.aboutMediaType === "video" ? "Workout Video Active" : "Workout Photo Active"}
                  </span>
                </div>
              </div>

              <input
                type="file"
                ref={aboutFileInputRef}
                accept="image/*,video/*"
                onChange={(e) => handleMediaUpload(e, "about")}
                className="hidden"
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => aboutFileInputRef.current?.click()}
                  disabled={uploadingTarget === "about"}
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploadingTarget === "about" ? "Processing..." : "Upload About Image / Video"}</span>
                </button>

                {settings.aboutMediaUrl && (
                  <button
                    type="button"
                    onClick={() =>
                      setSettings((prev) => ({
                        ...prev,
                        aboutMediaUrl: undefined,
                        aboutMediaType: "image",
                      }))
                    }
                    className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg border border-zinc-700 flex items-center gap-1"
                    title="Reset to default image"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                )}
              </div>
            </div>

            {/* Gym Logo Card */}
            <div className="sm:col-span-2 p-4 bg-[#121212] border border-zinc-800 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#FF6B00] shrink-0 bg-black">
                  <Image
                    src={settings.logoUrl || "/images/logo.png"}
                    alt="Gym Emblem Logo"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-white text-sm">Official Gym Logo</h4>
                  <p className="text-zinc-400 text-xs">
                    Displayed in the website header navbar, footer, and member documents.
                  </p>
                </div>
              </div>

              <input
                type="file"
                ref={logoFileInputRef}
                accept="image/*"
                onChange={(e) => handleMediaUpload(e, "logo")}
                className="hidden"
              />

              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => logoFileInputRef.current?.click()}
                  disabled={uploadingTarget === "logo"}
                  className="flex-1 sm:flex-initial px-4 py-2 bg-[#FF6B00] hover:bg-[#e05e00] text-white font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploadingTarget === "logo" ? "Uploading..." : "Upload New Logo"}</span>
                </button>

                {settings.logoUrl && (
                  <button
                    type="button"
                    onClick={() => setSettings((prev) => ({ ...prev, logoUrl: undefined }))}
                    className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg border border-zinc-700"
                    title="Reset to original emblem"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Hero Headline & Text */}
        <div className="space-y-4 pt-2">
          <h3 className="font-heading text-base font-bold text-[#FFC857] border-b border-zinc-800 pb-2">
            3. Hero Banner Headline & Supporting Text
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

        {/* Section 4: About Section Content */}
        <div className="space-y-4 pt-2">
          <h3 className="font-heading text-base font-bold text-[#FFC857] border-b border-zinc-800 pb-2">
            4. About Section Content
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

        {/* Section 5: Location & Contact Info */}
        <div className="space-y-4 pt-2">
          <h3 className="font-heading text-base font-bold text-[#FFC857] border-b border-zinc-800 pb-2">
            5. Location & Contact Details
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

        {/* Section 6: Top Announcement Bar */}
        <div className="space-y-4 pt-2">
          <h3 className="font-heading text-base font-bold text-[#FFC857] border-b border-zinc-800 pb-2 flex items-center justify-between">
            <span>6. Top Announcement Banner</span>
            <span className="text-xs text-zinc-400 font-normal">Displays at the very top of public pages</span>
          </h3>
          <div className="space-y-3 p-4 bg-[#121212] border border-zinc-800 rounded-xl">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="announcementEnabled"
                checked={settings.announcementEnabled ?? true}
                onChange={(e) =>
                  setSettings({ ...settings, announcementEnabled: e.target.checked })
                }
                className="w-4 h-4 accent-[#FF6B00] rounded"
              />
              <label htmlFor="announcementEnabled" className="text-white font-semibold cursor-pointer">
                Enable Top Announcement Bar
              </label>
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Announcement Message</label>
              <input
                type="text"
                value={settings.announcementText ?? "🎉 Grand Opening on 30 October 2026! Early admissions are now open — Register online today!"}
                onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
                className="w-full px-3 py-2 bg-[#181818] border border-zinc-700 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Target Link (Optional)</label>
              <input
                type="text"
                value={settings.announcementLink || "/admission"}
                onChange={(e) => setSettings({ ...settings, announcementLink: e.target.value })}
                className="w-full px-3 py-2 bg-[#181818] border border-zinc-700 rounded-lg text-white font-mono text-xs"
              />
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
          <span className="text-zinc-500 text-xs">
            Any uploaded images or videos will update immediately on the public website.
          </span>
          <button
            type="submit"
            className="px-6 py-3 bg-[#FF6B00] hover:bg-[#e05e00] text-white font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-[#FF6B00]/30 transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save & Publish Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
}
