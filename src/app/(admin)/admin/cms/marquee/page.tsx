"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api-client";
import toast from "react-hot-toast";
import { Plus, Radio, Pencil, Trash2, X, GripVertical, Loader2 } from "lucide-react";

type MarqueeType = "info" | "urgent" | "event";

type MarqueeItem = {
  id: string;
  text: string;
  type: MarqueeType;
  link?: string;
  isExternal: boolean;
  active: boolean;
  order: number;
};

type MarqueeSettings = {
  enabled: boolean;
  speed: "slow" | "normal" | "fast";
};

const TYPE_STYLES: Record<MarqueeType, string> = {
  info: "bg-blue-50 text-blue-700 border border-blue-100",
  urgent: "bg-red-50 text-red-700 border border-red-100",
  event: "bg-purple-50 text-purple-700 border border-purple-100",
};

const EMPTY: Omit<MarqueeItem, "id"> = { text: "", type: "info", link: "", isExternal: false, active: true, order: 0 };

const inputCls = "border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-green-700 bg-gray-50";

export default function MarqueePage() {
  const [items, setItems] = useState<MarqueeItem[]>([]);
  const [settings, setSettings] = useState<MarqueeSettings>({ enabled: true, speed: "normal" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [panel, setPanel] = useState<{ mode: "new" | "edit"; data: Omit<MarqueeItem, "id"> & { id?: string } } | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const res = await api.get<{ items: MarqueeItem[]; settings: MarqueeSettings }>("/admin/cms/marquee");
    if (res.ok && res.data) {
      setItems(res.data.items || []);
      if (res.data.settings) setSettings(res.data.settings);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openNew = () => setPanel({ mode: "new", data: { ...EMPTY, order: items.length } });
  const openEdit = (item: MarqueeItem) => setPanel({ mode: "edit", data: { ...item } });

  const save = async () => {
    if (!panel) return;
    setSaving(true);
    if (panel.mode === "new") {
      const res = await api.post<MarqueeItem>("/admin/cms/marquee/items", panel.data);
      if (res.ok && res.data) {
        setItems((prev) => [...prev, res.data!]);
        toast.success("Item created");
      } else {
        toast.error(res.error || "Failed to create");
      }
    } else {
      const res = await api.patch<MarqueeItem>(`/admin/cms/marquee/items/${panel.data.id}`, panel.data);
      if (res.ok && res.data) {
        setItems((prev) => prev.map((i) => i.id === panel.data.id ? res.data! : i));
        toast.success("Item updated");
      } else {
        toast.error(res.error || "Failed to update");
      }
    }
    setSaving(false);
    setPanel(null);
  };

  const remove = async (id: string) => {
    const res = await api.del(`/admin/cms/marquee/items/${id}`);
    if (res.ok) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      toast.success("Item deleted");
      if (panel?.data.id === id) setPanel(null);
    } else {
      toast.error(res.error || "Failed to delete");
    }
    setDeleteId(null);
  };

  const toggleActive = async (item: MarqueeItem) => {
    const res = await api.patch<MarqueeItem>(`/admin/cms/marquee/items/${item.id}`, { active: !item.active });
    if (res.ok && res.data) {
      setItems((prev) => prev.map((i) => i.id === item.id ? res.data! : i));
    }
  };

  const saveSettings = async (patch: Partial<MarqueeSettings>) => {
    const next = { ...settings, ...patch };
    setSettings(next);
    setSavingSettings(true);
    const res = await api.put("/admin/cms/marquee/settings", next);
    if (res.ok) {
      toast.success("Settings saved");
    } else {
      toast.error(res.error || "Failed to save settings");
    }
    setSavingSettings(false);
  };

  const setField = (k: string, v: string | boolean | number) => setPanel((p) => p ? { ...p, data: { ...p.data, [k]: v } } : p);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 text-xl font-bold">Marquee Ticker</h1>
          <p className="text-gray-500 text-sm mt-1">{items.filter((i) => i.active).length} active · {items.length} total</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 bg-green-900 hover:bg-green-800 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition">
          <Plus size={14} strokeWidth={2} /> New Item
        </button>
      </div>

      {/* Global settings */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm px-5 py-4 flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Ticker</span>
          <button
            onClick={() => saveSettings({ enabled: !settings.enabled })}
            disabled={savingSettings}
            className={`relative w-10 h-5 rounded-full transition ${settings.enabled ? "bg-green-600" : "bg-gray-300"}`}
          >
            <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${settings.enabled ? "left-5.5" : "left-0.5"}`} />
          </button>
          <span className="text-xs text-gray-500">{settings.enabled ? "On" : "Off"}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Speed</span>
          <select
            value={settings.speed}
            onChange={(e) => saveSettings({ speed: e.target.value as MarqueeSettings["speed"] })}
            className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-700 outline-none focus:ring-2 focus:ring-green-700 bg-white appearance-none"
          >
            <option value="slow">Slow</option>
            <option value="normal">Normal</option>
            <option value="fast">Fast</option>
          </select>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 items-start">
        {/* Items list */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="divide-y divide-gray-50">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-4 animate-pulse">
                  <div className="w-4 h-8 bg-gray-100 rounded" />
                  <div className="flex-1">
                    <div className="h-3 w-48 bg-gray-200 rounded mb-2" />
                    <div className="h-2 w-20 bg-gray-100 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-12">No marquee items yet.</p>
          ) : (
            <ul className="divide-y divide-gray-50">
              {items.sort((a, b) => a.order - b.order).map((item) => (
                <li key={item.id} className="flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition">
                  <GripVertical size={14} className="text-gray-300 shrink-0 cursor-grab" />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${item.active ? "text-gray-900" : "text-gray-400 line-through"}`}>{item.text}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${TYPE_STYLES[item.type]}`}>{item.type}</span>
                      {item.link && <span className="text-[10px] text-gray-400 truncate max-w-30">{item.link}</span>}
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => toggleActive(item)} className={`p-1.5 transition ${item.active ? "text-green-600 hover:text-green-800" : "text-gray-300 hover:text-green-600"}`}>
                      <Radio size={13} strokeWidth={1.5} />
                    </button>
                    <button onClick={() => openEdit(item)} className="p-1.5 text-gray-300 hover:text-green-900 transition"><Pencil size={13} strokeWidth={1.5} /></button>
                    <button onClick={() => setDeleteId(item.id)} className="p-1.5 text-gray-300 hover:text-red-500 transition"><Trash2 size={13} strokeWidth={1.5} /></button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Edit panel */}
        {panel ? (
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <h2 className="text-gray-900 font-semibold text-base">{panel.mode === "new" ? "New Item" : "Edit Item"}</h2>
              <button onClick={() => setPanel(null)} className="text-gray-300 hover:text-gray-600 transition"><X size={16} strokeWidth={1.5} /></button>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600">Message Text</label>
                <textarea value={panel.data.text} onChange={(e) => setField("text", e.target.value)} rows={3} placeholder="Ticker message…" className={`${inputCls} resize-none`} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">Type</label>
                  <select value={panel.data.type} onChange={(e) => setField("type", e.target.value)} className={`${inputCls} appearance-none`}>
                    <option value="info">Info</option>
                    <option value="urgent">Urgent</option>
                    <option value="event">Event</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">Active</label>
                  <select value={panel.data.active ? "yes" : "no"} onChange={(e) => setField("active", e.target.value === "yes")} className={`${inputCls} appearance-none`}>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600">Link <span className="text-gray-400 font-normal">(optional — https://, tel:, or /page-path)</span></label>
                <input value={panel.data.link || ""} onChange={(e) => setField("link", e.target.value)} placeholder="https://…" className={inputCls} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">External Link</label>
                  <label className="flex items-center gap-2 h-10.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={panel.data.isExternal}
                      onChange={(e) => setField("isExternal", e.target.checked)}
                      className="w-4 h-4 rounded accent-green-900 cursor-pointer"
                    />
                    <span className="text-sm text-gray-600">Opens in new tab</span>
                  </label>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">Order</label>
                  <input type="number" value={panel.data.order} onChange={(e) => setField("order", parseInt(e.target.value) || 0)} min={0} className={inputCls} />
                </div>
              </div>
            </div>

            <button onClick={save} disabled={!panel.data.text || saving} className="w-full bg-green-900 hover:bg-green-800 disabled:opacity-50 text-white text-sm font-semibold py-2.5 rounded-xl transition flex items-center justify-center gap-2">
              {saving && <Loader2 size={14} className="animate-spin" />}
              {panel.mode === "new" ? "Create Item" : "Save Changes"}
            </button>
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-8 flex flex-col items-center justify-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
              <Radio size={20} strokeWidth={1.5} className="text-gray-300" />
            </div>
            <p className="text-gray-400 text-sm">Select an item to edit, or create a new one.</p>
          </div>
        )}
      </div>

      {deleteId && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl flex flex-col gap-4">
            <h3 className="text-gray-900 font-semibold text-base">Delete marquee item?</h3>
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
