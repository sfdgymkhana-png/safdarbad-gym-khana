"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { GymStore } from "@/lib/store";
import { Membership, PaymentTransaction } from "@/lib/types";
import {
  formatPKR,
  getDaysRemaining,
  getMembershipBadgeClass,
  getPaymentBadgeClass,
  addMonthsSafely,
} from "@/lib/utils";
import { compressAndReadFile } from "@/lib/imageUtils";
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
  Upload,
  User,
  Camera,
} from "lucide-react";

export default function AdminMembersPage() {
  const [members, setMembers] = useState<Membership[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All");

  // Success Notification
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPayModal, setShowPayModal] = useState<Membership | null>(null);
  const [showEditModal, setShowEditModal] = useState<Membership | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<Membership | null>(null);

  // New Member Form
  const [newFullName, setNewFullName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newStartDate, setNewStartDate] = useState("2026-10-25");
  const [isNewWalkIn, setIsNewWalkIn] = useState(true);
  const [newAdmissionFee, setNewAdmissionFee] = useState(3000);
  const [newMonthlyFee, setNewMonthlyFee] = useState(2500);
  const [newPhotoUrl, setNewPhotoUrl] = useState<string>("");
  const [uploadingNewPhoto, setUploadingNewPhoto] = useState(false);
  const addPhotoInputRef = useRef<HTMLInputElement>(null);

  // Edit Member Form
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editStartDate, setEditStartDate] = useState("");
  const [editEndDate, setEditEndDate] = useState("");
  const [editStatus, setEditStatus] = useState<Membership["membershipStatus"]>("Active");
  const [editFinalPrice, setEditFinalPrice] = useState(2500);
  const [editPhotoUrl, setEditPhotoUrl] = useState<string>("");
  const [uploadingEditPhoto, setUploadingEditPhoto] = useState(false);
  const editPhotoInputRef = useRef<HTMLInputElement>(null);

  // Payment Form for Member
  const [payAmount, setPayAmount] = useState(2500);
  const [payMethod, setPayMethod] = useState<PaymentTransaction["paymentMethod"]>("Cash");
  const [payNote, setPayNote] = useState("");

  const loadData = () => {
    setMembers(GymStore.getMemberships());
  };

  useEffect(() => {
    loadData();
    const today = new Date().toISOString().split("T")[0];
    setNewStartDate(today);
    const settings = GymStore.getSettings();
    setNewAdmissionFee(settings.standardAdmissionFee ?? 3000);
    setNewMonthlyFee(settings.standardMonthlyFee ?? 2500);
  }, []);

  const triggerSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

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

  // Handle Photo upload for Add Member modal
  const handleNewPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingNewPhoto(true);
    try {
      const dataUrl = await compressAndReadFile(file, 800, 800, 0.85);
      setNewPhotoUrl(dataUrl);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to read image file.");
    } finally {
      setUploadingNewPhoto(false);
    }
  };

  // Handle Photo upload for Edit Member modal
  const handleEditPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingEditPhoto(true);
    try {
      const dataUrl = await compressAndReadFile(file, 800, 800, 0.85);
      setEditPhotoUrl(dataUrl);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to read image file.");
    } finally {
      setUploadingEditPhoto(false);
    }
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName.trim() || !newPhone.trim()) return;

    const totalFee = isNewWalkIn ? newAdmissionFee + newMonthlyFee : newMonthlyFee;
    const endDate = addMonthsSafely(newStartDate, 1);

    GymStore.createMembership({
      userId: `USR-${Date.now().toString().slice(-5)}`,
      customerName: newFullName.trim(),
      customerEmail: newEmail.trim() || `${newPhone.trim()}@safdarbadgym.pk`,
      customerPhone: newPhone.trim(),
      photoUrl: newPhotoUrl || undefined,
      admissionFee: isNewWalkIn ? newAdmissionFee : 0,
      monthlyFee: newMonthlyFee,
      planId: "PLAN-MONTHLY",
      planName: isNewWalkIn ? "New Walk-in Admission" : "Standard Monthly Membership",
      startDate: newStartDate,
      endDate,
      originalPrice: totalFee,
      discountAmount: 0,
      finalPrice: totalFee,
      amountPaid: 0,
      balanceDue: totalFee,
      membershipStatus: "Active",
      paymentStatus: "Unpaid",
    });

    setShowAddModal(false);
    setNewFullName("");
    setNewEmail("");
    setNewPhone("");
    setNewPhotoUrl("");
    loadData();
    triggerSuccess("New member record created successfully!");
  };

  const handleOpenEdit = (m: Membership) => {
    setShowEditModal(m);
    setEditName(m.customerName);
    setEditPhone(m.customerPhone);
    setEditEmail(m.customerEmail);
    setEditStartDate(m.startDate);
    setEditEndDate(m.endDate);
    setEditStatus(m.membershipStatus);
    setEditFinalPrice(m.finalPrice);
    setEditPhotoUrl(m.photoUrl || "");
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showEditModal) return;

    GymStore.updateMembership(showEditModal.membershipId, {
      customerName: editName.trim(),
      customerPhone: editPhone.trim(),
      customerEmail: editEmail.trim(),
      startDate: editStartDate,
      endDate: editEndDate,
      membershipStatus: editStatus,
      finalPrice: Number(editFinalPrice),
      photoUrl: editPhotoUrl || undefined,
    });

    setShowEditModal(null);
    loadData();
    triggerSuccess("Member record and photo updated successfully!");
  };

  const handleDeleteMember = () => {
    if (!showDeleteModal) return;
    const name = showDeleteModal.customerName;
    const id = showDeleteModal.membershipId;

    GymStore.deleteMembership(id, "Administrator");
    setShowDeleteModal(null);
    loadData();
    triggerSuccess(`Member ${name} (#${id}) has been removed.`);
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
    triggerSuccess(`Payment of PKR ${payAmount} recorded for ${showPayModal.customerName}!`);
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
    GymStore.logAction("Admin", "RENEW_MEMBERSHIP", "membership", m.membershipId, `Renewed for 1 month until ${newEnd}`, m.customerName);
    loadData();
    triggerSuccess(`Membership renewed for 1 month until ${newEnd}!`);
  };

  const handleToggleSuspend = (m: Membership) => {
    const newStatus = m.membershipStatus === "Suspended" ? "Active" : "Suspended";
    GymStore.updateMembership(m.membershipId, { membershipStatus: newStatus });
    loadData();
    triggerSuccess(`Member marked as ${newStatus}.`);
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
      {/* Success Notification Banner */}
      {successMessage && (
        <div className="p-3.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-semibold rounded-xl flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
            Member Management
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Manage registrations, edit photos, renewals, fee payments, and member removal.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            onClick={exportCSV}
            className="flex-1 sm:flex-none px-3.5 py-2 bg-[#1C1C1C] hover:bg-zinc-800 text-zinc-300 border border-zinc-700 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex-1 sm:flex-none px-4 py-2 bg-[#FF6B00] hover:bg-[#e05e00] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-md flex items-center justify-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Walk-in</span>
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

      {/* Mobile Member Cards (Visible on mobile screens < md) */}
      <div className="block md:hidden space-y-3">
        {filtered.map((m) => {
          const daysLeft = getDaysRemaining(m.endDate);
          return (
            <div
              key={m.membershipId}
              className="bg-[#161616] border border-zinc-800 rounded-xl p-4 space-y-3 shadow-lg"
            >
              {/* Header: Photo + Name + Badges */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  {m.photoUrl ? (
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-[#FF6B00]/70 shrink-0">
                      <Image src={m.photoUrl} alt={m.customerName} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0 text-zinc-500">
                      <User className="w-6 h-6" />
                    </div>
                  )}
                  <div>
                    <h4 className="font-heading font-bold text-white text-sm">{m.customerName}</h4>
                    <span className="text-[10px] text-zinc-500 font-mono block">ID: {m.membershipId}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${getMembershipBadgeClass(m.membershipStatus)}`}>
                    {m.membershipStatus}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${getPaymentBadgeClass(m.paymentStatus)}`}>
                    {m.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Info details */}
              <div className="p-2.5 bg-[#111111] rounded-lg border border-zinc-800/80 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-zinc-500 text-[10px] block uppercase">Phone:</span>
                  <a href={`tel:${m.customerPhone}`} className="text-zinc-200 font-medium hover:text-[#FF6B00]">
                    {m.customerPhone}
                  </a>
                </div>
                <div>
                  <span className="text-zinc-500 text-[10px] block uppercase">Balance Due:</span>
                  <span className={m.balanceDue > 0 ? "text-amber-400 font-bold" : "text-emerald-400 font-bold"}>
                    {m.balanceDue > 0 ? formatPKR(m.balanceDue) : "PKR 0 (Clear)"}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-zinc-500 text-[10px] block uppercase">Plan & Expiry:</span>
                  <span className="text-zinc-300">
                    {m.planName} &bull; {m.endDate} ({daysLeft > 0 ? `${daysLeft} days left` : "Expired"})
                  </span>
                </div>
              </div>

              {/* Mobile Quick Action Buttons with Clear Labels & Icons */}
              <div className="grid grid-cols-4 gap-1.5 pt-1">
                <button
                  onClick={() => {
                    setShowPayModal(m);
                    setPayAmount(m.balanceDue || m.finalPrice);
                  }}
                  className="py-2 px-1 bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-400 border border-emerald-800/50 rounded-lg flex flex-col items-center justify-center gap-1 text-[10px] font-semibold transition-colors"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Pay</span>
                </button>

                <button
                  onClick={() => handleRenew(m)}
                  className="py-2 px-1 bg-amber-950/40 hover:bg-amber-900/50 text-[#FFC857] border border-amber-800/50 rounded-lg flex flex-col items-center justify-center gap-1 text-[10px] font-semibold transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Renew</span>
                </button>

                <button
                  onClick={() => handleOpenEdit(m)}
                  className="py-2 px-1 bg-blue-950/40 hover:bg-blue-900/50 text-blue-400 border border-blue-800/50 rounded-lg flex flex-col items-center justify-center gap-1 text-[10px] font-semibold transition-colors"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => setShowDeleteModal(m)}
                  className="py-2 px-1 bg-red-950/40 hover:bg-red-900/50 text-red-400 border border-red-800/50 rounded-lg flex flex-col items-center justify-center gap-1 text-[10px] font-semibold transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Members Table (Visible on md and up) */}
      <div className="hidden md:block bg-[#161616] border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#121212] border-b border-zinc-800 text-zinc-400 uppercase font-heading tracking-wider">
                <th className="py-3 px-4">Member Photo & Name</th>
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
                      <div className="flex items-center gap-3">
                        {m.photoUrl ? (
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-[#FF6B00]/70 shrink-0">
                            <Image src={m.photoUrl} alt={m.customerName} fill className="object-cover" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0 text-zinc-500">
                            <User className="w-5 h-5" />
                          </div>
                        )}
                        <div>
                          <span className="font-bold text-white block text-sm">{m.customerName}</span>
                          <span className="text-[11px] text-zinc-500 font-mono">{m.membershipId}</span>
                        </div>
                      </div>
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
                        {/* Record Payment */}
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

                        {/* Renew Membership */}
                        <button
                          onClick={() => handleRenew(m)}
                          className="p-1.5 text-[#FFC857] hover:bg-amber-950/40 rounded transition-colors"
                          title="Renew Membership (+1 Month)"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>

                        {/* Edit Member & Photo */}
                        <button
                          onClick={() => handleOpenEdit(m)}
                          className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-950/40 rounded transition-colors"
                          title="Edit Member & Photo"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        {/* Remove / Delete Member */}
                        <button
                          onClick={() => setShowDeleteModal(m)}
                          className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-950/50 rounded transition-colors"
                          title="Remove Member from Admin Panel"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Walk-in Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#181818] border border-zinc-700 max-w-md w-full rounded-2xl p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-heading text-lg font-bold text-white">Add Walk-in Member</h3>
              <button onClick={() => setShowAddModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-4 text-xs">
              {/* Member Photo Upload */}
              <div className="p-3 bg-[#121212] rounded-xl border border-zinc-800 flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-dashed border-[#FF6B00]/70 bg-zinc-900 flex items-center justify-center shrink-0">
                  {newPhotoUrl ? (
                    <Image src={newPhotoUrl} alt="New Member" fill className="object-cover" />
                  ) : (
                    <User className="w-7 h-7 text-zinc-600" />
                  )}
                </div>

                <div className="flex-1 space-y-1">
                  <span className="font-semibold text-white block">Member Photo</span>
                  <input
                    type="file"
                    ref={addPhotoInputRef}
                    accept="image/*"
                    onChange={handleNewPhotoUpload}
                    className="hidden"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => addPhotoInputRef.current?.click()}
                      disabled={uploadingNewPhoto}
                      className="px-3 py-1.5 bg-[#FF6B00] hover:bg-[#e05e00] text-white font-bold rounded flex items-center gap-1 transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{newPhotoUrl ? "Change Photo" : "Upload Image"}</span>
                    </button>
                    {newPhotoUrl && (
                      <button
                        type="button"
                        onClick={() => setNewPhotoUrl("")}
                        className="px-2.5 py-1.5 bg-zinc-800 hover:bg-red-950/50 text-zinc-300 hover:text-red-400 rounded border border-zinc-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>

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

              {/* Enrollment Type */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsNewWalkIn(true)}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    isNewWalkIn
                      ? "bg-[#FF6B00]/15 border-[#FF6B00] text-white"
                      : "bg-[#141414] border-zinc-800 text-zinc-400"
                  }`}
                >
                  <span className="font-bold block text-white">New Admission</span>
                  <span className="text-[10px] text-zinc-400">
                    Fee: {formatPKR(newAdmissionFee)} + {formatPKR(newMonthlyFee)}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsNewWalkIn(false)}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    !isNewWalkIn
                      ? "bg-[#FF6B00]/15 border-[#FF6B00] text-white"
                      : "bg-[#141414] border-zinc-800 text-zinc-400"
                  }`}
                >
                  <span className="font-bold block text-white">Monthly Only</span>
                  <span className="text-[10px] text-zinc-400">
                    Fee: {formatPKR(newMonthlyFee)}
                  </span>
                </button>
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
                  <label className="block text-zinc-300 font-semibold mb-1">Total Fee (PKR)</label>
                  <div className="px-3 py-2 bg-[#121212] border border-zinc-700 rounded-lg text-white font-bold text-sm text-[#FF6B00]">
                    {formatPKR(isNewWalkIn ? newAdmissionFee + newMonthlyFee : newMonthlyFee)}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#FF6B00] hover:bg-[#e05e00] text-white font-bold uppercase rounded-lg transition-colors shadow-lg"
              >
                Create Member Record
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Member & Photo Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#181818] border border-zinc-700 max-w-md w-full rounded-2xl p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h3 className="font-heading text-lg font-bold text-white">Edit Member & Photo</h3>
                <span className="text-xs text-zinc-400">ID: {showEditModal.membershipId}</span>
              </div>
              <button onClick={() => setShowEditModal(null)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              {/* Photo Upload & Preview */}
              <div className="p-3 bg-[#121212] rounded-xl border border-zinc-800 flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-[#FF6B00] bg-zinc-900 flex items-center justify-center shrink-0">
                  {editPhotoUrl ? (
                    <Image src={editPhotoUrl} alt={editName} fill className="object-cover" />
                  ) : (
                    <User className="w-7 h-7 text-zinc-600" />
                  )}
                </div>

                <div className="flex-1 space-y-1">
                  <span className="font-semibold text-white block">Member Photo</span>
                  <input
                    type="file"
                    ref={editPhotoInputRef}
                    accept="image/*"
                    onChange={handleEditPhotoUpload}
                    className="hidden"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => editPhotoInputRef.current?.click()}
                      disabled={uploadingEditPhoto}
                      className="px-3 py-1.5 bg-[#FF6B00] hover:bg-[#e05e00] text-white font-bold rounded flex items-center gap-1 transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{editPhotoUrl ? "Upload New Image" : "Upload Photo"}</span>
                    </button>
                    {editPhotoUrl && (
                      <button
                        type="button"
                        onClick={() => setEditPhotoUrl("")}
                        className="px-2.5 py-1.5 bg-zinc-800 hover:bg-red-950/50 text-zinc-300 hover:text-red-400 rounded border border-zinc-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#121212] border border-zinc-700 rounded-lg text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Phone</label>
                  <input
                    type="tel"
                    required
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-[#121212] border border-zinc-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Email</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-[#121212] border border-zinc-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Start Date</label>
                  <input
                    type="date"
                    value={editStartDate}
                    onChange={(e) => setEditStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-[#121212] border border-zinc-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">End Date</label>
                  <input
                    type="date"
                    value={editEndDate}
                    onChange={(e) => setEditEndDate(e.target.value)}
                    className="w-full px-3 py-2 bg-[#121212] border border-zinc-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as Membership["membershipStatus"])}
                    className="w-full px-3 py-2 bg-[#121212] border border-zinc-700 rounded-lg text-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Expiring Soon">Expiring Soon</option>
                    <option value="Expired">Expired</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Total Fee (PKR)</label>
                  <input
                    type="number"
                    value={editFinalPrice}
                    onChange={(e) => setEditFinalPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#121212] border border-zinc-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase rounded-lg transition-colors shadow"
              >
                Save Changes & Photo
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete / Remove Member Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#181818] border border-red-900/60 max-w-md w-full rounded-2xl p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-red-400">
              <div className="w-10 h-10 rounded-full bg-red-950/60 border border-red-800/80 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-white">Remove Member</h3>
                <span className="text-xs text-zinc-400">Permanent Removal from Gym Database</span>
              </div>
            </div>

            <div className="p-4 bg-[#121212] rounded-xl border border-zinc-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-500">Member ID:</span>
                <span className="font-mono text-white font-semibold">{showDeleteModal.membershipId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Name:</span>
                <span className="font-bold text-white">{showDeleteModal.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Phone:</span>
                <span className="text-zinc-300">{showDeleteModal.customerPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Outstanding Due:</span>
                <span className="text-amber-400 font-semibold">{formatPKR(showDeleteModal.balanceDue)}</span>
              </div>
            </div>

            <p className="text-xs text-red-400/90 leading-relaxed">
              Are you sure you want to permanently remove this member from the admin panel? All membership data for this user will be deleted.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(null)}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteMember}
                className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white font-bold uppercase rounded-lg text-xs tracking-wider shadow-lg transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Yes, Remove Member</span>
              </button>
            </div>
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
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase rounded-lg transition-colors shadow-lg"
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
