import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { MembershipStatus, PaymentStatus, ApplicationStatus } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPKR(amount: number): string {
  if (isNaN(amount)) return "PKR 0";
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(amount).replace("PKR", "PKR ");
}

/**
 * Calculates end date by adding calendar months safely.
 * Handles month-end rollovers (e.g., Jan 31 + 1 month -> Feb 28 or 29, not March).
 */
export function addMonthsSafely(startDateStr: string, months: number): string {
  const [year, month, day] = startDateStr.split("-").map(Number);
  const start = new Date(year, month - 1, day);
  
  const targetMonth = start.getMonth() + months;
  const targetYear = start.getFullYear() + Math.floor(targetMonth / 12);
  const normalizedMonth = ((targetMonth % 12) + 12) % 12;
  
  // Find last day of target month
  const lastDayOfTargetMonth = new Date(targetYear, normalizedMonth + 1, 0).getDate();
  const targetDay = Math.min(day, lastDayOfTargetMonth);
  
  const targetDate = new Date(targetYear, normalizedMonth, targetDay);
  return targetDate.toISOString().split("T")[0];
}

export function getDaysRemaining(endDateStr: string): number {
  if (!endDateStr) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const end = new Date(endDateStr);
  end.setHours(0, 0, 0, 0);
  
  const diffTime = end.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function generateCustomId(prefix: string): string {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `${prefix}-${randomNum}`;
}

export function getMembershipBadgeClass(status: MembershipStatus): string {
  switch (status) {
    case "Active":
      return "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
    case "Expiring Soon":
      return "bg-amber-500/20 text-amber-400 border border-amber-500/30";
    case "Expired":
      return "bg-red-500/20 text-red-400 border border-red-500/30";
    case "Suspended":
      return "bg-purple-500/20 text-purple-400 border border-purple-500/30";
    case "Pending Approval":
    default:
      return "bg-orange-500/20 text-orange-400 border border-orange-500/30";
  }
}

export function getPaymentBadgeClass(status: PaymentStatus): string {
  switch (status) {
    case "Paid":
      return "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
    case "Partially Paid":
      return "bg-amber-500/20 text-amber-400 border border-amber-500/30";
    case "Unpaid":
      return "bg-red-500/20 text-red-400 border border-red-500/30";
    case "Refunded":
      return "bg-blue-500/20 text-blue-400 border border-blue-500/30";
    case "Cancelled":
    default:
      return "bg-zinc-500/20 text-zinc-400 border border-zinc-500/30";
  }
}

export function getApplicationBadgeClass(status: ApplicationStatus): string {
  switch (status) {
    case "Approved":
      return "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
    case "Rejected":
      return "bg-red-500/20 text-red-400 border border-red-500/30";
    case "Pending Review":
    default:
      return "bg-orange-500/20 text-orange-400 border border-orange-500/30";
  }
}
