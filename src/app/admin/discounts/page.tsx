"use client";

import { useEffect, useState } from "react";
import { GymStore } from "@/lib/store";
import { DiscountCoupon } from "@/lib/types";
import { formatPKR } from "@/lib/utils";
import { Percent, Plus, Tag, Check, X, Trash2, Edit } from "lucide-react";

export default function AdminDiscountsPage() {
  const [discounts, setDiscounts] = useState<DiscountCoupon[]>([]);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"percentage" | "fixed">("percentage");
  const [value, setValue] = useState(20);
  const [couponCode, setCouponCode] = useState("");
  const [startDate, setStartDate] = useState("2026-01-01");
  const [endDate, setEndDate] = useState("2026-12-31");
  const [usageLimit, setUsageLimit] = useState(100);

  const loadData = () => {
    setDiscounts(GymStore.getDiscounts());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggle = (id: string) => {
    GymStore.toggleDiscount(id);
    loadData();
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    GymStore.saveDiscount({
      discountId: `DISC-${Date.now().toString().slice(-5)}`,
      name: name.trim(),
      description: description.trim(),
      discountType: type,
      discountValue: Number(value),
      couponCode: couponCode.trim().toUpperCase() || undefined,
      startDate,
      endDate,
      usageLimit: Number(usageLimit),
      usedCount: 0,
      isActive: true,
      createdAt: new Date().toISOString(),
    });

    setShowModal(false);
    setName("");
    setDescription("");
    setCouponCode("");
    loadData();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
            Discounts & Promotional Coupons
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Configure percentage or fixed PKR discounts, coupon redemption codes, and validity windows.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-[#FF6B00] hover:bg-[#e05e00] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-md flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Discount</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {discounts.map((d) => (
          <div
            key={d.discountId}
            className="bg-[#161616] border border-zinc-800 rounded-xl p-5 space-y-4 shadow-lg flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-zinc-500">{d.discountId}</span>
                <span
                  className={`px-2 py-0.5 text-[11px] font-bold rounded ${
                    d.isActive ? "bg-emerald-500/20 text-emerald-400" : "bg-zinc-800 text-zinc-500"
                  }`}
                >
                  {d.isActive ? "Active" : "Disabled"}
                </span>
              </div>

              <h3 className="font-heading text-lg font-bold text-white">{d.name}</h3>
              <p className="text-xs text-zinc-400">{d.description}</p>

              <div className="p-3 bg-[#111111] rounded-lg border border-zinc-800 flex items-center justify-between text-xs">
                <span className="text-zinc-400">Discount Benefit:</span>
                <span className="font-heading font-extrabold text-base text-[#FF6B00]">
                  {d.discountType === "percentage" ? `${d.discountValue}% OFF` : `PKR ${d.discountValue} OFF`}
                </span>
              </div>

              {d.couponCode && (
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-zinc-500">Coupon Code:</span>
                  <span className="px-2 py-0.5 bg-zinc-800 text-amber-400 font-mono font-bold rounded">
                    {d.couponCode}
                  </span>
                </div>
              )}

              <div className="text-[11px] text-zinc-500 flex justify-between pt-1">
                <span>Valid: {d.startDate} &rarr; {d.endDate}</span>
                <span>Used: {d.usedCount} times</span>
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
              <button
                onClick={() => handleToggle(d.discountId)}
                className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                  d.isActive
                    ? "bg-red-950/40 text-red-400 hover:bg-red-900"
                    : "bg-emerald-950/40 text-emerald-400 hover:bg-emerald-900"
                }`}
              >
                {d.isActive ? "Disable Discount" : "Enable Discount"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#181818] border border-zinc-700 max-w-md w-full rounded-2xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-heading text-lg font-bold text-white">Create Discount Coupon</h3>
              <button onClick={() => setShowModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Discount Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. New Student Discount"
                  className="w-full px-3 py-2 bg-[#121212] border border-zinc-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. 15% off first month admission"
                  className="w-full px-3 py-2 bg-[#121212] border border-zinc-700 rounded-lg text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as "percentage" | "fixed")}
                    className="w-full px-3 py-2 bg-[#121212] border border-zinc-700 rounded-lg text-white"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (PKR)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">
                    Value ({type === "percentage" ? "%" : "PKR"}) *
                  </label>
                  <input
                    type="number"
                    required
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#121212] border border-zinc-700 rounded-lg text-white font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Coupon Code (Optional)</label>
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="e.g. FIT15"
                  className="w-full px-3 py-2 bg-[#121212] border border-zinc-700 rounded-lg text-white uppercase"
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
                Save Discount Coupon
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
