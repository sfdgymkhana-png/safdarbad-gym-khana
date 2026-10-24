"use client";

import { X, Printer, Download, CheckCircle2 } from "lucide-react";
import { PaymentTransaction, SiteSettings } from "@/lib/types";
import { formatPKR } from "@/lib/utils";
import jsPDF from "jspdf";

interface ReceiptModalProps {
  payment: PaymentTransaction | null;
  settings: SiteSettings;
  onClose: () => void;
}

export default function ReceiptModal({ payment, settings, onClose }: ReceiptModalProps) {
  if (!payment) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(settings.gymName || "SAFDARBAD GYM KHAN’A", 105, 20, { align: "center" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(settings.address || "City Safdarabad, Main Bazar, Fatima Center, Top Floor", 105, 28, { align: "center" });
    doc.text(`Contact: ${settings.phone} | WhatsApp: ${settings.whatsapp}`, 105, 34, { align: "center" });

    doc.setLineWidth(0.5);
    doc.line(20, 40, 190, 40);

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("OFFICIAL PAYMENT RECEIPT", 105, 50, { align: "center" });

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`Receipt Number: ${payment.receiptNumber}`, 20, 65);
    doc.text(`Date: ${payment.paymentDate}`, 140, 65);

    doc.text(`Member Name: ${payment.customerName}`, 20, 75);
    doc.text(`Payment ID: ${payment.paymentId}`, 140, 75);

    doc.text(`Payment Method: ${payment.paymentMethod}`, 20, 85);
    doc.text(`Status: ${payment.status}`, 140, 85);

    doc.line(20, 95, 190, 95);

    doc.setFont("helvetica", "bold");
    doc.text("Description", 20, 105);
    doc.text("Amount (PKR)", 150, 105);

    doc.setFont("helvetica", "normal");
    doc.text("Gym Membership Subscription Fee", 20, 115);
    doc.text(formatPKR(payment.originalAmount), 150, 115);

    if (payment.discountAmount > 0) {
      doc.text("Discount Applied", 20, 125);
      doc.text(`- ${formatPKR(payment.discountAmount)}`, 150, 125);
    }

    doc.line(20, 135, 190, 135);

    doc.setFont("helvetica", "bold");
    doc.text("Total Payable:", 20, 145);
    doc.text(formatPKR(payment.finalAmountPayable), 150, 145);

    doc.text("Amount Received:", 20, 155);
    doc.text(formatPKR(payment.amountReceived), 150, 155);

    doc.text("Remaining Balance Due:", 20, 165);
    doc.text(formatPKR(payment.remainingBalance), 150, 165);

    doc.line(20, 175, 190, 175);

    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.text(`Recorded By: ${payment.recordedBy} | Safdarbad Gym Khan'a System`, 20, 185);
    if (payment.internalNote) {
      doc.text(`Note: ${payment.internalNote}`, 20, 192);
    }

    doc.setFont("helvetica", "normal");
    doc.text("Thank you for training with Safdarbad Gym Khan’a!", 105, 210, { align: "center" });

    doc.save(`${payment.receiptNumber}.pdf`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#181818] border border-zinc-700 max-w-xl w-full rounded-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150">
        {/* Header Actions */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#202020] border-b border-zinc-700">
          <div className="flex items-center gap-2 text-white">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="font-heading font-bold text-lg">Official Payment Receipt</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 text-zinc-300 hover:text-white bg-[#282828] hover:bg-zinc-700 rounded transition-colors"
              title="Print Receipt"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#FF6B00] hover:bg-[#e05e00] text-white rounded transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Body */}
        <div id="receipt-print-area" className="p-6 space-y-6 text-zinc-300 text-sm">
          {/* Gym Branding */}
          <div className="text-center pb-4 border-b border-zinc-800">
            <h2 className="font-heading text-xl font-bold text-white tracking-wider">
              {settings.gymName}
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">{settings.address}</p>
            <p className="text-xs text-zinc-400">Phone: {settings.phone} | WhatsApp: {settings.whatsapp}</p>
          </div>

          {/* Receipt Info */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-[#121212] p-4 rounded-lg border border-zinc-800">
            <div>
              <span className="text-zinc-500 block">Receipt Number</span>
              <span className="font-bold text-white text-sm">{payment.receiptNumber}</span>
            </div>
            <div className="text-right">
              <span className="text-zinc-500 block">Payment Date</span>
              <span className="font-medium text-white">{payment.paymentDate}</span>
            </div>
            <div>
              <span className="text-zinc-500 block">Member Name</span>
              <span className="font-medium text-white">{payment.customerName}</span>
            </div>
            <div className="text-right">
              <span className="text-zinc-500 block">Payment Method</span>
              <span className="font-semibold text-[#FFC857]">{payment.paymentMethod}</span>
            </div>
          </div>

          {/* Breakdown Table */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-zinc-800">
              <span className="text-zinc-400">Monthly Membership Fee</span>
              <span className="text-white font-medium">{formatPKR(payment.originalAmount)}</span>
            </div>
            {payment.discountAmount > 0 && (
              <div className="flex justify-between py-1.5 border-b border-zinc-800 text-emerald-400">
                <span>Discount Applied</span>
                <span>- {formatPKR(payment.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between py-1.5 border-b border-zinc-800 font-semibold text-white">
              <span>Final Amount Payable</span>
              <span>{formatPKR(payment.finalAmountPayable)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-zinc-700 text-sm font-bold text-emerald-400 bg-emerald-500/10 px-2 rounded">
              <span>Amount Received</span>
              <span>{formatPKR(payment.amountReceived)}</span>
            </div>
            <div className="flex justify-between py-1.5 text-xs text-zinc-400">
              <span>Remaining Balance Due</span>
              <span className={payment.remainingBalance > 0 ? "text-amber-400 font-bold" : "text-emerald-400 font-medium"}>
                {formatPKR(payment.remainingBalance)}
              </span>
            </div>
          </div>

          {payment.internalNote && (
            <p className="text-xs text-zinc-500 italic bg-[#141414] p-2.5 rounded border border-zinc-800">
              Note: {payment.internalNote}
            </p>
          )}

          <div className="text-center pt-2 text-[11px] text-zinc-500 border-t border-zinc-800">
            Recorded by {payment.recordedBy} • Safdarbad Gym Khan’a System Receipt
          </div>
        </div>
      </div>
    </div>
  );
}
