"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { GymStore } from "@/lib/store";
import { Lock, Mail, ArrowRight, AlertCircle, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      // Check if user has an application or membership
      const apps = GymStore.getApplications();
      const matched = apps.find((a) => a.email.toLowerCase() === email.trim().toLowerCase());

      if (matched || email.includes("@")) {
        // Persist current session
        localStorage.setItem("sgk_current_user", JSON.stringify({
          email: email.trim(),
          name: matched ? matched.fullName : "Gym Member",
          userId: matched ? matched.userId : "USR-100",
        }));
        router.push("/account");
      } else {
        setError("Invalid email or password. Please check your credentials or register.");
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div className="bg-[#101010] text-white min-h-screen flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 flex items-center justify-center pt-28 pb-16 px-4">
        <div className="max-w-md w-full bg-[#181818] border border-zinc-800 rounded-2xl p-8 sm:p-10 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="relative w-14 h-14 mx-auto rounded-full overflow-hidden border-2 border-[#FF6B00]">
              <Image src="/images/logo.png" alt="Logo" fill className="object-cover" />
            </div>
            <h1 className="font-heading text-2xl font-bold text-white tracking-wider">
              Member Portal Login
            </h1>
            <p className="text-xs text-zinc-400">
              Access your membership status, admission details, and payment history.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#121212] border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:border-[#FF6B00]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-zinc-300">Password</label>
                <Link
                  href="/forgot-password"
                  className="text-[11px] text-[#FFC857] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#121212] border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:border-[#FF6B00]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 font-heading text-sm font-bold uppercase tracking-wider text-white bg-gradient-to-r from-[#FF6B00] to-[#FF8533] hover:from-[#e05e00] hover:to-[#ff6b00] rounded-xl shadow-lg shadow-[#FF6B00]/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? "Authenticating..." : "Sign In to Account"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-zinc-800 text-center space-y-3">
            <p className="text-xs text-zinc-400">
              Don&apos;t have an account or haven&apos;t applied yet?
            </p>
            <Link
              href="/admission"
              className="inline-block w-full py-2.5 text-xs font-bold uppercase tracking-wider text-zinc-200 bg-[#222222] hover:bg-zinc-700 border border-zinc-700 rounded-lg transition-colors"
            >
              Apply For Admission Online
            </Link>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
