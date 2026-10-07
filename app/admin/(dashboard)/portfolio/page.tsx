/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useEffect, useState } from "react";

type Item = {
  id: string;
  title: string;
  caption?: string;
  category: string;
  imageUrl: string;
  sortOrder: number;
  published: boolean;
};

const CATEGORIES = [
  "PORTRAITS",
  "GRADUATION",
  "WEDDINGS",
  "MATERNITY",
  "EVENTS",
  "BRAND CONTENT",
];

export default function PortfolioAdmin() {
  const [rows, setRows] = useState<Item[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [draft, setDraft] = useState<Partial<Item>>({
    title: "",
    caption: "",
    category: "PORTRAITS",
    sortOrder: 0,
    published: true,
  });
  const [uploading, setUploading] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/portfolio");
    const data = await res.json();
    setRows(data.items || []);
  }

  useEffect(() => { load(); }, []);

  async function upload() {
    if (!file || !draft.title) return alert("Pick image + enter title");
    setUploading(true);

    const fd = new FormData();
    fd.append("file", file);
    const up = await fetch("/api/upload", { method: "POST", body: fd });
    const upData = await up.json();
    if (!upData.url) { setUploading(false); return alert("Upload failed"); }

    const method = draft.id ? "PATCH" : "POST";
    await fetch("/api/admin/portfolio", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...draft, imageUrl: upData.url }),
    });

    setDraft({ title: "", caption: "", category: "PORTRAITS", sortOrder: 0, published: true });
    setFile(null);
    setUploading(false);
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this image?")) return;
    await fetch("/api/admin/portfolio", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Portfolio</h1>

      <div className="bg-card border border-line rounded-lg p-5 mb-6 grid gap-3">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="bg-[#111] border border-[#333] rounded px-3 py-2"
        />
        <div className="grid grid-cols-2 gap-3">
          <input value={draft.title || ""} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="Title" className="bg-[#111] border border-[#333] rounded px-3 py-2" />
          <select value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} className="bg-[#111] border border-[#333] rounded px-3 py-2">
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <input value={draft.caption || ""} onChange={(e) => setDraft({ ...draft, caption: e.target.value })} placeholder="Caption (e.g. Thika 2026 · 8 edits)" className="bg-[#111] border border-[#333] rounded px-3 py-2" />
        <div className="grid grid-cols-2 gap-3">
          <input type="number" value={draft.sortOrder ?? 0} onChange={(e) => setDraft({ ...draft, sortOrder: Number(e.target.value) })} placeholder="Sort order" className="bg-[#111] border border-[#333] rounded px-3 py-2" />
          <label className="flex items-center gap-2 text-xs">
            <input type="checkbox" checked={draft.published ?? true} onChange={(e) => setDraft({ ...draft, published: e.target.checked })} />
            Published
          </label>
        </div>
        <button onClick={upload} disabled={uploading} className="bg-gold text-[#111] font-bold rounded px-5 py-2 self-start">
          {uploading ? "Uploading…" : draft.id ? "Update" : "Upload"}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {rows.map((r) => (
          <div key={r.id} className="bg-card border border-line rounded-lg overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={r.imageUrl} alt={r.title} className="w-full aspect-4/5 object-cover" />
            <div className="p-3">
              <div className="font-semibold text-sm">{r.title}</div>
              <div className="text-xs text-muted">{r.category} · #{r.sortOrder}</div>
              {r.caption && <div className="text-xs text-muted mt-1">{r.caption}</div>}
              <div className="flex gap-2 mt-2">
                <button onClick={() => setDraft(r)} className="text-xs text-gold hover:underline">Edit</button>
                <button onClick={() => remove(r.id)} className="text-xs text-red-400 hover:underline">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}