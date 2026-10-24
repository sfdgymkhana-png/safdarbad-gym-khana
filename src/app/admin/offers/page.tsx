"use client";

import { useEffect, useState } from "react";
import { GymStore } from "@/lib/store";
import { SpecialOffer } from "@/lib/types";
import { Sparkles, Plus, Check, X, Eye, EyeOff } from "lucide-react";

export default function AdminOffersPage() {
  const [offers, setOffers] = useState<SpecialOffer[]>([]);
  const [showModal, setShowModal] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [badge, setBadge] = useState("Seasonal Offer");
  const [startDate, setStartDate] = useState("2026-01-01");
  const [endDate, setEndDate] = useState("2026-12-31");

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

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    GymStore.saveOffer({
      offerId: `OFFER-${Date.now().toString().slice(-4)}`,
      title: title.trim(),
      description: description.trim(),
      badge: badge.trim() || undefined,
      imageUrl: "/images/gym-workout.jpg",
      startDate,
      endDate,
      isPublished: true,
      isFeatured: true,
      createdAt: new Date().toISOString(),
    });

    setShowModal(false);
    setTitle("");
    setDescription("");
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
            Manage promotional campaigns, banners, and published offers for the public website.
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
            className="bg-[#161616] border border-zinc-800 rounded-xl p-6 space-y-4 shadow-xl flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 text-xs font-bold rounded bg-[#FF6B00]/20 text-[#FF6B00] border border-[#FF6B00]/30">
                  {offer.badge || "Special Offer"}
                </span>
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

              <div className="text-[11px] text-zinc-500 pt-2 border-t border-zinc-800">
                Validity: {offer.startDate} &rarr; {offer.endDate}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end">
              <button
                onClick={() => handleTogglePublish(offer)}
                className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  offer.isPublished
                    ? "bg-zinc-800 text-zinc-300 hover:text-white"
                    : "bg-emerald-600 text-white hover:bg-emerald-500"
                }`}
              >
                {offer.isPublished ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{offer.isPublished ? "Unpublish Offer" : "Publish to Website"}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#181818] border border-zinc-700 max-w-md w-full rounded-2xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-heading text-lg font-bold text-white">Create New Offer</h3>
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
                className="w-full py-3 bg-[#FF6B00] hover:bg-[#e05e00] text-white font-bold uppercase rounded-lg transition-colors"
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
