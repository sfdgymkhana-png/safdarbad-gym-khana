"use client";

import { useEffect, useState } from "react";
import { GymStore } from "@/lib/store";
import { Membership } from "@/lib/types";
import {
  formatPKR,
  getDaysRemaining,
  getMembershipBadgeClass,
  getPaymentBadgeClass,
  addMonthsSafely,
} from "@/lib/utils";
import {
  ShieldCheck,
  Clock,
  AlertTriangle,
  RefreshCw,
  Search,
  CheckCircle2,
  Calendar,
} from "lucide-react";

export default function AdminMembershipsPage() {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [tab, setTab] = useState<"all" | "expiring" | "expired">("all");
  const [search, setSearch] = useState("");

  const loadData = () => {
    setMemberships(GymStore.getMemberships());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRenew = (m: Membership) => {
    const today = new Date().toISOString().split("T")[0];
    const newStart = m.endDate > today ? m.endDate : today;
    const newEnd = addMonthsSafely(newStart, 1);

    GymStore.updateMembership(m.membershipId, {
      startDate: newStart,
      endDate: newEnd,
      membershipStatus: "Active",
      amountPaid: 0,
      balanceDue: m.finalPrice,
      paymentStatus: "Unpaid",
    });

    GymStore.createNotification(
      m.userId,
      "Membership Renewed",
      `Your membership period has been renewed until ${newEnd}. Please clear the subscription balance at the desk.`,
      "membership"
    );

    loadData();
  };

  const filtered = memberships.filter((m) => {
    const days = getDaysRemaining(m.endDate);
    const matchesSearch =
      m.customerName.toLowerCase().includes(search.toLowerCase()) ||
      m.membershipId.toLowerCase().includes(search.toLowerCase());

    if (tab === "expiring") {
      return matchesSearch && days > 0 && days <= 7;
    }
    if (tab === "expired") {
      return matchesSearch && days <= 0;
    }
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
          Subscriptions & Expiration Lifecycle
        </h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Monitor upcoming expirations, automated reminder eligibility, and process 1-click renewals.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-zinc-800 pb-3">
        <button
          onClick={() => setTab("all")}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
            tab === "all" ? "bg-[#FF6B00] text-white" : "bg-[#161616] text-zinc-400 hover:text-white"
          }`}
        >
          All Memberships ({memberships.length})
        </button>
        <button
          onClick={() => setTab("expiring")}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
            tab === "expiring" ? "bg-amber-600 text-white" : "bg-[#161616] text-amber-400 hover:text-white"
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Expiring Within 7 Days</span>
        </button>
        <button
          onClick={() => setTab("expired")}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
            tab === "expired" ? "bg-red-600 text-white" : "bg-[#161616] text-red-400 hover:text-white"
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Expired Subscriptions</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-[#161616] border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#121212] border-b border-zinc-800 text-zinc-400 uppercase font-heading tracking-wider">
                <th className="py-3 px-4">Membership ID & Member</th>
                <th className="py-3 px-4">Plan Name</th>
                <th className="py-3 px-4">Start Date</th>
                <th className="py-3 px-4">End Date</th>
                <th className="py-3 px-4">Days Remaining</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4 text-right">Quick Renewal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filtered.map((m) => {
                const days = getDaysRemaining(m.endDate);
                return (
                  <tr key={m.membershipId} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-white block text-sm">{m.customerName}</span>
                      <span className="text-[11px] text-zinc-500 font-mono">{m.membershipId}</span>
                    </td>
                    <td className="py-3.5 px-4 text-zinc-300 font-medium">{m.planName}</td>
                    <td className="py-3.5 px-4 text-zinc-400">{m.startDate}</td>
                    <td className="py-3.5 px-4 text-zinc-300 font-semibold">{m.endDate}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`font-bold ${
                          days <= 0 ? "text-red-400" : days <= 7 ? "text-amber-400" : "text-emerald-400"
                        }`}
                      >
                        {days <= 0 ? "Expired" : `${days} days left`}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded font-semibold ${getMembershipBadgeClass(m.membershipStatus)}`}>
                        {m.membershipStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded font-semibold ${getPaymentBadgeClass(m.paymentStatus)}`}>
                        {m.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleRenew(m)}
                        className="px-3 py-1.5 bg-[#FF6B00] hover:bg-[#e05e00] text-white text-xs font-semibold rounded flex items-center gap-1.5 ml-auto transition-colors"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Renew 1 Mo</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
