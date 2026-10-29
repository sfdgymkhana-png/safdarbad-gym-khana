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

  const [resetting, setResetting] = useState(false);

  const loadData = () => {
    setMemberships(GymStore.getMemberships());
  };

  useEffect(() => {
    loadData();
    return GymStore.subscribe(loadData);
  }, []);

  const handleResetMonthlyStatus = () => {
    const confirmed = window.confirm(
      "🔄 Start New Monthly Billing Cycle?\n\nThis will reset payment status to 'Unpaid' for all active members so you can track fee collections for the new month.\n\nDo you want to proceed?"
    );
    if (!confirmed) return;

    setResetting(true);
    setTimeout(() => {
      const res = GymStore.resetMonthlyPaymentStatuses("Administrator");
      setResetting(false);
      alert(`✅ Monthly cycle reset complete!\n\n${res.count} active memberships marked as 'Unpaid' with monthly balance due.`);
      loadData();
    }, 400);
  };

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
            Subscriptions & Expiration Lifecycle
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Monitor upcoming expirations, automated reminder eligibility, and process 1-click renewals.
          </p>
        </div>

        <button
          type="button"
          onClick={handleResetMonthlyStatus}
          disabled={resetting}
          className="px-4 py-2 bg-[#1C1C1C] hover:bg-[#2A2A2A] text-[#FFC857] border border-amber-500/40 hover:border-amber-500 text-xs font-bold uppercase tracking-wider rounded-lg shadow-md flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 shrink-0"
          title="Reset active members' payment status to Unpaid for the new billing month"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${resetting ? "animate-spin" : ""}`} />
          <span>{resetting ? "Resetting..." : "Reset For New Month"}</span>
        </button>
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

      {/* Mobile Memberships Cards (Visible on screens < md) */}
      <div className="block md:hidden space-y-3">
        {filtered.map((m) => {
          const days = getDaysRemaining(m.endDate);
          return (
            <div
              key={m.membershipId}
              className="bg-[#161616] border border-zinc-800 rounded-xl p-4 space-y-3 shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-heading font-bold text-white text-sm">{m.customerName}</h4>
                  <span className="text-[10px] text-zinc-500 font-mono block">ID: {m.membershipId}</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    days <= 0
                      ? "bg-red-500/20 text-red-400 border border-red-500/30"
                      : days <= 7
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  }`}
                >
                  {days <= 0 ? "Expired" : `${days}d left`}
                </span>
              </div>

              <div className="p-2.5 bg-[#111111] rounded-lg border border-zinc-800/80 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-zinc-500 text-[10px] uppercase">Plan:</span>
                  <span className="text-zinc-300 font-medium">{m.planName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500 text-[10px] uppercase">Period:</span>
                  <span className="text-zinc-300">{m.startDate} &rarr; {m.endDate}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-zinc-800">
                  <span className="text-zinc-500 text-[10px] uppercase">Status:</span>
                  <div className="flex gap-1.5">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${getMembershipBadgeClass(m.membershipStatus)}`}>
                      {m.membershipStatus}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${getPaymentBadgeClass(m.paymentStatus)}`}>
                      {m.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleRenew(m)}
                className="w-full py-2 bg-[#FF6B00] hover:bg-[#e05e00] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-md flex items-center justify-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Renew Membership (+1 Month)</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Desktop Table (Visible on md and up) */}
      <div className="hidden md:block bg-[#161616] border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
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
