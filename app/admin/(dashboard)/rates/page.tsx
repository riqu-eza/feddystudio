"use client";
import { useEffect, useState } from "react";

type Rate = {
  id: string;
  icon: string;
  title: string;
  price: string;
  items: string[];
  ctaLabel: string;
  ctaMessage: string;
  sortOrder: number;
  published: boolean;
};

const empty: Partial<Rate> = {
  icon: "📸",
  title: "",
  price: "",
  items: [""],
  ctaLabel: "Book Now",
  ctaMessage: "Hello FEDDY STUDIO...",
  sortOrder: 0,
  published: true,
};

export default function RatesAdmin() {
  const [rows, setRows] = useState<Rate[]>([]);
  const [draft, setDraft] = useState<Partial<Rate>>(empty);

  async function load() {
    const res = await fetch("/api/admin/rates");
    const data = await res.json();
    setRows(data.rates || []);
  }

  useEffect(() => { load(); }, []);

  function setItem(idx: number, val: string) {
    const items = [...(draft.items || [])];
    items[idx] = val;
    setDraft({ ...draft, items });
  }

  function addItem() {
    setDraft({ ...draft, items: [...(draft.items || []), ""] });
  }

  function removeItem(idx: number) {
    const items = [...(draft.items || [])];
    items.splice(idx, 1);
    setDraft({ ...draft, items });
  }

  async function save() {
    if (!draft.title || !draft.price) return;
    const payload = {
      ...draft,
      items: (draft.items || []).filter((i) => i.trim().length > 0),
    };
    const method = draft.id ? "PATCH" : "POST";
    await fetch("/api/admin/rates", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setDraft(empty);
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this package?")) return;
    await fetch("/api/admin/rates", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Packages</h1>

      <div className="bg-card border border-line rounded-lg p-5 mb-6 grid gap-3">
        <div className="grid grid-cols-6 gap-3">
          <input value={draft.icon || ""} onChange={(e) => setDraft({ ...draft, icon: e.target.value })} className="col-span-1 bg-[#111] border border-[#333] rounded px-3 py-2" />
          <input value={draft.title || ""} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="Title" className="col-span-3 bg-[#111] border border-[#333] rounded px-3 py-2" />
          <input value={draft.price || ""} onChange={(e) => setDraft({ ...draft, price: e.target.value })} placeholder="Price" className="col-span-2 bg-[#111] border border-[#333] rounded px-3 py-2" />
        </div>

        <div className="grid gap-2">
          <label className="text-xs text-muted">Line items</label>
          {(draft.items || []).map((it, i) => (
            <div key={i} className="flex gap-2">
              <input value={it} onChange={(e) => setItem(i, e.target.value)} className="flex-1 bg-[#111] border border-[#333] rounded px-3 py-2" />
              <button onClick={() => removeItem(i)} className="text-red-400 text-sm px-3">✕</button>
            </div>
          ))}
          <button onClick={addItem} className="text-xs text-gold self-start">+ Add item</button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <input value={draft.ctaLabel || ""} onChange={(e) => setDraft({ ...draft, ctaLabel: e.target.value })} placeholder="CTA label" className="bg-[#111] border border-[#333] rounded px-3 py-2" />
          <input type="number" value={draft.sortOrder ?? 0} onChange={(e) => setDraft({ ...draft, sortOrder: Number(e.target.value) })} placeholder="Order" className="bg-[#111] border border-[#333] rounded px-3 py-2" />
        </div>

        <input value={draft.ctaMessage || ""} onChange={(e) => setDraft({ ...draft, ctaMessage: e.target.value })} placeholder="WhatsApp message" className="bg-[#111] border border-[#333] rounded px-3 py-2" />

        <label className="text-xs flex items-center gap-2">
          <input type="checkbox" checked={draft.published ?? true} onChange={(e) => setDraft({ ...draft, published: e.target.checked })} />
          Published
        </label>

        <div className="flex gap-2">
          <button onClick={save} className="bg-gold text-[#111] font-bold rounded px-5 py-2">
            {draft.id ? "Update" : "Add"} Package
          </button>
          {draft.id && (
            <button onClick={() => setDraft(empty)} className="border border-line rounded px-5 py-2">Cancel Edit</button>
          )}
        </div>
      </div>

      <div className="bg-card border border-line rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#0f0f0f] text-muted text-left">
            <tr>
              <th className="p-3">Icon</th>
              <th className="p-3">Title</th>
              <th className="p-3">Price</th>
              <th className="p-3">Order</th>
              <th className="p-3">Published</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-line">
                <td className="p-3 text-lg">{r.icon}</td>
                <td className="p-3 font-semibold">{r.title}</td>
                <td className="p-3 text-gold">{r.price}</td>
                <td className="p-3">{r.sortOrder}</td>
                <td className="p-3">{r.published ? "✅" : "—"}</td>
                <td className="p-3 flex gap-2">
                  <button onClick={() => setDraft({ ...r, items: r.items as string[] })} className="text-xs text-gold hover:underline">Edit</button>
                  <button onClick={() => remove(r.id)} className="text-xs text-red-400 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}