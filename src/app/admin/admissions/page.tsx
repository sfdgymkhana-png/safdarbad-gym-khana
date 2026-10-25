"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { GymStore } from "@/lib/store";
import { AdmissionApplication } from "@/lib/types";
import {
  formatPKR,
  getApplicationBadgeClass,
  getPaymentBadgeClass,
  addMonthsSafely,
} from "@/lib/utils";
import { compressAndReadFile } from "@/lib/imageUtils";
import {
  UserCheck,
  Search,
  CheckCircle2,
  XCircle,
  CreditCard,
  MessageSquare,
  Clock,
  Eye,
  X,
  AlertCircle,
  Upload,
  User,
  Trash2,
  Camera,
} from "lucide-react";

export default function AdminAdmissionsPage() {
  const [applications, setApplications] = useState<AdmissionApplication[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Selected for review
  const [reviewApp, setReviewApp] = useState<AdmissionApplication | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [confirmStartDate, setConfirmStartDate] = useState("");
  const [recordCashNow, setRecordCashNow] = useState(true);
  const [editedPhoto, setEditedPhoto] = useState<string>("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadData = () => {
    setApplications(GymStore.getApplications());
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = applications.filter((a) => {
    const matchesSearch =
      a.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.phone.includes(searchQuery) ||
      a.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.applicationId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || a.applicationStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenReview = (app: AdmissionApplication) => {
    setReviewApp(app);
    setReviewNotes(app.notes || "");
    setConfirmStartDate(app.requestedStartDate || new Date().toISOString().split("T")[0]);
    setEditedPhoto(app.photoUrl || "");
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    try {
      const dataUrl = await compressAndReadFile(file, 800, 800, 0.85);
      setEditedPhoto(dataUrl);
      if (reviewApp) {
        GymStore.updateApplication(reviewApp.applicationId, { photoUrl: dataUrl }, "Administrator");
        setReviewApp({ ...reviewApp, photoUrl: dataUrl });
        loadData();
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to upload image.");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleApproveAndActivate = () => {
    if (!reviewApp) return;

    const finalPhoto = editedPhoto || reviewApp.photoUrl;

    // 1. Update application status
    GymStore.updateApplication(reviewApp.applicationId, {
      applicationStatus: "Approved",
      paymentStatus: recordCashNow ? "Paid" : "Unpaid",
      notes: reviewNotes.trim() || undefined,
      photoUrl: finalPhoto || undefined,
      reviewedBy: "Administrator",
      reviewedAt: new Date().toISOString(),
    });

    // 2. Create active membership with photo & fee details
    const endDate = addMonthsSafely(confirmStartDate, 1);
    const newMem = GymStore.createMembership({
      userId: reviewApp.userId,
      customerName: reviewApp.fullName,
      customerEmail: reviewApp.email,
      customerPhone: reviewApp.phone,
      photoUrl: finalPhoto || undefined,
      admissionFee: reviewApp.admissionFee ?? 3000,
      monthlyFee: reviewApp.monthlyFee ?? 2500,
      planId: reviewApp.requestedPlanId,
      planName: reviewApp.requestedPlanName,
      startDate: confirmStartDate,
      endDate,
      originalPrice: reviewApp.originalPrice,
      discountAmount: reviewApp.discountApplied || 0,
      finalPrice: reviewApp.finalPrice,
      amountPaid: recordCashNow ? reviewApp.finalPrice : 0,
      balanceDue: recordCashNow ? 0 : reviewApp.finalPrice,
      membershipStatus: "Active",
      paymentStatus: recordCashNow ? "Paid" : "Unpaid",
    });

    // 3. Record payment transaction if cash paid at desk
    if (recordCashNow) {
      GymStore.recordPayment({
        userId: reviewApp.userId,
        customerName: reviewApp.fullName,
        membershipId: newMem.membershipId,
        paymentDate: confirmStartDate,
        paymentMethod: "Cash",
        originalAmount: reviewApp.originalPrice,
        discountAmount: reviewApp.discountApplied || 0,
        finalAmountPayable: reviewApp.finalPrice,
        amountReceived: reviewApp.finalPrice,
        remainingBalance: 0,
        status: "Paid",
        internalNote: `Admission approved. Cash paid at desk (Admission PKR ${reviewApp.admissionFee ?? 3000} + Monthly PKR ${reviewApp.monthlyFee ?? 2500}).`,
        recordedBy: "Administrator",
      });
    }

    setReviewApp(null);
    loadData();
  };

  const handleReject = () => {
    if (!reviewApp) return;
    const reason = prompt("Enter reason for application rejection:");
    if (!reason) return;

    GymStore.updateApplication(reviewApp.applicationId, {
      applicationStatus: "Rejected",
      rejectionReason: reason,
      reviewedBy: "Administrator",
      reviewedAt: new Date().toISOString(),
    });

    setReviewApp(null);
    loadData();
  };

  const handleDeleteApplication = (appId: string) => {
    if (!confirm(`Are you sure you want to delete application #${appId}?`)) return;
    GymStore.deleteApplication(appId, "Administrator");
    if (reviewApp?.applicationId === appId) {
      setReviewApp(null);
    }
    loadData();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
          Admission Applications
        </h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Review prospective member submissions, verify photos, offline payments (3,000 RS Admission / 2,500 RS Monthly), and activate memberships.
        </p>
      </div>

      {/* Filter bar */}
      <div className="p-4 bg-[#141414] border border-zinc-800 rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search applications by name, phone, ID..."
            className="w-full pl-9 pr-4 py-2 bg-[#1C1C1C] border border-zinc-700 rounded-lg text-xs text-white focus:outline-none focus:border-[#FF6B00]"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400 shrink-0">Filter Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 bg-[#1C1C1C] border border-zinc-700 rounded-lg text-xs text-white focus:outline-none"
          >
            <option value="All">All Applications</option>
            <option value="Pending Review">Pending Review</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#161616] border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#121212] border-b border-zinc-800 text-zinc-400 uppercase font-heading tracking-wider">
                <th className="py-3 px-4">Photo & Applicant</th>
                <th className="py-3 px-4">Application ID</th>
                <th className="py-3 px-4">Plan & Start Date</th>
                <th className="py-3 px-4">Fee Breakdown</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Review Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filtered.map((app) => (
                <tr key={app.applicationId} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      {app.photoUrl ? (
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-[#FF6B00]/60 shrink-0">
                          <Image src={app.photoUrl} alt={app.fullName} fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0 text-zinc-500">
                          <User className="w-5 h-5" />
                        </div>
                      )}
                      <div>
                        <span className="font-bold text-white block text-sm">{app.fullName}</span>
                        <span className="text-[11px] text-zinc-500">{app.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-zinc-300">
                    {app.applicationId}
                  </td>
                  <td className="py-3.5 px-4 text-zinc-300">
                    <span className="block font-medium">{app.requestedPlanName}</span>
                    <span className="text-[11px] text-zinc-400">Date: {app.requestedStartDate}</span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-white">
                    <div>{formatPKR(app.finalPrice)}</div>
                    <span className="text-[10px] text-zinc-400 block font-normal">
                      Adm: {formatPKR(app.admissionFee ?? 3000)} • Mo: {formatPKR(app.monthlyFee ?? 2500)}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded font-semibold ${getPaymentBadgeClass(app.paymentStatus)}`}>
                      {app.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded font-semibold ${getApplicationBadgeClass(app.applicationStatus)}`}>
                      {app.applicationStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenReview(app)}
                        className="px-3 py-1.5 bg-[#FF6B00] hover:bg-[#e05e00] text-white font-semibold rounded text-xs transition-colors"
                      >
                        Review
                      </button>
                      <button
                        onClick={() => handleDeleteApplication(app.applicationId)}
                        className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-950/40 rounded transition-colors"
                        title="Delete Application"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review & Edit Modal */}
      {reviewApp && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#181818] border border-zinc-700 max-w-lg w-full rounded-2xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h3 className="font-heading text-lg font-bold text-white">
                  Review Admission #{reviewApp.applicationId}
                </h3>
                <span className="text-xs text-zinc-400">Applicant: {reviewApp.fullName}</span>
              </div>
              <button onClick={() => setReviewApp(null)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Photo Upload & Preview Section */}
              <div className="p-3 bg-[#121212] rounded-xl border border-zinc-800 flex items-center gap-4">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-[#FF6B00] bg-zinc-900 shrink-0 flex items-center justify-center">
                  {editedPhoto ? (
                    <Image src={editedPhoto} alt={reviewApp.fullName} fill className="object-cover" />
                  ) : (
                    <User className="w-8 h-8 text-zinc-600" />
                  )}
                </div>

                <div className="space-y-1.5 flex-1">
                  <span className="font-semibold text-white block">Member Photo</span>
                  <p className="text-[11px] text-zinc-400">
                    {editedPhoto ? "Photo attached to admission." : "No photo uploaded by applicant."}
                  </p>

                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingPhoto}
                      className="px-3 py-1.5 bg-[#FF6B00] hover:bg-[#e05e00] text-white font-bold rounded flex items-center gap-1.5 transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{editedPhoto ? "Upload New Image" : "Upload Photo"}</span>
                    </button>
                    {editedPhoto && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditedPhoto("");
                          GymStore.updateApplication(reviewApp.applicationId, { photoUrl: undefined }, "Administrator");
                          setReviewApp({ ...reviewApp, photoUrl: undefined });
                          loadData();
                        }}
                        className="px-2.5 py-1.5 bg-zinc-800 hover:bg-red-950/50 text-zinc-300 hover:text-red-400 rounded border border-zinc-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Fee Breakdown Card */}
              <div className="p-3.5 bg-[#121212] rounded-lg border border-zinc-800 grid grid-cols-2 gap-2.5">
                <div>
                  <span className="text-zinc-500 block">Phone:</span>
                  <span className="font-medium text-white">{reviewApp.phone}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Email:</span>
                  <span className="font-medium text-white">{reviewApp.email}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Admission Fee:</span>
                  <span className="font-semibold text-white">{formatPKR(reviewApp.admissionFee ?? 3000)}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Monthly Charge:</span>
                  <span className="font-semibold text-white">{formatPKR(reviewApp.monthlyFee ?? 2500)}</span>
                </div>
                <div className="col-span-2 pt-1 border-t border-zinc-800 flex justify-between">
                  <span className="text-zinc-400 font-semibold">Total Payable:</span>
                  <span className="font-bold text-[#FF6B00] text-sm">{formatPKR(reviewApp.finalPrice)}</span>
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  Confirm Membership Start Date
                </label>
                <input
                  type="date"
                  value={confirmStartDate}
                  onChange={(e) => setConfirmStartDate(e.target.value)}
                  className="w-full px-3 py-2 bg-[#121212] border border-zinc-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  Internal Verification Notes
                </label>
                <textarea
                  rows={2}
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="e.g. Verified CNIC, paid cash at Fatima Center desk."
                  className="w-full px-3 py-2 bg-[#121212] border border-zinc-700 rounded-lg text-white"
                />
              </div>

              <div className="p-3 bg-[#141414] rounded-lg border border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-white block">Record Offline Payment Now?</span>
                  <span className="text-[11px] text-zinc-400">
                    Check if member paid PKR {reviewApp.finalPrice} in cash/bank transfer.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={recordCashNow}
                  onChange={(e) => setRecordCashNow(e.target.checked)}
                  className="w-5 h-5 text-[#FF6B00] rounded bg-zinc-800 border-zinc-700"
                />
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleReject}
                  className="px-4 py-2.5 bg-red-950/60 hover:bg-red-900 text-red-400 font-semibold rounded-lg border border-red-800/60 transition-colors"
                >
                  Reject Application
                </button>
                <button
                  type="button"
                  onClick={handleApproveAndActivate}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase rounded-lg shadow-lg transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve & Activate</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
