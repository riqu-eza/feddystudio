/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";

type RecentBooking = {
  id: string;
  name: string;
  service: string;
  date: string;
  status: string;
};

type Stats = {
  today: number;
  pending: number;
  paidCount: number;
  revenue: number;
  total: number;
  recent: RecentBooking[];
};

export default function DashboardPage() {
  const [data, setData] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/stats", { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed");
      setData(json);
    } catch (e: any) {
      setError(e.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        <p className="text-muted">Loading stats…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        <div className="bg-card border border-red-700 rounded-lg p-5">
          <p className="text-red-400 mb-2">Could not load stats: {error}</p>
          <button
            onClick={load}
            className="text-xs border border-line rounded px-3 py-1 mt-2"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const cards = [
    { label: "Bookings Today", value: data?.today ?? 0 },
    { label: "Pending Requests", value: data?.pending ?? 0 },
    { label: "Paid Bookings", value: data?.paidCount ?? 0 },
    {
      label: "Total Revenue (KSh)",
      value: (data?.revenue ?? 0).toLocaleString(),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button
          onClick={load}
          className="text-xs border border-line rounded px-3 py-1 hover:bg-[#1c1c1c]"
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {cards.map((c) => (
          <div key={c.label} className="bg-card border border-line rounded-lg p-5">
            <div className="text-xs uppercase tracking-wider text-muted">
              {c.label}
            </div>
            <div className="text-2xl font-bold mt-2 text-gold">{c.value}</div>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-4">Recent Bookings</h2>
      <div className="bg-card border border-line rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#0f0f0f] text-muted text-left">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Service</th>
              <th className="p-3">Date</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {(data?.recent ?? []).map((b) => (
              <tr key={b.id} className="border-t border-line">
                <td className="p-3">{b.name}</td>
                <td className="p-3">{b.service}</td>
                <td className="p-3">{b.date}</td>
                <td className="p-3">
                  <span className="text-xs px-2 py-1 rounded bg-[#1c1c1c]">
                    {b.status}
                  </span>
                </td>
              </tr>
            ))}
            {(data?.recent ?? []).length === 0 && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-muted">
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
