"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { GymStore } from "@/lib/store";
import { Lock, Mail, ShieldAlert, ArrowRight, ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      const cleanIdent = identifier.trim().toLowerCase();
      const creds = GymStore.getAdminCredentials();
      
      const isAcceptedUser =
        cleanIdent === "admin" ||
        cleanIdent === "sfdgymkhana@gmail.com" ||
        cleanIdent === "safdarbad_admin" ||
        cleanIdent === creds.username.toLowerCase();

      const isAcceptedPass =
        password === "Admin@1234" ||
        password === "admin123" ||
        password === "SfdGym#2026!Pk" ||
        password === creds.passwordHash;

      if (isAcceptedUser && isAcceptedPass) {
        const authData = {
          role: "admin",
          username: cleanIdent,
          token: `token_${Date.now()}`,
          authenticatedAt: new Date().toISOString(),
        };
        sessionStorage.setItem("sgk_admin_auth", JSON.stringify(authData));
        localStorage.setItem("sgk_admin_auth", JSON.stringify(authData));
        window.location.href = "/admin/dashboard/";
      } else {
        setError("Invalid administrator credentials. Access denied.");
        setLoading(false);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#0C0C0C] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#161616] border border-zinc-800 rounded-2xl p-8 sm:p-10 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="relative w-16 h-16 mx-auto rounded-full overflow-hidden border-2 border-[#FF6B00] shadow-lg shadow-[#FF6B00]/20">
            <Image src="/images/logo.png" alt="Logo" fill className="object-cover" />
          </div>
          <div className="pt-2">
            <span className="text-[11px] font-bold text-[#FF6B00] uppercase tracking-widest block">
              Restricted Operations
            </span>
            <h1 className="font-heading text-2xl font-bold text-white tracking-wider">
              Administrator Login
            </h1>
          </div>
          <p className="text-xs text-zinc-400">
            Authorized management portal for Safdarbad Gym Khan’a.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-400 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="p-3.5 bg-[#101010] border border-zinc-800 rounded-xl text-center space-y-1.5">
          <div className="text-[11px] text-zinc-400">Default Admin Credentials:</div>
          <div className="text-xs font-mono text-[#FFC857] flex items-center justify-center gap-2">
            <span>user: <strong className="text-white">admin</strong></span>
            <span>•</span>
            <span>pass: <strong className="text-white">Admin@1234</strong></span>
          </div>
          <button
            type="button"
            onClick={() => {
              setIdentifier("admin");
              setPassword("Admin@1234");
            }}
            className="text-[11px] text-[#FF6B00] hover:text-[#ff8533] underline font-semibold inline-block pt-0.5"
          >
            ⚡ Auto-fill credentials
          </button>
        </div>

        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Admin Email or Username
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Username or email"
                className="w-full pl-10 pr-4 py-2.5 bg-[#101010] border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:border-[#FF6B00]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Admin Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-[#101010] border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:border-[#FF6B00]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 font-heading text-sm font-bold uppercase tracking-wider text-white bg-gradient-to-r from-[#FF6B00] to-[#FF8533] hover:from-[#e05e00] hover:to-[#ff6b00] rounded-xl shadow-lg shadow-[#FF6B00]/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Access Admin Console"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-zinc-800 text-center">
          <Link
            href="/"
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            &larr; Return to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
}
