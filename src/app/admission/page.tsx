"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { GymStore } from "@/lib/store";
import { SiteSettings, AdmissionApplication } from "@/lib/types";
import { formatPKR } from "@/lib/utils";
import confetti from "canvas-confetti";
import {
  CheckCircle2,
  ArrowRight,
  Shield,
  Tag,
  AlertCircle,
  Copy,
  MessageSquare,
  Sparkles,
  Calendar,
  UserCheck,
} from "lucide-react";

export default function AdmissionPage() {
  const [settings, setSettings] = useState<SiteSettings>(GymStore.getSettings());
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [requestedStartDate, setRequestedStartDate] = useState("2026-10-25");
  const [requestedMonth, setRequestedMonth] = useState("October 2026");
  const [isNewMember, setIsNewMember] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [notes, setNotes] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedApplication, setSubmittedApplication] = useState<AdmissionApplication | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setSettings(GymStore.getSettings());
    setRequestedStartDate(new Date().toISOString().split("T")[0]);

    return GymStore.subscribe(() => {
      setSettings(GymStore.getSettings());
    });
  }, []);

  const admissionFee = settings.standardAdmissionFee ?? 3000;
  const monthlyCharge = settings.standardMonthlyFee ?? 2500;
  const basePrice = isNewMember ? admissionFee + monthlyCharge : monthlyCharge;
  const finalPrice = Math.max(0, basePrice - discountAmount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    const discounts = GymStore.getDiscounts();
    const matched = discounts.find(
      (d) => d.couponCode?.toUpperCase() === code && d.isActive
    );

    if (matched) {
      if (matched.discountType === "percentage") {
        const discountVal = (basePrice * matched.discountValue) / 100;
        setDiscountAmount(discountVal);
      } else {
        setDiscountAmount(matched.discountValue);
      }
      setCouponApplied(true);
    } else {
      setError("Invalid or inactive coupon code.");
      setDiscountAmount(0);
      setCouponApplied(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setError("Please fill in all personal information fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!agreeTerms) {
      setError("You must accept the membership terms and privacy policy.");
      return;
    }

    setLoading(true);

    try {
      const newApp = GymStore.submitApplication({
        userId: `USR-${Date.now().toString().slice(-5)}`,
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        isNewAdmission: isNewMember,
        admissionFee: isNewMember ? admissionFee : 0,
        monthlyFee: monthlyCharge,
        requestedPlanId: "PLAN-MONTHLY",
        requestedPlanName: isNewMember
          ? "New Member Admission (Admission + 1st Month)"
          : "Monthly Membership Renewal",
        requestedStartDate,
        requestedMonth,
        couponCode: couponApplied ? couponCode.toUpperCase() : undefined,
        discountApplied: discountAmount,
        originalPrice: basePrice,
        finalPrice,
        notes: notes.trim() || undefined,
      });

      setSubmittedApplication(newApp);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to submit admission.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyId = () => {
    if (!submittedApplication) return;
    navigator.clipboard.writeText(submittedApplication.applicationId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#101010] text-white min-h-screen">
      <Navbar />

      <main className="pt-32 sm:pt-36 pb-16 sm:pb-20 px-3.5 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {!submittedApplication ? (
          <div className="space-y-6 sm:space-y-8">
            {/* Header */}
            <div className="text-center space-y-2">
              <span className="text-xs font-bold text-[#FF6B00] uppercase tracking-widest">
                Start Your Fitness Journey
              </span>
              <h1 className="font-heading text-2xl sm:text-5xl font-extrabold text-white">
                Gym Admission Application
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto">
                Apply online for membership at Safdarbad Gym Khan’a. You can complete your registration right from home.
              </p>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/40 rounded-xl text-xs sm:text-sm text-red-400 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Application Form Card */}
            <div className="bg-[#181818] border border-zinc-800 rounded-2xl p-4 sm:p-10 shadow-2xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Section 1: Personal Info */}
                <div className="space-y-4">
                  <h3 className="font-heading text-lg font-bold text-[#FFC857] border-b border-zinc-800 pb-2">
                    1. Personal Information
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Full Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Muhammad Ali"
                        className="w-full px-4 py-2.5 bg-[#121212] border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:border-[#FF6B00]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Phone Number <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. +92 300 1234567"
                        className="w-full px-4 py-2.5 bg-[#121212] border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:border-[#FF6B00]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Email Address <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="yourname@gmail.com"
                        className="w-full px-4 py-2.5 bg-[#121212] border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:border-[#FF6B00]"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Account Security */}
                <div className="space-y-4 pt-2">
                  <h3 className="font-heading text-lg font-bold text-[#FFC857] border-b border-zinc-800 pb-2">
                    2. Portal Account Password
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Choose Password <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Minimum 6 characters"
                        className="w-full px-4 py-2.5 bg-[#121212] border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:border-[#FF6B00]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Confirm Password <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        className="w-full px-4 py-2.5 bg-[#121212] border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:border-[#FF6B00]"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3: Membership Details */}
                <div className="space-y-4 pt-2">
                  <h3 className="font-heading text-lg font-bold text-[#FFC857] border-b border-zinc-800 pb-2">
                    3. Membership Category & Start Date
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setIsNewMember(true)}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        isNewMember
                          ? "bg-[#FF6B00]/10 border-[#FF6B00] shadow-md shadow-[#FF6B00]/20"
                          : "bg-[#121212] border-zinc-800 hover:border-zinc-700"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-white text-sm">New Admission</span>
                        {isNewMember && <CheckCircle2 className="w-4 h-4 text-[#FF6B00]" />}
                      </div>
                      <p className="text-xs text-zinc-400">
                        First-time joiner. Includes one-time admission fee + 1st month.
                      </p>
                      <div className="mt-2 text-xs font-semibold text-[#FFC857]">
                        {formatPKR(admissionFee)} Admission + {formatPKR(monthlyCharge)} / mo
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsNewMember(false)}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        !isNewMember
                          ? "bg-[#FF6B00]/10 border-[#FF6B00] shadow-md shadow-[#FF6B00]/20"
                          : "bg-[#121212] border-zinc-800 hover:border-zinc-700"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-white text-sm">Monthly Renewal</span>
                        {!isNewMember && <CheckCircle2 className="w-4 h-4 text-[#FF6B00]" />}
                      </div>
                      <p className="text-xs text-zinc-400">
                        Existing member renewing monthly fee. No admission fee.
                      </p>
                      <div className="mt-2 text-xs font-semibold text-[#FFC857]">
                        {formatPKR(monthlyCharge)} / month only
                      </div>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Requested Start Date
                      </label>
                      <input
                        type="date"
                        required
                        value={requestedStartDate}
                        onChange={(e) => setRequestedStartDate(e.target.value)}
                        className="w-full px-4 py-2.5 bg-[#121212] border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:border-[#FF6B00]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Enrollment Month Label
                      </label>
                      <input
                        type="text"
                        value={requestedMonth}
                        onChange={(e) => setRequestedMonth(e.target.value)}
                        placeholder="e.g. October 2026"
                        className="w-full px-4 py-2.5 bg-[#121212] border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:border-[#FF6B00]"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 4: Coupon & Notes */}
                <div className="space-y-4 pt-2">
                  <h3 className="font-heading text-lg font-bold text-[#FFC857] border-b border-zinc-800 pb-2">
                    4. Promotional Coupon & Notes
                  </h3>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Promotional Discount Coupon (Optional)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="e.g. WELCOME20"
                        className="flex-1 px-4 py-2.5 bg-[#121212] border border-zinc-700 rounded-lg text-sm text-white focus:outline-none uppercase"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        className="px-4 py-2.5 bg-[#252525] hover:bg-zinc-700 text-xs font-bold text-white rounded-lg border border-zinc-600 transition-colors"
                      >
                        Apply Code
                      </button>
                    </div>
                    {couponApplied && (
                      <p className="text-xs text-emerald-400 mt-1.5 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Coupon applied! You save {formatPKR(discountAmount)}.</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Additional Notes or Fitness Goals (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Weight training focus, beginner lifting guidance..."
                      className="w-full px-4 py-2 bg-[#121212] border border-zinc-700 rounded-lg text-sm text-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Price Summary Breakdown Strip */}
                <div className="p-5 bg-[#141414] border border-zinc-800 rounded-xl space-y-2.5 text-xs">
                  <div className="font-semibold text-zinc-300 pb-1 border-b border-zinc-800">
                    Payment Breakdown:
                  </div>

                  {isNewMember && (
                    <div className="flex justify-between text-zinc-300">
                      <span>Admission / Registration Fee (New Member):</span>
                      <span className="font-semibold text-white">{formatPKR(admissionFee)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-zinc-300">
                    <span>Monthly Membership Charge:</span>
                    <span className="font-semibold text-white">{formatPKR(monthlyCharge)}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Discount Coupon Applied:</span>
                      <span>- {formatPKR(discountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-base font-bold text-white pt-2.5 border-t border-zinc-800">
                    <span>Total Amount Payable:</span>
                    <span className="text-[#FF6B00] text-lg font-heading">{formatPKR(finalPrice)}</span>
                  </div>

                  <p className="text-[11px] text-zinc-500 pt-1">
                    * Fee is payable offline at gym counter (Cash or EasyPaisa/JazzCash) upon admission review.
                  </p>
                </div>

                {/* Terms agreement */}
                <div className="flex items-start gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded bg-[#121212] border-zinc-700 text-[#FF6B00] focus:ring-[#FF6B00]"
                  />
                  <label htmlFor="terms" className="text-xs text-zinc-400 leading-snug">
                    I agree to the Safdarbad Gym Khan’a membership rules, discipline guidelines, and privacy policy. I understand that admission is subject to administrative review.
                  </label>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 font-heading text-base font-bold uppercase tracking-wider text-white bg-gradient-to-r from-[#FF6B00] to-[#FF8533] hover:from-[#e05e00] hover:to-[#ff6b00] rounded-xl shadow-xl shadow-[#FF6B00]/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? "Submitting Application..." : "Submit Admission Application"}
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Success / Confirmation Screen */
          <div className="bg-[#181818] border border-zinc-800 rounded-2xl p-8 sm:p-12 text-center space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-[#FF6B00] uppercase tracking-widest">
                Admission Submitted Successfully
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white">
                Application Received!
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
                Thank you for applying to Safdarbad Gym Khan’a, <strong>{submittedApplication.fullName}</strong>. Your admission has been registered.
              </p>
            </div>

            {/* Application ID Summary Card */}
            <div className="max-w-md mx-auto p-5 bg-[#121212] border border-zinc-700 rounded-xl space-y-4 text-left">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-[#FF6B00]/20 border border-[#FF6B00]/50 flex items-center justify-center shrink-0 text-[#FF6B00]">
                  <UserCheck className="w-7 h-7" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-400">Application Number</span>
                    <button
                      onClick={handleCopyId}
                      className="flex items-center gap-1.5 text-xs text-[#FF6B00] hover:underline"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copied ? "Copied!" : "Copy"}</span>
                    </button>
                  </div>
                  <div className="font-heading text-xl font-bold text-white tracking-widest truncate">
                    {submittedApplication.applicationId}
                  </div>
                  <span className="text-xs text-zinc-400 block">{submittedApplication.fullName}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-800 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-zinc-500 block">Status:</span>
                  <span className="inline-block px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30 font-semibold mt-0.5">
                    Pending Review
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Initial Payment:</span>
                  <span className="inline-block px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 font-semibold mt-0.5">
                    Unpaid
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Admission Fee:</span>
                  <span className="font-semibold text-white mt-0.5 block">
                    {formatPKR(submittedApplication.admissionFee ?? 3000)}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Monthly Charge:</span>
                  <span className="font-semibold text-white mt-0.5 block">
                    {formatPKR(submittedApplication.monthlyFee ?? 2500)}
                  </span>
                </div>
                <div className="col-span-2 pt-1 border-t border-zinc-800 flex justify-between">
                  <span className="text-zinc-400 font-semibold">Total Payable:</span>
                  <span className="text-[#FF6B00] font-bold text-sm">
                    {formatPKR(submittedApplication.finalPrice)}
                  </span>
                </div>
              </div>
            </div>

            {/* Next Steps Instructions */}
            <div className="max-w-md mx-auto text-left text-xs bg-[#141414] p-4 rounded-xl border border-zinc-800 space-y-2 text-zinc-300">
              <h4 className="font-semibold text-white">Next Steps to Activate Your Membership:</h4>
              <ol className="list-decimal pl-4 space-y-1.5 text-zinc-400">
                <li>Visit the gym reception at <strong>Fatima Center, Top Floor, Main Bazar</strong>.</li>
                <li>Show your Application ID <strong>({submittedApplication.applicationId})</strong>.</li>
                <li>Complete payment of <strong>{formatPKR(submittedApplication.finalPrice)}</strong> in cash or bank transfer.</li>
                <li>The administrator will activate your account and issue your membership card!</li>
              </ol>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <a
                href={`https://wa.me/923059422464?text=${encodeURIComponent(
                  `Assalam-o-Alaikum! I have submitted my gym admission application (#${submittedApplication.applicationId}) on your website for ${submittedApplication.fullName}. Please confirm my review.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3 bg-[#25D366] hover:bg-[#20ba59] text-black font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg"
              >
                <MessageSquare className="w-4 h-4 fill-black" />
                <span>Message Gym on WhatsApp</span>
              </a>

              <Link
                href="/account"
                className="w-full sm:w-auto px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <span>Go to Member Account</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
