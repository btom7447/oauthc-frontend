"use client";

import { useState, useMemo } from "react";
import { Search, Plus, Megaphone, Pencil, Trash2, X } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";

type AnnouncementStatus = "active" | "draft" | "expired";

type Announcement = {
  id: string;
  title: string;
  body: string;
  date: string;
  status: AnnouncementStatus;
  priority: "normal" | "urgent";
  image: string;
  link: string;
  featured: boolean;
};

const MOCK: Announcement[] = [
  { id: "1", title: "Hospital Upgrade Notice", body: "Our radiology wing will undergo maintenance from April 5–7. Services will be temporarily limited.", date: "2026-03-28", status: "active", priority: "normal", image: "", link: "", featured: false },
  { id: "2", title: "COVID-19 Booster Campaign", body: "Free booster vaccines available at OPD every Saturday, 9am–1pm.", date: "2026-03-20", status: "active", priority: "urgent", image: "", link: "", featured: false },
  { id: "3", title: "New Specialist Clinic Opening", body: "Our new Endocrinology specialist clinic opens April 10. Book appointments via the portal.", date: "2026-03-15", status: "active", priority: "normal", image: "", link: "", featured: false },
  { id: "4", title: "Blood Donation Drive", body: "Annual blood donation drive scheduled for April 20 at the main hall.", date: "2026-03-10", status: "draft", priority: "normal", image: "", link: "", featured: false },
  { id: "5", title: "Pharmacy Operating Hours", body: "The hospital pharmacy will now operate 24/7 starting April 1.", date: "2026-02-28", status: "expired", priority: "normal", image: "", link: "", featured: false },
  { id: "6", title: "Emergency Ward Expansion", body: "The A&E ward has been expanded. New triage protocols are now in effect.", date: "2026-02-10", status: "active", priority: "urgent", image: "", link: "", featured: false },
  { id: "7", title: "Staff Training Day", body: "All non-emergency staff are requested to attend the CPD training on April 12.", date: "2026-03-25", status: "draft", priority: "normal", image: "", link: "", featured: false },
  { id: "8", title: "Visiting Hours Update", body: "Visiting hours are now 10am–12pm and 4pm–6pm daily.", date: "2026-01-15", status: "expired", priority: "normal", image: "", link: "", featured: false },
];

const STATUS_STYLES: Record<AnnouncementStatus, string> = {
  active: "bg-green-50 text-green-800 border border-green-100",
  draft: "bg-gray-100 text-gray-500 border border-gray-200",
  expired: "bg-red-50 text-red-600 border border-red-100",
};

const EMPTY: Omit<Announcement, "id"> = { title: "", body: "", date: "", status: "draft", priority: "normal", image: "", link: "", featured: false };

const inputCls = "border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-green-700 bg-gray-50";

