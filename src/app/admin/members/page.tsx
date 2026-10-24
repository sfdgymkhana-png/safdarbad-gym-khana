"use client";

import { useEffect, useState } from "react";
import { GymStore } from "@/lib/store";
import { Membership, PaymentTransaction } from "@/lib/types";
import {
  formatPKR,
  getDaysRemaining,
  getMembershipBadgeClass,
  getPaymentBadgeClass,
  addMonthsSafely,
} from "@/lib/utils";
import {
  Users,
  Search,
  Filter,
  Plus,
  Download,
  CreditCard,
  RefreshCw,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";

export default function AdminMembersPage() {
  const [members, setMembers] = useState<Membership[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All");

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPayModal, setShowPayModal] = useState<Membership | null>(null);
  const [showRenewModal, setShowRenewModal] = useState<Membership | null>(null);

  // New Member Form
  const [newFullName, setNewFullName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newStartDate, setNewStartDate] = useState("2026-10-25");
  const [newFee, setNewFee] = useState(2500);

  // Payment Form for Member
  const [payAmount, setPayAmount] = useState(2500);
  const [payMethod, setPayMethod] = useState<PaymentTransaction["paymentMethod"]>("Cash");
  const [payNote, setPayNote] = useState("");

  const loadData = () => {
    setMembers(GymStore.getMemberships());
  };

  useEffect(() => {
    loadData();
    setNewStartDate(new Date().toISOString().split("T")[0]);
  }, []);

  // Filtered members
  const filtered = members.filter((m) => {
    const matchesSearch =
      m.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.customerPhone.includes(searchQuery) ||
      m.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.membershipId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "All" || m.membershipStatus === statusFilter;
    const matchesPayment = paymentFilter === "All" || m.paymentStatus === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName.trim() || !newPhone.trim()) return;

    const endDate = addMonthsSafely(newStartDate, 1);
    GymStore.createMembership({
      userId: `USR-${Date.now().toString().slice(-5)}`,
      customerName: newFullName.trim(),
      customerEmail: newEmail.trim() || `${newPhone.trim()}@safdarbadgym.pk`,
      customerPhone: newPhone.trim(),
      planId: "PLAN-MONTHLY",
      planName: "Standard Monthly Membership",
      startDate: newStartDate,
      endDate,
      originalPrice: newFee,
      discountAmount: 0,
      finalPrice: newFee,
      amountPaid: 0,
      balanceDue: newFee,
      membershipStatus: "Active",
      paymentStatus: "Unpaid",
    });

    setShowAddModal(false);
    setNewFullName("");
    setNewEmail("");
    setNewPhone("");
    loadData();
  };

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showPayModal) return;

    GymStore.recordPayment({
      userId: showPayModal.userId,
      customerName: showPayModal.customerName,
      membershipId: showPayModal.membershipId,
      paymentDate: new Date().toISOString().split("T")[0],
      paymentMethod: payMethod,
      originalAmount: showPayModal.finalPrice,
      discountAmount: 0,
      finalAmountPayable: showPayModal.finalPrice,
      amountReceived: Number(payAmount),
      remainingBalance: Math.max(0, showPayModal.balanceDue - Number(payAmount)),
      status: Number(payAmount) >= showPayModal.balanceDue ? "Paid" : "Partially Paid",
      internalNote: payNote.trim() || undefined,
      recordedBy: "Administrator",
    });

    setShowPayModal(null);
    setPayNote("");
    loadData();
  };

  const handleRenew = (m: Membership) => {
    const newStart = m.endDate > new Date().toISOString().split("T")[0] ? m.endDate : new Date().toISOString().split("T")[0];
    const newEnd = addMonthsSafely(newStart, 1);
    GymStore.updateMembership(m.membershipId, {
      startDate: newStart,
      endDate: newEnd,
      membershipStatus: "Active",
      amountPaid: 0,
      balanceDue: m.finalPrice,
      paymentStatus: "Unpaid",
    });
    GymStore.logAction("Admin", "RENEW_MEMBERSHIP", "membership", m.membershipId, `Renewed for 1 month until ${newEnd}`, m.customerName);
    loadData();
  };

  const handleToggleSuspend = (m: Membership) => {
    const newStatus = m.membershipStatus === "Suspended" ? "Active" : "Suspended";
    GymStore.updateMembership(m.membershipId, { membershipStatus: newStatus });
    loadData();
  };

  const exportCSV = () => {
    const headers = "Member ID,Name,Phone,Email,Plan,Start Date,End Date,Status,Payment,Balance Due\n";
    const rows = filtered
      .map(
        (m) =>
          `"${m.membershipId}","${m.customerName}","${m.customerPhone}","${m.customerEmail}","${m.planName}","${m.startDate}","${m.endDate}","${m.membershipStatus}","${m.paymentStatus}","${m.balanceDue}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `safdarbad-gym-members-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
            Member Management
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Manage registrations, renewals, contact profiles, and membership statuses.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="px-3.5 py-2 bg-[#1C1C1C] hover:bg-zinc-800 text-zinc-300 border border-zinc-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-[#FF6B00] hover:bg-[#e05e00] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-md flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Walk-in Member</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-4 bg-[#141414] border border-zinc-800 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, phone, or ID..."
            className="w-full pl-9 pr-4 py-2 bg-[#1C1C1C] border border-zinc-700 rounded-lg text-xs text-white focus:outline-none focus:border-[#FF6B00]"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400 shrink-0">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 bg-[#1C1C1C] border border-zinc-700 rounded-lg text-xs text-white focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Expiring Soon">Expiring Soon</option>
            <option value="Expired">Expired</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400 shrink-0">Payment:</span>
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="w-full px-3 py-2 bg-[#1C1C1C] border border-zinc-700 rounded-lg text-xs text-white focus:outline-none"
          >
            <option value="All">All Payments</option>
            <option value="Paid">Paid</option>
            <option value="Partially Paid">Partially Paid</option>
            <option value="Unpaid">Unpaid</option>
          </select>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-[#161616] border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#121212] border-b border-zinc-800 text-zinc-400 uppercase font-heading tracking-wider">
                <th className="py-3 px-4">Member ID & Name</th>
                <th className="py-3 px-4">Phone & Email</th>
                <th className="py-3 px-4">Plan & Validity</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Balance</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filtered.map((m) => {
                const daysLeft = getDaysRemaining(m.endDate);
                return (
                  <tr key={m.membershipId} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-white block text-sm">{m.customerName}</span>
                      <span className="text-[11px] text-zinc-500 font-mono">{m.membershipId}</span>
                    </td>
                    <td className="py-3.5 px-4 text-zinc-300">
                      <span className="block font-medium">{m.customerPhone}</span>
                      <span className="text-[11px] text-zinc-500">{m.customerEmail}</span>
                    </td>
                    <td className="py-3.5 px-4 text-zinc-300">
                      <span className="block font-medium">{m.planName}</span>
                      <span className="text-[11px] text-zinc-400">
                        {m.startDate} &rarr; {m.endDate} ({daysLeft > 0 ? `${daysLeft}d left` : "Expired"})
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
                    <td className="py-3.5 px-4 font-bold text-white">
                      {m.balanceDue > 0 ? (
                        <span className="text-amber-400">{formatPKR(m.balanceDue)}</span>
                      ) : (
                        <span className="text-emerald-400">PKR 0</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setShowPayModal(m);
                            setPayAmount(m.balanceDue || m.finalPrice);
                          }}
                          className="p-1.5 text-emerald-400 hover:bg-emerald-950/40 rounded transition-colors"
                          title="Record Payment"
                        >
                          <CreditCard className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleRenew(m)}
                          className="p-1.5 text-[#FFC857] hover:bg-amber-950/40 rounded transition-colors"
                          title="Renew Membership (+1 Month)"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleSuspend(m)}
                          className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"
                          title={m.membershipStatus === "Suspended" ? "Activate" : "Suspend"}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="p-8 text-center text-xs text-zinc-500">
            No members matched the filter criteria.
          </div>
        )}
      </div>

      {/* Add Walk-In Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#181818] border border-zinc-700 max-w-md w-full rounded-2xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-heading text-lg font-bold text-white">Add Walk-in Member</h3>
              <button onClick={() => setShowAddModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  placeholder="e.g. Bilal Ahmed"
                  className="w-full px-3 py-2 bg-[#121212] border border-zinc-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="e.g. +92 301 2345678"
                  className="w-full px-3 py-2 bg-[#121212] border border-zinc-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Email (Optional)</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="e.g. bilal@gmail.com"
                  className="w-full px-3 py-2 bg-[#121212] border border-zinc-700 rounded-lg text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Start Date</label>
                  <input
                    type="date"
                    value={newStartDate}
                    onChange={(e) => setNewStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-[#121212] border border-zinc-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Monthly Fee (PKR)</label>
                  <input
                    type="number"
                    value={newFee}
                    onChange={(e) => setNewFee(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#121212] border border-zinc-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#FF6B00] hover:bg-[#e05e00] text-white font-bold uppercase rounded-lg transition-colors"
              >
                Create Member Record
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {showPayModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#181818] border border-zinc-700 max-w-md w-full rounded-2xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h3 className="font-heading text-lg font-bold text-white">Record Member Payment</h3>
                <span className="text-xs text-zinc-400">{showPayModal.customerName}</span>
              </div>
              <button onClick={() => setShowPayModal(null)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-4 text-xs">
              <div className="p-3 bg-[#121212] rounded-lg border border-zinc-800 flex justify-between">
                <span className="text-zinc-400">Outstanding Balance:</span>
                <span className="font-bold text-[#FF6B00]">{formatPKR(showPayModal.balanceDue)}</span>
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Amount Received (PKR) *</label>
                <input
                  type="number"
                  required
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#121212] border border-zinc-700 rounded-lg text-white text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Payment Method</label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value as PaymentTransaction["paymentMethod"])}
                  className="w-full px-3 py-2 bg-[#121212] border border-zinc-700 rounded-lg text-white"
                >
                  <option value="Cash">Cash (Counter)</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="EasyPaisa">EasyPaisa</option>
                  <option value="JazzCash">JazzCash</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Internal Note (Optional)</label>
                <input
                  type="text"
                  value={payNote}
                  onChange={(e) => setPayNote(e.target.value)}
                  placeholder="e.g. Paid in full for October"
                  className="w-full px-3 py-2 bg-[#121212] border border-zinc-700 rounded-lg text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase rounded-lg transition-colors"
              >
                Record Payment & Issue Receipt
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
