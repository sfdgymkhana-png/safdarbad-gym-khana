"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GymStore } from "@/lib/store";
import {
  AdmissionApplication,
  Membership,
  PaymentTransaction,
  SiteSettings,
} from "@/lib/types";
import {
  formatPKR,
  getDaysRemaining,
  getApplicationBadgeClass,
  getPaymentBadgeClass,
  getMembershipBadgeClass,
} from "@/lib/utils";
import {
  Users,
  UserCheck,
  CreditCard,
  AlertTriangle,
  Clock,
  TrendingUp,
  ArrowUpRight,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [applications, setApplications] = useState<AdmissionApplication[]>([]);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [payments, setPayments] = useState<PaymentTransaction[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(GymStore.getSettings());

  useEffect(() => {
    setApplications(GymStore.getApplications());
    setMemberships(GymStore.getMemberships());
    setPayments(GymStore.getPayments());
    setSettings(GymStore.getSettings());
  }, []);

  // Calculated live metrics
  const totalMembers = memberships.length;
  const activeMembers = memberships.filter((m) => m.membershipStatus === "Active").length;
  const pendingApps = applications.filter((a) => a.applicationStatus === "Pending Review").length;
  const expiringSoon = memberships.filter((m) => {
    const days = getDaysRemaining(m.endDate);
    return days > 0 && days <= 7;
  }).length;
  const expiredMembers = memberships.filter((m) => {
    const days = getDaysRemaining(m.endDate);
    return days <= 0;
  }).length;

  const totalCollectedRevenue = payments.reduce((sum, p) => sum + p.amountReceived, 0);
  const totalOutstandingBalance = memberships.reduce((sum, m) => sum + m.balanceDue, 0);
  const activeOffersCount = GymStore.getOffers().filter((o) => o.isPublished).length;

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#FF6B00] uppercase tracking-widest block">
            Executive Summary
          </span>
          <h1 className="font-heading text-3xl font-extrabold text-white tracking-wide">
            Operations & Financial Overview
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Live overview of membership admissions, revenue, and gym facility operations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/admissions"
            className="px-4 py-2 bg-[#FF6B00] hover:bg-[#e05e00] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-md transition-colors flex items-center gap-1.5"
          >
            <UserCheck className="w-4 h-4" />
            <span>Review Admissions ({pendingApps})</span>
          </Link>
          <Link
            href="/admin/payments"
            className="px-4 py-2 bg-[#222222] hover:bg-zinc-800 text-zinc-200 border border-zinc-700 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5"
          >
            <CreditCard className="w-4 h-4 text-emerald-400" />
            <span>Record Payment</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1 */}
        <div className="bg-[#161616] border border-zinc-800 rounded-xl p-5 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Members</span>
            <Users className="w-4 h-4 text-[#FF6B00]" />
          </div>
          <div className="font-heading text-3xl font-extrabold text-white">{totalMembers}</div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{activeMembers} currently active</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#161616] border border-zinc-800 rounded-xl p-5 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Admissions</span>
            <UserCheck className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-heading text-3xl font-extrabold text-white">{pendingApps}</div>
          <div className="text-[11px] text-zinc-400">
            Awaiting desk review & payment
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-[#161616] border border-zinc-800 rounded-xl p-5 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Collected Revenue</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-heading text-3xl font-extrabold text-emerald-400">
            {formatPKR(totalCollectedRevenue)}
          </div>
          <div className="text-[11px] text-zinc-400">
            Total actual offline & cash receipts
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-[#161616] border border-zinc-800 rounded-xl p-5 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Outstanding Balance</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="font-heading text-3xl font-extrabold text-amber-400">
            {formatPKR(totalOutstandingBalance)}
          </div>
          <div className="text-[11px] text-zinc-400">
            Unpaid or partial member balances
          </div>
        </div>
      </div>

      {/* Secondary Status Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-4 bg-[#141414] border border-zinc-800 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-xs text-zinc-400 block">Expiring Within 7 Days</span>
            <span className="font-heading text-xl font-bold text-amber-400">{expiringSoon}</span>
          </div>
          <Clock className="w-6 h-6 text-amber-400/50" />
        </div>

        <div className="p-4 bg-[#141414] border border-zinc-800 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-xs text-zinc-400 block">Expired Subscriptions</span>
            <span className="font-heading text-xl font-bold text-red-400">{expiredMembers}</span>
          </div>
          <ShieldAlert className="w-6 h-6 text-red-400/50" />
        </div>

        <div className="p-4 bg-[#141414] border border-zinc-800 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-xs text-zinc-400 block">Active Special Offers</span>
            <span className="font-heading text-xl font-bold text-[#FFC857]">{activeOffersCount}</span>
          </div>
          <Sparkles className="w-6 h-6 text-[#FFC857]/50" />
        </div>
      </div>

      {/* Tables Row: Recent Admissions & Recent Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Admissions */}
        <div className="bg-[#161616] border border-zinc-800 rounded-xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-[#FF6B00]" />
              <span>Recent Admission Applications</span>
            </h3>
            <Link
              href="/admin/admissions"
              className="text-xs text-[#FFC857] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {applications.length > 0 ? (
            <div className="space-y-3">
              {applications.slice(0, 4).map((app) => (
                <div
                  key={app.applicationId}
                  className="p-3.5 bg-[#121212] border border-zinc-800/80 rounded-lg flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-semibold text-white block text-sm">{app.fullName}</span>
                    <span className="text-zinc-500">{app.applicationId} • {app.phone}</span>
                  </div>
                  <div className="text-right space-y-1">
                    <span className={`inline-block px-2 py-0.5 rounded font-semibold ${getApplicationBadgeClass(app.applicationStatus)}`}>
                      {app.applicationStatus}
                    </span>
                    <span className="block text-zinc-400 font-mono">{formatPKR(app.finalPrice)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-zinc-500 py-6 text-center">No admission applications submitted yet.</p>
          )}
        </div>

        {/* Recent Payments */}
        <div className="bg-[#161616] border border-zinc-800 rounded-xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <span>Recent Payment Transactions</span>
            </h3>
            <Link
              href="/admin/payments"
              className="text-xs text-[#FFC857] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {payments.length > 0 ? (
            <div className="space-y-3">
              {payments.slice(0, 4).map((p) => (
                <div
                  key={p.paymentId}
                  className="p-3.5 bg-[#121212] border border-zinc-800/80 rounded-lg flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-semibold text-white block text-sm">{p.customerName}</span>
                    <span className="text-zinc-500">{p.receiptNumber} • {p.paymentMethod}</span>
                  </div>
                  <div className="text-right space-y-1">
                    <span className="font-bold text-emerald-400 text-sm block">
                      +{formatPKR(p.amountReceived)}
                    </span>
                    <span className="text-zinc-500">{p.paymentDate}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-zinc-500 py-6 text-center">No payment transactions recorded yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
