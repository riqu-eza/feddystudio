/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useEffect, useState } from "react";

type Service = {
  id: string;
  icon: string;
  title: string;
  description: string;
  sortOrder: number;
  published: boolean;
};

export default function ServicesAdmin() {
  const [rows, setRows] = useState<Service[]>([]);
  const [draft, setDraft] = useState<Partial<Service>>({
    icon: "📸",
    title: "",
    description: "",
    sortOrder: 0,
    published: true,
  });

  async function load() {
    const res = await fetch("/api/admin/services");
    const data = await res.json();
    setRows(data.services || []);
  }

  useEffect(() => { load(); }, []);

  async function save() {
    if (!draft.title || !draft.description) return;
    const method = draft.id ? "PATCH" : "POST";
    await fetch("/api/admin/services", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    setDraft({ icon: "📸", title: "", description: "", sortOrder: 0, published: true });
    load();
  }

  async function edit(s: Service) { setDraft(s); }

  async function remove(id: string) {
    if (!confirm("Delete this service?")) return;
    await fetch("/api/admin/services", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Services</h1>

      <div className="bg-card border border-line rounded-lg p-5 mb-6 grid gap-3">
        <div className="grid grid-cols-6 gap-3">
          <input
            value={draft.icon || ""}
            onChange={(e) => setDraft({ ...draft, icon: e.target.value })}
            placeholder="📸"
            className="col-span-1 bg-[#111] border border-[#333] rounded px-3 py-2"
          />
          <input
            value={draft.title || ""}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            placeholder="Title"
            className="col-span-3 bg-[#111] border border-[#333] rounded px-3 py-2"
          />
          <input
            type="number"
            value={draft.sortOrder ?? 0}
            onChange={(e) => setDraft({ ...draft, sortOrder: Number(e.target.value) })}
            placeholder="Order"
            className="col-span-1 bg-[#111] border border-[#333] rounded px-3 py-2"
          />
          <label className="col-span-1 flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={draft.published ?? true}
              onChange={(e) => setDraft({ ...draft, published: e.target.checked })}
            />
            Published
          </label>
        </div>
        <textarea
          value={draft.description || ""}
          onChange={(e) => setDraft({ ...draft, description: e.target.value })}
          placeholder="Description"
          className="bg-[#111] border border-[#333] rounded px-3 py-2 min-h-20"
        />
        <div className="flex gap-2">
          <button onClick={save} className="bg-gold text-[#111] font-bold rounded px-5 py-2">
            {draft.id ? "Update" : "Add"} Service
          </button>
          {draft.id && (
            <button
              onClick={() => setDraft({ icon: "📸", title: "", description: "", sortOrder: 0, published: true })}
              className="border border-line rounded px-5 py-2"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </div>

      <div className="bg-card border border-line rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#0f0f0f] text-muted text-left">
            <tr>
              <th className="p-3">Icon</th>
              <th className="p-3">Title</th>
              <th className="p-3">Order</th>
              <th className="p-3">Published</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((s) => (
              <tr key={s.id} className="border-t border-line">
                <td className="p-3 text-lg">{s.icon}</td>
                <td className="p-3">
                  <div className="font-semibold">{s.title}</div>
                  <div className="text-muted text-xs line-clamp-1">
                    {s.description}
                  </div>
                </td>
                <td className="p-3">{s.sortOrder}</td>
                <td className="p-3">{s.published ? "✅" : "—"}</td>
                <td className="p-3 flex gap-2">
                  <button onClick={() => edit(s)} className="text-xs text-gold hover:underline">
                    Edit
                  </button>
                  <button onClick={() => remove(s.id)} className="text-xs text-red-400 hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}