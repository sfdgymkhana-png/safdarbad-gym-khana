"use client";

import { useEffect, useState } from "react";
import { GymStore } from "@/lib/store";
import { PaymentTransaction, Membership, AdmissionApplication } from "@/lib/types";
import { formatPKR } from "@/lib/utils";
import { BarChart3, Download, TrendingUp, AlertTriangle, Users, Calendar } from "lucide-react";

export default function AdminReportsPage() {
  const [payments, setPayments] = useState<PaymentTransaction[]>([]);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [applications, setApplications] = useState<AdmissionApplication[]>([]);

  useEffect(() => {
    setPayments(GymStore.getPayments());
    setMemberships(GymStore.getMemberships());
    setApplications(GymStore.getApplications());
  }, []);

  const totalCollectedRevenue = payments.reduce((sum, p) => sum + p.amountReceived, 0);
  const totalBilledFees = memberships.reduce((sum, m) => sum + m.finalPrice, 0);
  const totalOutstanding = memberships.reduce((sum, m) => sum + m.balanceDue, 0);
  const totalDiscountsGiven = applications.reduce((sum, a) => sum + (a.discountApplied || 0), 0);

  const exportPaymentsCSV = () => {
    const headers = "Payment ID,Receipt Number,Member Name,Date,Method,Amount Received,Recorded By\n";
    const rows = payments
      .map(
        (p) =>
          `"${p.paymentId}","${p.receiptNumber}","${p.customerName}","${p.paymentDate}","${p.paymentMethod}","${p.amountReceived}","${p.recordedBy}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `safdarbad-gym-financial-report-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
            Financial & Membership Reports
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Strict accounting distinguishing actual cash collected from billed balances, plus CSV exports.
          </p>
        </div>

        <button
          onClick={exportPaymentsCSV}
          className="px-4 py-2 bg-[#FF6B00] hover:bg-[#e05e00] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-md flex items-center gap-1.5 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Export Financial CSV</span>
        </button>
      </div>

      {/* Distinction KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-[#161616] border border-zinc-800 rounded-xl p-5 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Payments Collected</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-heading text-3xl font-extrabold text-emerald-400">
            {formatPKR(totalCollectedRevenue)}
          </div>
          <p className="text-[11px] text-zinc-500">Actual money in cash/bank</p>
        </div>

        <div className="bg-[#161616] border border-zinc-800 rounded-xl p-5 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Billed Fees</span>
            <Calendar className="w-4 h-4 text-white" />
          </div>
          <div className="font-heading text-3xl font-extrabold text-white">
            {formatPKR(totalBilledFees)}
          </div>
          <p className="text-[11px] text-zinc-500">Gross subscription commitments</p>
        </div>

        <div className="bg-[#161616] border border-zinc-800 rounded-xl p-5 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Outstanding Balance</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="font-heading text-3xl font-extrabold text-amber-400">
            {formatPKR(totalOutstanding)}
          </div>
          <p className="text-[11px] text-zinc-500">Pending receivables</p>
        </div>

        <div className="bg-[#161616] border border-zinc-800 rounded-xl p-5 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Discounts Awarded</span>
            <Users className="w-4 h-4 text-[#FFC857]" />
          </div>
          <div className="font-heading text-3xl font-extrabold text-[#FFC857]">
            {formatPKR(totalDiscountsGiven)}
          </div>
          <p className="text-[11px] text-zinc-500">Coupons & promotion savings</p>
        </div>
      </div>

      {/* Summary Table */}
      <div className="bg-[#161616] border border-zinc-800 rounded-xl p-6 space-y-4 shadow-xl">
        <h3 className="font-heading text-lg font-bold text-white border-b border-zinc-800 pb-3">
          Cash & Bank Collection Breakdown
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 uppercase">
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Receipt Number</th>
                <th className="py-2.5 px-3">Member</th>
                <th className="py-2.5 px-3">Method</th>
                <th className="py-2.5 px-3">Amount Received</th>
                <th className="py-2.5 px-3">Verified By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {payments.map((p) => (
                <tr key={p.paymentId}>
                  <td className="py-3 px-3 text-zinc-400">{p.paymentDate}</td>
                  <td className="py-3 px-3 font-semibold text-white">{p.receiptNumber}</td>
                  <td className="py-3 px-3 text-zinc-200">{p.customerName}</td>
                  <td className="py-3 px-3 text-amber-400 font-medium">{p.paymentMethod}</td>
                  <td className="py-3 px-3 font-bold text-emerald-400">{formatPKR(p.amountReceived)}</td>
                  <td className="py-3 px-3 text-zinc-400">{p.recordedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
