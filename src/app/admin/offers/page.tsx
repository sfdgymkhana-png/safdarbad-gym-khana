"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { GymStore } from "@/lib/store";
import { SpecialOffer } from "@/lib/types";
import { compressAndReadFile } from "@/lib/imageUtils";
import { Sparkles, Plus, Check, X, Eye, EyeOff, Upload } from "lucide-react";

export default function AdminOffersPage() {
  const [offers, setOffers] = useState<SpecialOffer[]>([]);
  const [showModal, setShowModal] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [badge, setBadge] = useState("Seasonal Offer");
  const [imageUrl, setImageUrl] = useState("/images/gym-workout.jpg");
  const [startDate, setStartDate] = useState("2026-01-01");
  const [endDate, setEndDate] = useState("2026-12-31");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadData = () => {
    setOffers(GymStore.getOffers());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTogglePublish = (offer: SpecialOffer) => {
    GymStore.saveOffer({
      ...offer,
      isPublished: !offer.isPublished,
    });
    loadData();
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const dataUrl = await compressAndReadFile(file, 1200, 1200, 0.85);
      setImageUrl(dataUrl);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to read image file.");
    } finally {
      setUploading(false);
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    GymStore.saveOffer({
      offerId: `OFFER-${Date.now().toString().slice(-4)}`,
      title: title.trim(),
      description: description.trim(),
      badge: badge.trim() || undefined,
      imageUrl,
      startDate,
      endDate,
      isPublished: true,
      isFeatured: true,
      createdAt: new Date().toISOString(),
    });

    setShowModal(false);
    setTitle("");
    setDescription("");
    setImageUrl("/images/gym-workout.jpg");
    loadData();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
            Special Marketing Offers
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Manage promotional campaigns, banners, and published offers with custom uploaded images.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-[#FF6B00] hover:bg-[#e05e00] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-md flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create Special Offer</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {offers.map((offer) => (
          <div
            key={offer.offerId}
            className="bg-[#161616] border border-zinc-800 rounded-xl overflow-hidden shadow-xl flex flex-col justify-between"
          >
            {offer.imageUrl && (
              <div className="relative h-40 w-full">
                <Image src={offer.imageUrl} alt={offer.title} fill className="object-cover" />
                <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 text-xs font-bold rounded bg-[#FF6B00] text-white">
                  {offer.badge || "Special Offer"}
                </span>
              </div>
            )}

            <div className="p-6 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-zinc-500 font-mono">ID: {offer.offerId}</span>
                <span
                  className={`text-xs font-semibold ${
                    offer.isPublished ? "text-emerald-400" : "text-zinc-500"
                  }`}
                >
                  {offer.isPublished ? "Published Live" : "Unpublished"}
                </span>
              </div>

              <h3 className="font-heading text-xl font-bold text-white">{offer.title}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">{offer.description}</p>
            </div>

            <div className="p-6 pt-0 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
              <span>Valid: {offer.startDate} to {offer.endDate}</span>
              <button
                onClick={() => handleTogglePublish(offer)}
                className={`px-3 py-1.5 rounded font-semibold transition-colors ${
                  offer.isPublished
                    ? "bg-zinc-800 text-zinc-300 hover:text-white"
                    : "bg-[#FF6B00] text-white hover:bg-[#e05e00]"
                }`}
              >
                {offer.isPublished ? "Unpublish" : "Publish"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#181818] border border-zinc-700 max-w-md w-full rounded-2xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-heading text-lg font-bold text-white">Create Special Offer</h3>
              <button onClick={() => setShowModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Offer Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Winter Strength Kickoff"
                  className="w-full px-3 py-2 bg-[#121212] border border-zinc-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Badge / Tag</label>
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="e.g. Limited Time"
                  className="w-full px-3 py-2 bg-[#121212] border border-zinc-700 rounded-lg text-white"
                />
              </div>

              {/* Offer Banner Image Upload */}
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Banner Image</label>
                <div className="relative h-32 w-full rounded-xl overflow-hidden border-2 border-dashed border-[#FF6B00]/70 bg-zinc-900 flex items-center justify-center mb-2">
                  <Image src={imageUrl} alt="Banner Preview" fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="px-3.5 py-1.5 bg-[#FF6B00] hover:bg-[#e05e00] text-white font-bold rounded-lg shadow flex items-center gap-1.5 transition-transform"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploading ? "Uploading..." : "Upload Banner Image"}</span>
                    </button>
                  </div>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Details of the promotion..."
                  className="w-full px-3 py-2 bg-[#121212] border border-zinc-700 rounded-lg text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-[#121212] border border-zinc-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 bg-[#121212] border border-zinc-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#FF6B00] hover:bg-[#e05e00] text-white font-bold uppercase rounded-lg transition-colors shadow-lg"
              >
                Publish Special Offer
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
