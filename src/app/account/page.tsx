"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { GymStore } from "@/lib/store";
import {
  AdmissionApplication,
  Membership,
  PaymentTransaction,
  SystemNotification,
} from "@/lib/types";
import {
  formatPKR,
  getDaysRemaining,
  getMembershipBadgeClass,
  getPaymentBadgeClass,
  getApplicationBadgeClass,
} from "@/lib/utils";
import {
  User,
  Shield,
  Calendar,
  CreditCard,
  Bell,
  LogOut,
  Clock,
  Phone,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export default function CustomerAccountPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<{ email: string; name: string; userId: string } | null>(null);
  const [application, setApplication] = useState<AdmissionApplication | null>(null);
  const [membership, setMembership] = useState<Membership | null>(null);
  const [payments, setPayments] = useState<PaymentTransaction[]>([]);
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("sgk_current_user");
    if (!saved) {
      router.push("/login");
      return;
    }
    const user = JSON.parse(saved);
    setCurrentUser(user);

    // Retrieve records matching email or user
    const apps = GymStore.getApplications();
    const appMatch = apps.find(
      (a) => a.email.toLowerCase() === user.email.toLowerCase() || a.userId === user.userId
    );
    if (appMatch) {
      setApplication(appMatch);
    } else {
      // Create a default linked record if demo
      setApplication(apps[0] || null);
    }

    const mems = GymStore.getMemberships();
    const memMatch = mems.find(
      (m) => m.customerEmail.toLowerCase() === user.email.toLowerCase() || m.userId === user.userId
    );
    setMembership(memMatch || mems[0] || null);

    const allPayments = GymStore.getPayments();
    setPayments(allPayments);

    setNotifications(GymStore.getNotifications());
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("sgk_current_user");
    router.push("/login");
  };

  if (!currentUser) {
    return <div className="min-h-screen bg-[#101010] flex items-center justify-center text-white">Loading account...</div>;
  }

  const daysLeft = membership ? getDaysRemaining(membership.endDate) : 0;

  return (
    <div className="bg-[#101010] text-white min-h-screen flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto pt-28 pb-20 px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-[#181818] border border-zinc-800 rounded-2xl shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#FF6B00]/20 border border-[#FF6B00] text-[#FF6B00] flex items-center justify-center font-heading text-2xl font-bold">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <span className="text-xs text-zinc-400 block">Member Account</span>
              <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
                {currentUser.name}
              </h1>
              <span className="text-xs text-[#FFC857]">{currentUser.email}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/923059422464"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Contact Gym Desk</span>
            </a>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-[#252525] hover:bg-red-950/60 hover:text-red-400 text-zinc-300 border border-zinc-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Status Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Membership Status */}
          <div className="bg-[#161616] border border-zinc-800 rounded-xl p-5 space-y-4 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Membership Plan
              </span>
              <Shield className="w-4 h-4 text-[#FF6B00]" />
            </div>

            {membership ? (
              <div className="space-y-3">
                <h3 className="font-heading text-lg font-bold text-white">{membership.planName}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-400">Status:</span>
                  <span className={`px-2.5 py-0.5 text-xs font-bold rounded ${getMembershipBadgeClass(membership.membershipStatus)}`}>
                    {membership.membershipStatus}
                  </span>
                </div>
                <div className="pt-2 border-t border-zinc-800/80 text-xs space-y-1 text-zinc-400">
                  <div className="flex justify-between">
                    <span>Valid From:</span>
                    <span className="text-white">{membership.startDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Expires On:</span>
                    <span className="text-white font-medium">{membership.endDate}</span>
                  </div>
                  <div className="flex justify-between pt-1 font-semibold">
                    <span>Days Remaining:</span>
                    <span className={daysLeft <= 3 ? "text-amber-400" : "text-emerald-400"}>
                      {daysLeft > 0 ? `${daysLeft} days` : "Expired"}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-zinc-400">No active membership subscription linked yet.</p>
            )}
          </div>

          {/* Card 2: Application Details */}
          <div className="bg-[#161616] border border-zinc-800 rounded-xl p-5 space-y-4 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Admission Application
              </span>
              <Calendar className="w-4 h-4 text-[#FFC857]" />
            </div>

            {application ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-400">Application ID:</span>
                  <span className="font-heading font-bold text-sm text-white tracking-wider">
                    {application.applicationId}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-400">Review Status:</span>
                  <span className={`px-2.5 py-0.5 text-xs font-bold rounded ${getApplicationBadgeClass(application.applicationStatus)}`}>
                    {application.applicationStatus}
                  </span>
                </div>
                <div className="pt-2 border-t border-zinc-800/80 text-xs space-y-1 text-zinc-400">
                  <div className="flex justify-between">
                    <span>Plan Requested:</span>
                    <span className="text-white">{application.requestedPlanName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Requested Date:</span>
                    <span className="text-white">{application.requestedStartDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Agreed Fee:</span>
                    <span className="text-[#FF6B00] font-bold">{formatPKR(application.finalPrice)}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-xs text-zinc-400 space-y-2">
                <p>You have not submitted an admission application yet.</p>
                <Link href="/admission" className="text-[#FF6B00] font-bold hover:underline block">
                  Submit Admission Application &rarr;
                </Link>
              </div>
            )}
          </div>

          {/* Card 3: Financial & Due Balance */}
          <div className="bg-[#161616] border border-zinc-800 rounded-xl p-5 space-y-4 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Payment Status
              </span>
              <CreditCard className="w-4 h-4 text-emerald-400" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400">Current Balance:</span>
                <span className="font-heading font-extrabold text-xl text-white">
                  {formatPKR(membership ? membership.balanceDue : (application?.finalPrice || 0))}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400">Payment:</span>
                <span className={`px-2.5 py-0.5 text-xs font-bold rounded ${getPaymentBadgeClass(membership ? membership.paymentStatus : (application?.paymentStatus || "Unpaid"))}`}>
                  {membership ? membership.paymentStatus : (application?.paymentStatus || "Unpaid")}
                </span>
              </div>

              <p className="text-[11px] text-zinc-400 pt-2 border-t border-zinc-800">
                Payments are recorded at the gym desk at Fatima Center or via authorized bank transfer.
              </p>
            </div>
          </div>
        </div>

        {/* Payment History Table */}
        <div className="bg-[#181818] border border-zinc-800 rounded-xl p-6 space-y-4 shadow-xl">
          <h3 className="font-heading text-lg font-bold text-white border-b border-zinc-800 pb-3 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-[#FF6B00]" />
            <span>Payment History & Receipts</span>
          </h3>

          {payments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-500 uppercase">
                    <th className="py-2.5 px-3">Receipt #</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Method</th>
                    <th className="py-2.5 px-3">Amount</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {payments.map((p) => (
                    <tr key={p.paymentId} className="hover:bg-zinc-800/30">
                      <td className="py-3 px-3 font-semibold text-white">{p.receiptNumber}</td>
                      <td className="py-3 px-3 text-zinc-400">{p.paymentDate}</td>
                      <td className="py-3 px-3 text-amber-400">{p.paymentMethod}</td>
                      <td className="py-3 px-3 font-bold text-emerald-400">{formatPKR(p.amountReceived)}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded ${getPaymentBadgeClass(p.status)}`}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs text-zinc-500 py-4 text-center">No payment transactions recorded yet.</p>
          )}
        </div>

        {/* Notifications */}
        <div className="bg-[#181818] border border-zinc-800 rounded-xl p-6 space-y-4 shadow-xl">
          <h3 className="font-heading text-lg font-bold text-white border-b border-zinc-800 pb-3 flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#FFC857]" />
            <span>Gym Announcements & Alerts</span>
          </h3>

          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n.notificationId}
                className="p-3.5 bg-[#141414] border border-zinc-800 rounded-lg flex items-start gap-3 text-xs"
              >
                <div className="p-2 rounded bg-[#FF6B00]/10 text-[#FF6B00] shrink-0 mt-0.5">
                  <Bell className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="font-semibold text-white">{n.title}</h4>
                  <p className="text-zinc-400">{n.message}</p>
                  <span className="text-[10px] text-zinc-500 block pt-1">
                    {new Date(n.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
