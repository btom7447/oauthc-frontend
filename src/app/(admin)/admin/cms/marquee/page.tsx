"use client";

import { useState } from "react";
import { Plus, Radio, Pencil, Trash2, X, GripVertical } from "lucide-react";

type MarqueeType = "info" | "urgent" | "event";

type MarqueeItem = {
  id: string;
  text: string;
  type: MarqueeType;
  link?: string;
  active: boolean;
};

const MOCK: MarqueeItem[] = [
  { id: "1", text: "Free malaria testing every Saturday at the OPD — 9am to 1pm.", type: "info", active: true },
  { id: "2", text: "URGENT: Blood donors needed urgently. All blood groups. Call +234 036 230 400.", type: "urgent", link: "tel:+23403623040", active: true },
  { id: "3", text: "New Endocrinology clinic opening April 10. Book your appointment online.", type: "event", active: true },
  { id: "4", text: "OAUTHC 50th Anniversary Celebrations — April 20–25, 2026.", type: "event", active: true },
  { id: "5", text: "Emergency ward now operates 24/7. New triage protocols in effect.", type: "info", active: false },
];

const TYPE_STYLES: Record<MarqueeType, string> = {
  info: "bg-blue-50 text-blue-700 border border-blue-100",
  urgent: "bg-red-50 text-red-600 border border-red-100",
  event: "bg-amber-50 text-amber-700 border border-amber-100",
};

const EMPTY: Omit<MarqueeItem, "id"> = { text: "", type: "info", link: "", active: true };

export default function MarqueeCMSPage() {
  const [items, setItems] = useState(MOCK);
  const [settings, setSettings] = useState({ enabled: true, speed: "normal" as "slow" | "normal" | "fast" });
  const [panel, setPanel] = useState<{ mode: "new" | "edit"; data: Omit<MarqueeItem, "id"> & { id?: string } } | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const openNew = () => setPanel({ mode: "new", data: { ...EMPTY } });
  const openEdit = (item: MarqueeItem) => setPanel({ mode: "edit", data: { ...item } });

  const save = () => {
    if (!panel) return;
    if (panel.mode === "new") setItems((prev) => [...prev, { ...panel.data, id: String(Date.now()) } as MarqueeItem]);
    else setItems((prev) => prev.map((i) => i.id === panel.data.id ? { ...panel.data } as MarqueeItem : i));
    setPanel(null);
  };

  const remove = (id: string) => { setItems((prev) => prev.filter((i) => i.id !== id)); setDeleteId(null); };
  const toggleActive = (id: string) => setItems((prev) => prev.map((i) => i.id === id ? { ...i, active: !i.active } : i));
  const setField = (k: string, v: string | boolean) => setPanel((p) => p ? { ...p, data: { ...p.data, [k]: v } } : p);

  const activeCount = items.filter((i) => i.active).length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 text-xl font-bold">Marquee</h1>
          <p className="text-gray-500 text-sm mt-1">{activeCount} active · {items.length} total items</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 bg-green-900 hover:bg-green-800 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition">
          <Plus size={14} strokeWidth={2} /> New
        </button>
      </div>

      {/* Global settings */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5 flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center">
            <Radio size={16} strokeWidth={1.5} className="text-orange-600" />
          </div>
          <div>
            <p className="text-gray-900 text-sm font-semibold">Global Settings</p>
            <p className="text-gray-500 text-xs">Marquee ticker configuration</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 sm:ml-auto">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <span className="text-xs font-semibold text-gray-600">Enabled</span>
            <button
              onClick={() => setSettings((s) => ({ ...s, enabled: !s.enabled }))}
              className={`relative w-9 h-5 rounded-full transition ${settings.enabled ? "bg-green-900" : "bg-gray-200"}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${settings.enabled ? "translate-x-4" : "translate-x-0.5"}`} />
            </button>
          </label>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-600">Speed</span>
            <select
              value={settings.speed}
              onChange={(e) => setSettings((s) => ({ ...s, speed: e.target.value as typeof s.speed }))}
              className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-gray-700 outline-none focus:ring-2 focus:ring-green-700 bg-gray-50 appearance-none"
            >
              <option value="slow">Slow</option>
              <option value="normal">Normal</option>
              <option value="fast">Fast</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 items-start">
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          {items.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-12">No marquee items.</p>
          ) : (
            <ul className="divide-y divide-gray-50">
              {items.map((item) => (
                <li key={item.id} className={`flex items-start gap-3 px-5 py-4 transition ${item.active ? "hover:bg-gray-50" : "opacity-50 hover:bg-gray-50"}`}>
                  <GripVertical size={14} strokeWidth={1.5} className="text-gray-300 mt-1 shrink-0 cursor-grab" />
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-800 text-sm leading-relaxed line-clamp-2">{item.text}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${TYPE_STYLES[item.type]}`}>{item.type}</span>
                      {item.link && <span className="text-[10px] text-gray-400 truncate max-w-[120px]">{item.link}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => toggleActive(item.id)}
                      className={`relative w-8 h-4 rounded-full transition ${item.active ? "bg-green-900" : "bg-gray-200"}`}
                    >
                      <span className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform ${item.active ? "translate-x-4" : "translate-x-0.5"}`} />
                    </button>
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
              <h2 className="text-gray-900 font-semibold text-base">{panel.mode === "new" ? "New Item" : "Edit Item"}</h2>
              <button onClick={() => setPanel(null)} className="text-gray-300 hover:text-gray-600 transition"><X size={16} strokeWidth={1.5} /></button>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600">Message Text</label>
                <textarea value={panel.data.text} onChange={(e) => setField("text", e.target.value)} rows={3} placeholder="Ticker message…" className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-green-700 bg-gray-50 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">Type</label>
                  <select value={panel.data.type} onChange={(e) => setField("type", e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-green-700 bg-gray-50 appearance-none">
                    <option value="info">Info</option>
                    <option value="urgent">Urgent</option>
                    <option value="event">Event</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">Active</label>
                  <select value={panel.data.active ? "yes" : "no"} onChange={(e) => setField("active", e.target.value === "yes")} className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-green-700 bg-gray-50 appearance-none">
                    <option value="yes">Active</option>
                    <option value="no">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600">Link (optional)</label>
                <input value={panel.data.link ?? ""} onChange={(e) => setField("link", e.target.value)} placeholder="https:// or tel: or /page-path" className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-green-700 bg-gray-50" />
              </div>
            </div>
            <button onClick={save} disabled={!panel.data.text} className="w-full bg-green-900 hover:bg-green-800 disabled:opacity-50 text-white text-sm font-semibold py-2.5 rounded-xl transition">
              {panel.mode === "new" ? "Add Item" : "Save Changes"}
            </button>
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-8 flex flex-col items-center justify-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
              <Radio size={20} strokeWidth={1.5} className="text-gray-300" />
            </div>
            <p className="text-gray-400 text-sm">Select an item to edit, or add a new ticker message.</p>
          </div>
        )}
      </div>

      {deleteId && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl flex flex-col gap-4">
            <h3 className="text-gray-900 font-semibold text-base">Delete item?</h3>
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
