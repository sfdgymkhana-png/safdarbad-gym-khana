"use client";

import { useEffect, useState } from "react";
import { GymStore } from "@/lib/store";
import { SystemNotification } from "@/lib/types";
import { Bell, Send, CheckCircle2, X } from "lucide-react";

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const loadData = () => {
    setNotifications(GymStore.getNotifications());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    GymStore.createNotification("all", title.trim(), message.trim(), "announcement");
    setTitle("");
    setMessage("");
    setSent(true);
    setTimeout(() => setSent(false), 2500);
    loadData();
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
            Notifications & Broadcasts
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Send announcements to customer dashboards and review automated system events.
          </p>
        </div>

        {sent && (
          <div className="px-3.5 py-1.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-semibold rounded-lg flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>Broadcast sent to all members!</span>
          </div>
        )}
      </div>

      {/* Broadcast Form */}
      <div className="bg-[#161616] border border-zinc-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <h3 className="font-heading text-base font-bold text-white flex items-center gap-2">
          <Send className="w-4 h-4 text-[#FF6B00]" />
          <span>Publish New Announcement to Member Accounts</span>
        </h3>

        <form onSubmit={handleBroadcast} className="space-y-4 text-xs">
          <div>
            <label className="block text-zinc-300 font-semibold mb-1">Announcement Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Special Holiday Workout Timings"
              className="w-full px-3 py-2 bg-[#121212] border border-zinc-700 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="block text-zinc-300 font-semibold mb-1">Message Content *</label>
            <textarea
              rows={3}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Full announcement message..."
              className="w-full px-3 py-2 bg-[#121212] border border-zinc-700 rounded-lg text-white"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-[#FF6B00] hover:bg-[#e05e00] text-white font-bold uppercase rounded-lg transition-colors flex items-center gap-2"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Announcement</span>
          </button>
        </form>
      </div>

      {/* History Log */}
      <div className="bg-[#161616] border border-zinc-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <h3 className="font-heading text-base font-bold text-white border-b border-zinc-800 pb-3 flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#FFC857]" />
          <span>Recent System Notifications</span>
        </h3>

        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.notificationId}
              className="p-3.5 bg-[#121212] border border-zinc-800 rounded-xl text-xs space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">{n.title}</span>
                <span className="text-[10px] text-zinc-500 font-mono">
                  {new Date(n.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="text-zinc-400">{n.message}</p>
              <div className="pt-1 flex items-center gap-2 text-[10px] text-zinc-500">
                <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 uppercase">
                  {n.type}
                </span>
                <span>Recipient: {n.recipientId}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
