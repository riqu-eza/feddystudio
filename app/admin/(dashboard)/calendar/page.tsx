/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useEffect, useState } from "react";

export default function AdminCalendarPage() {
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [rows, setRows] = useState<{ id: string; date: string; reason?: string }[]>([]);

  async function load() {
    const res = await fetch("/api/admin/block-date");
    const data = await res.json();
    setRows(data.blocked || []);
  }

  useEffect(() => { load(); }, []);

  async function block() {
    if (!date) return;
    await fetch("/api/admin/block-date", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, reason }),
    });
    setDate("");
    setReason("");
    load();
  }

  async function unblock(d: string) {
    await fetch("/api/admin/block-date", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: d }),
    });
    load();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Block Dates</h1>

      <div className="bg-card border border-line rounded-lg p-5 mb-6 flex gap-3 flex-wrap items-end">
        <div>
          <label className="text-xs text-muted block mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-[#111] border border-[#333] rounded px-3 py-2"
          />
        </div>
        <div className="flex-1 min-w-50">
          <label className="text-xs text-muted block mb-1">Reason (optional)</label>
          <input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Equipment maintenance"
            className="w-full bg-[#111] border border-[#333] rounded px-3 py-2"
          />
        </div>
        <button
          onClick={block}
          className="bg-gold text-[#111] font-bold rounded px-5 py-2"
        >
          Block
        </button>
      </div>

      <div className="bg-card border border-line rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#0f0f0f] text-muted text-left">
            <tr>
              <th className="p-3">Date</th>
              <th className="p-3">Reason</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-line">
                <td className="p-3">{r.date.slice(0, 10)}</td>
                <td className="p-3 text-muted">{r.reason || "—"}</td>
                <td className="p-3">
                  <button
                    onClick={() => unblock(r.date.slice(0, 10))}
                    className="text-xs text-red-400 hover:underline"
                  >
                    Unblock
                  </button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={3} className="p-6 text-center text-muted">
                  No blocked dates.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}