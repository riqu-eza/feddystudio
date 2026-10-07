/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useEffect, useState } from "react";

type Booking = {
  id: string;
  name: string;
  phone: string;
  service: string;
  date: string;
  message?: string;
  referral?: string;
  status: string;
  depositType: string;
  depositValue: number;
  depositAmount?: number;
};

export default function BookingsPage() {
  const [rows, setRows] = useState<Booking[]>([]);
  const [busy, setBusy] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/bookings");
    const data = await res.json();
    setRows(data.bookings || []);
  }

  useEffect(() => { load(); }, []);

  async function update(id: string, patch: Partial<Booking>) {
    setBusy(id);
    await fetch(`/api/admin/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    await load();
    setBusy(null);
  }

  async function remove(id: string) {
    if (!confirm("Delete this booking?")) return;
    await fetch(`/api/admin/bookings/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Bookings</h1>
      <div className="bg-card border border-line rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#0f0f0f] text-muted text-left">
            <tr>
              <th className="p-3">Client</th>
              <th className="p-3">Service</th>
              <th className="p-3">Date</th>
              <th className="p-3">Deposit</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((b) => (
              <tr key={b.id} className="border-t border-line align-top">
                <td className="p-3">
                  <div className="font-semibold">{b.name}</div>
                  <div className="text-muted text-xs">{b.phone}</div>
                  {b.referral && (
                    <div className="text-muted text-xs mt-1">via {b.referral}</div>
                  )}
                </td>
                <td className="p-3">{b.service}</td>
                <td className="p-3">{b.date.slice(0, 10)}</td>
                <td className="p-3">
                  <select
                    value={b.depositType}
                    onChange={(e) => update(b.id, { depositType: e.target.value })}
                    className="bg-[#111] border border-[#333] rounded px-2 py-1 text-xs"
                  >
                    <option value="fixed">Fixed (KSh)</option>
                    <option value="percent">Percent (%)</option>
                    <option value="custom">Custom (KSh)</option>
                  </select>
                  <input
                    type="number"
                    defaultValue={b.depositValue}
                    onBlur={(e) =>
                      update(b.id, { depositValue: Number(e.target.value) })
                    }
                    className="block mt-1 w-24 bg-[#111] border border-[#333] rounded px-2 py-1 text-xs"
                  />
                </td>
                <td className="p-3">
                  <span className="text-xs px-2 py-1 rounded bg-[#1c1c1c]">
                    {b.status}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex flex-col gap-1">
                    <button
                      disabled={busy === b.id}
                      onClick={() => update(b.id, { status: "paid" })}
                      className="text-xs bg-gold text-[#111] rounded px-2 py-1 font-semibold"
                    >
                      Mark Paid
                    </button>
                    <button
                      onClick={() => update(b.id, { status: "cancelled" })}
                      className="text-xs border border-line rounded px-2 py-1"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => remove(b.id)}
                      className="text-xs text-red-400 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-muted">
                  No bookings yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}