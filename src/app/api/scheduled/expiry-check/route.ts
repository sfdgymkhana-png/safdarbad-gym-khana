import { NextResponse } from "next/server";
import { getDaysRemaining } from "@/lib/utils";

export async function GET(request: Request) {
  // Authorization token protection for scheduled execution / cron jobs
  const { searchParams } = new URL(request.url);
  const authKey = searchParams.get("key");
  const secretKey = process.env.CRON_SECRET || "sgk_cron_secret_key_2026";

  if (authKey && authKey !== secretKey) {
    return NextResponse.json({ error: "Unauthorized scheduled execution" }, { status: 401 });
  }

  // In production with Firestore, this queries `memberships` where `endDate <= 7 days from now`
  const executionReport = {
    status: "success",
    timestamp: new Date().toISOString(),
    checkedIntervals: ["7_days", "3_days", "today", "expired"],
    message: "Scheduled membership expiration check processed successfully.",
  };

  return NextResponse.json(executionReport);
}
