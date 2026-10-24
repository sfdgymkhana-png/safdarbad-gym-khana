"use client";

import { useEffect, useState } from "react";
import { GymStore } from "@/lib/store";
import { AuditLogEntry } from "@/lib/types";
import { ScrollText, Search, Shield, Clock } from "lucide-react";

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLogs(GymStore.getAuditLogs());
  }, []);

  const filtered = logs.filter(
    (l) =>
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.actorName.toLowerCase().includes(search.toLowerCase()) ||
      l.entityId.toLowerCase().includes(search.toLowerCase()) ||
      l.changeSummary.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
            Security & Action Audit Logs
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Immutable tracking of financial entries, member renewals, pricing changes, and admin operations.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search audit trail..."
            className="w-full pl-9 pr-4 py-2 bg-[#1C1C1C] border border-zinc-700 rounded-lg text-xs text-white focus:outline-none"
          />
        </div>
      </div>

      <div className="bg-[#161616] border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#121212] border-b border-zinc-800 text-zinc-400 uppercase font-heading tracking-wider">
                <th className="py-3 px-4">Log ID & Timestamp</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Entity</th>
                <th className="py-3 px-4">Summary</th>
                <th className="py-3 px-4">Reason / Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filtered.map((log) => (
                <tr key={log.logId} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-mono text-white block font-semibold">{log.logId}</span>
                    <span className="text-[10px] text-zinc-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-zinc-200">{log.actorName}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-[#FF6B00]/10 text-[#FF6B00] border border-[#FF6B00]/20 font-mono font-bold text-[11px]">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-zinc-400 uppercase text-[10px] block">{log.entityType}</span>
                    <span className="text-white font-mono">{log.entityId}</span>
                  </td>
                  <td className="py-3.5 px-4 text-zinc-300 max-w-xs">{log.changeSummary}</td>
                  <td className="py-3.5 px-4 text-zinc-500 italic max-w-xs">{log.reason || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
