"use client";

import { useEffect, useState } from "react";
import { GymStore } from "@/lib/store";
import { PaymentTransaction, SiteSettings } from "@/lib/types";
import { formatPKR, getPaymentBadgeClass } from "@/lib/utils";
import ReceiptModal from "@/components/ReceiptModal";
import {
  CreditCard,
  Search,
  Plus,
  Printer,
  Download,
  CheckCircle2,
  AlertTriangle,
  X,
} from "lucide-react";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<PaymentTransaction[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(GymStore.getSettings());
  const [searchQuery, setSearchQuery] = useState("");
  const [methodFilter, setMethodFilter] = useState("All");

  // Receipt Modal
  const [activeReceipt, setActiveReceipt] = useState<PaymentTransaction | null>(null);

  // New Payment Modal
  const [showNewPayModal, setShowNewPayModal] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [amountReceived, setAmountReceived] = useState(2500);
  const [paymentMethod, setPaymentMethod] = useState<PaymentTransaction["paymentMethod"]>("Cash");
  const [refNumber, setRefNumber] = useState("");
  const [note, setNote] = useState("");

  const loadData = () => {
    setPayments(GymStore.getPayments());
    setSettings(GymStore.getSettings());
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = payments.filter((p) => {
    const matchesSearch =
      p.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.paymentId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMethod = methodFilter === "All" || p.paymentMethod === methodFilter;
    return matchesSearch && matchesMethod;
  });

  const totalCollected = payments.reduce((sum, p) => sum + p.amountReceived, 0);

  const handleRecordNewPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || amountReceived <= 0) return;

    const newPayment = GymStore.recordPayment({
      userId: `USR-${Date.now().toString().slice(-5)}`,
      customerName: customerName.trim(),
      membershipId: selectedMemberId || "MEM-DIRECT",
      paymentDate: new Date().toISOString().split("T")[0],
      paymentMethod,
      originalAmount: amountReceived,
      discountAmount: 0,
      finalAmountPayable: amountReceived,
      amountReceived: Number(amountReceived),
      remainingBalance: 0,
      status: "Paid",
      referenceNumber: refNumber.trim() || undefined,
      internalNote: note.trim() || undefined,
      recordedBy: "Administrator",
    });

    setShowNewPayModal(false);
    setCustomerName("");
    setRefNumber("");
    setNote("");
    loadData();
    setActiveReceipt(newPayment);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
            Payment & Offline Billing
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Record manual cash counter transactions, bank transfers, and print official receipts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="flex-1 sm:flex-none px-4 py-2 bg-[#161616] border border-zinc-800 rounded-lg text-xs flex items-center justify-between sm:justify-start gap-2">
            <span className="text-zinc-500">Total Collected:</span>
            <span className="font-heading font-extrabold text-emerald-400 text-sm">
              {formatPKR(totalCollected)}
            </span>
          </div>
          <button
            onClick={() => setShowNewPayModal(true)}
            className="flex-1 sm:flex-none px-4 py-2 bg-[#FF6B00] hover:bg-[#e05e00] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-md flex items-center justify-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Record Payment</span>
          </button>
        </div>
      </div>

      {/* Filter row */}
      <div className="p-4 bg-[#141414] border border-zinc-800 rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search payments by member name, receipt #, or payment ID..."
            className="w-full pl-9 pr-4 py-2 bg-[#1C1C1C] border border-zinc-700 rounded-lg text-xs text-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400 shrink-0">Payment Method:</span>
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="w-full px-3 py-2 bg-[#1C1C1C] border border-zinc-700 rounded-lg text-xs text-white focus:outline-none"
          >
            <option value="All">All Methods</option>
            <option value="Cash">Cash (Counter)</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="EasyPaisa">EasyPaisa</option>
            <option value="JazzCash">JazzCash</option>
          </select>
        </div>
      </div>

      {/* Mobile Transactions Cards (Visible on screens < md) */}
      <div className="block md:hidden space-y-3">
        {filtered.map((p) => (
          <div
            key={p.paymentId}
            className="bg-[#161616] border border-zinc-800 rounded-xl p-4 space-y-3 shadow-lg"
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-heading font-bold text-white text-sm">{p.customerName}</h4>
                <span className="text-[10px] text-zinc-500 font-mono block">Receipt #{p.receiptNumber}</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${getPaymentBadgeClass(p.status)}`}>
                {p.status}
              </span>
            </div>

            <div className="p-2.5 bg-[#111111] rounded-lg border border-zinc-800/80 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-zinc-500 text-[10px] uppercase block">Date:</span>
                <span className="text-zinc-300">{p.paymentDate}</span>
              </div>
              <div>
                <span className="text-zinc-500 text-[10px] uppercase block">Method:</span>
                <span className="text-amber-400 font-medium">{p.paymentMethod}</span>
              </div>
              <div>
                <span className="text-zinc-500 text-[10px] uppercase block">Amount:</span>
                <span className="font-bold text-emerald-400 text-sm">{formatPKR(p.amountReceived)}</span>
              </div>
              <div>
                <span className="text-zinc-500 text-[10px] uppercase block">Staff:</span>
                <span className="text-zinc-400">{p.recordedBy}</span>
              </div>
            </div>

            <button
              onClick={() => setActiveReceipt(p)}
              className="w-full py-2 bg-[#252525] hover:bg-zinc-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-zinc-700"
            >
              <Printer className="w-3.5 h-3.5 text-[#FFC857]" />
              <span>View & Print Receipt</span>
            </button>
          </div>
        ))}
      </div>

      {/* Desktop Transactions Table (Visible on md and up) */}
      <div className="hidden md:block bg-[#161616] border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#121212] border-b border-zinc-800 text-zinc-400 uppercase font-heading tracking-wider">
                <th className="py-3 px-4">Receipt #</th>
                <th className="py-3 px-4">Member Name</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Amount Received</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Recorded By</th>
                <th className="py-3 px-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filtered.map((p) => (
                <tr key={p.paymentId} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-semibold text-white">
                    {p.receiptNumber}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-white block text-sm">{p.customerName}</span>
                    <span className="text-[11px] text-zinc-500 font-mono">{p.paymentId}</span>
                  </td>
                  <td className="py-3.5 px-4 text-zinc-400">{p.paymentDate}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold">
                      {p.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-emerald-400 text-sm">
                    {formatPKR(p.amountReceived)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded font-semibold ${getPaymentBadgeClass(p.status)}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-zinc-400">{p.recordedBy}</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setActiveReceipt(p)}
                      className="px-3 py-1.5 bg-[#252525] hover:bg-zinc-700 text-white rounded text-xs font-semibold flex items-center gap-1.5 ml-auto transition-colors"
                      title="View & Print Official Receipt"
                    >
                      <Printer className="w-3.5 h-3.5 text-[#FFC857]" />
                      <span>View Receipt</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      {showNewPayModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#181818] border border-zinc-700 max-w-md w-full rounded-2xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-heading text-lg font-bold text-white">Record Counter Payment</h3>
              <button onClick={() => setShowNewPayModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordNewPayment} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Customer / Member Name *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Tariq Mehmood"
                  className="w-full px-3 py-2 bg-[#121212] border border-zinc-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Amount Received (PKR) *</label>
                <input
                  type="number"
                  required
                  value={amountReceived}
                  onChange={(e) => setAmountReceived(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#121212] border border-zinc-700 rounded-lg text-white font-bold text-sm"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentTransaction["paymentMethod"])}
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
                <label className="block text-zinc-300 font-semibold mb-1">Reference / Transaction ID (Optional)</label>
                <input
                  type="text"
                  value={refNumber}
                  onChange={(e) => setRefNumber(e.target.value)}
                  placeholder="e.g. TRX-90219"
                  className="w-full px-3 py-2 bg-[#121212] border border-zinc-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Internal Note (Optional)</label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Paid cash for November"
                  className="w-full px-3 py-2 bg-[#121212] border border-zinc-700 rounded-lg text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase rounded-lg transition-colors"
              >
                Save Payment & Issue Receipt
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Official Receipt Modal */}
      <ReceiptModal
        payment={activeReceipt}
        settings={settings}
        onClose={() => setActiveReceipt(null)}
      />
    </div>
  );
}