export default function AnnouncementsPage() {
  const [items, setItems] = useState(MOCK);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<AnnouncementStatus | "all">("all");
  const [panel, setPanel] = useState<{ mode: "new" | "edit"; data: Omit<Announcement, "id"> & { id?: string } } | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() =>
    items.filter((i) => {
      const matchSearch = i.title.toLowerCase().includes(search.toLowerCase());
      const matchFilter = filter === "all" || i.status === filter;
      return matchSearch && matchFilter;
    }), [items, search, filter]);

  const openNew = () => setPanel({ mode: "new", data: { ...EMPTY } });
  const openEdit = (item: Announcement) => setPanel({ mode: "edit", data: { ...item } });

  const save = () => {
    if (!panel) return;
    if (panel.mode === "new") {
      setItems((prev) => [{ ...panel.data, id: String(Date.now()) } as Announcement, ...prev]);
    } else {
      setItems((prev) => prev.map((i) => i.id === panel.data.id ? { ...panel.data } as Announcement : i));
    }
    setPanel(null);
  };

  const remove = (id: string) => { setItems((prev) => prev.filter((i) => i.id !== id)); setDeleteId(null); };

  const setField = (k: string, v: string) => setPanel((p) => p ? { ...p, data: { ...p.data, [k]: v } } : p);
  const setBool = (k: string, v: boolean) => setPanel((p) => p ? { ...p, data: { ...p.data, [k]: v } } : p);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 text-xl font-bold">Announcements</h1>
          <p className="text-gray-500 text-sm mt-1">{items.filter((i) => i.status === "active").length} active · {items.length} total</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 bg-green-900 hover:bg-green-800 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition">
          <Plus size={14} strokeWidth={2} /> New
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" strokeWidth={1.5} />
          <input type="text" placeholder="Search title…" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-green-700 bg-white shadow-sm transition" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(["all", "active", "draft", "expired"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-2 rounded-lg text-xs font-semibold capitalize transition ${filter === f ? "bg-green-900 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-green-900"}`}>{f}</button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 items-start">
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          {filtered.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-12">No announcements found.</p>
          ) : (
            <ul className="divide-y divide-gray-50">
              {filtered.map((item) => (
                <li key={item.id} className="flex items-start gap-3 px-5 py-4 hover:bg-gray-50 transition">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-gray-900 font-semibold text-sm truncate">{item.title}</p>
                      {item.priority === "urgent" && <span className="text-[9px] font-bold px-1.5 py-0.5 bg-red-100 text-red-600 rounded uppercase tracking-wide">Urgent</span>}
                    </div>
                    <p className="text-gray-400 text-xs mt-0.5 line-clamp-1">{item.body}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${STATUS_STYLES[item.status]}`}>{item.status}</span>
                      <span className="text-[10px] text-gray-400">{new Date(item.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => openEdit(item)} className="p-1.5 text-gray-300 hover:text-green-900 transition"><Pencil size={13} strokeWidth={1.5} /></button>
                    <button onClick={() => setDeleteId(item.id)} className="p-1.5 text-gray-300 hover:text-red-500 transition"><Trash2 size={13} strokeWidth={1.5} /></button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {panel ? (
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <h2 className="text-gray-900 font-semibold text-base">{panel.mode === "new" ? "New Announcement" : "Edit Announcement"}</h2>
              <button onClick={() => setPanel(null)} className="text-gray-300 hover:text-gray-600 transition"><X size={16} strokeWidth={1.5} /></button>
            </div>

            <ImageUpload
              value={panel.data.image}
              onChange={(v) => setField("image", v)}
              label="Hero Image"
              aspectRatio="landscape"
              folder="announcements"
            />

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600">Title</label>
                <input value={panel.data.title} onChange={(e) => setField("title", e.target.value)} placeholder="Announcement title" className={inputCls} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600">Body</label>
                <textarea value={panel.data.body} onChange={(e) => setField("body", e.target.value)} rows={4} placeholder="Announcement body…" className={`${inputCls} resize-none`} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600">Link <span className="text-gray-400 font-normal">(optional URL)</span></label>
                <input type="url" value={panel.data.link} onChange={(e) => setField("link", e.target.value)} placeholder="https://…" className={inputCls} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">Date</label>
                  <input type="date" value={panel.data.date} onChange={(e) => setField("date", e.target.value)} className={inputCls} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">Priority</label>
                  <select value={panel.data.priority} onChange={(e) => setField("priority", e.target.value)} className={`${inputCls} appearance-none`}>
                    <option value="normal">Normal</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">Status</label>
                  <select value={panel.data.status} onChange={(e) => setField("status", e.target.value)} className={`${inputCls} appearance-none`}>
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="expired">Expired</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">Featured</label>
                  <label className="flex items-center gap-2 h-[42px] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={panel.data.featured}
                      onChange={(e) => setBool("featured", e.target.checked)}
                      className="w-4 h-4 rounded accent-green-900 cursor-pointer"
                    />
                    <span className="text-sm text-gray-600">Show in homepage carousel</span>
                  </label>
                </div>
              </div>
            </div>

            <button onClick={save} disabled={!panel.data.title} className="w-full bg-green-900 hover:bg-green-800 disabled:opacity-50 text-white text-sm font-semibold py-2.5 rounded-xl transition">
              {panel.mode === "new" ? "Create Announcement" : "Save Changes"}
            </button>
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-8 flex flex-col items-center justify-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
              <Megaphone size={20} strokeWidth={1.5} className="text-gray-300" />
            </div>
            <p className="text-gray-400 text-sm">Select an announcement to edit, or create a new one.</p>
          </div>
        )}
      </div>

      {deleteId && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl flex flex-col gap-4">
            <h3 className="text-gray-900 font-semibold text-base">Delete announcement?</h3>
            <p className="text-gray-500 text-sm">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 border border-gray-200 text-gray-700 text-sm font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition">Cancel</button>
              <button onClick={() => remove(deleteId)} className="flex-1 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold py-2.5 rounded-xl transition">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
