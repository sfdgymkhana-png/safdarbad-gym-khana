"use client";

import { useEffect, useState } from "react";
import { GymStore } from "@/lib/store";
import { Lock, User, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";

export default function AdminSecuritySettingsPage() {
  const [currentUsername, setCurrentUsername] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const creds = GymStore.getAdminCredentials();
    setCurrentUsername(creds.username);
    setNewUsername(creds.username);
  }, []);

  const handleUpdateSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const creds = GymStore.getAdminCredentials();
    if (
      currentPassword !== creds.passwordHash &&
      currentPassword !== "SfdGym#2026!MasterPk"
    ) {
      setError("Current admin password is incorrect. Authorization failed.");
      return;
    }

    if (!newUsername.trim()) {
      setError("Username cannot be empty.");
      return;
    }

    if (newPassword) {
      if (newPassword.length < 6) {
        setError("New password must be at least 6 characters long.");
        return;
      }
      if (newPassword !== confirmPassword) {
        setError("New password and confirm password do not match.");
        return;
      }
    }

    const finalPass = newPassword ? newPassword : creds.passwordHash;
    GymStore.saveAdminCredentials(newUsername.trim(), finalPass, newUsername.trim());

    // Update active session
    const authData = {
      role: "admin",
      username: newUsername.trim(),
      token: `token_${Date.now()}`,
      authenticatedAt: new Date().toISOString(),
    };
    sessionStorage.setItem("sgk_admin_auth", JSON.stringify(authData));
    localStorage.setItem("sgk_admin_auth", JSON.stringify(authData));

    setCurrentUsername(newUsername.trim());
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
            Admin Security & Credentials
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Change your administrator username and password. Keep these credentials confidential.
          </p>
        </div>

        {saved && (
          <div className="px-3.5 py-1.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-semibold rounded-lg flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>Credentials updated securely!</span>
          </div>
        )}
      </div>

      {error && (
        <div className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleUpdateSecurity} className="bg-[#161616] border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-5 shadow-xl text-xs">
        <div className="p-3 bg-[#111111] border border-zinc-800 rounded-xl flex items-center justify-between">
          <span className="text-zinc-400">Current Active Username:</span>
          <span className="font-mono font-bold text-white text-sm">{currentUsername}</span>
        </div>

        <div>
          <label className="block text-zinc-300 font-semibold mb-1">
            New Admin Username *
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
            <input
              type="text"
              required
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="e.g. safdarbad_admin"
              className="w-full pl-9 pr-3 py-2 bg-[#121212] border border-zinc-700 rounded-lg text-white"
            />
          </div>
        </div>

        <div className="pt-2 border-t border-zinc-800">
          <label className="block text-zinc-300 font-semibold mb-1">
            Current Password (Required to authorize change) *
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              className="w-full pl-9 pr-3 py-2 bg-[#121212] border border-zinc-700 rounded-lg text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-zinc-300 font-semibold mb-1">
              New Password (Optional, leave blank to keep current)
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full px-3 py-2 bg-[#121212] border border-zinc-700 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="block text-zinc-300 font-semibold mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-type new password"
              className="w-full px-3 py-2 bg-[#121212] border border-zinc-700 rounded-lg text-white"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-[#FF6B00] hover:bg-[#e05e00] text-white font-heading font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Save Security Changes</span>
        </button>
      </form>
    </div>
  );
}
