"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import * as LucideIcons from "lucide-react";
import { Search, Plus, HeartPulse, Pencil, Trash2, X, ChevronDown, Loader2, PlusCircle, XCircle } from "lucide-react";
import { api } from "@/lib/api-client";
import toast from "react-hot-toast";
import ImageUpload from "@/components/admin/ImageUpload";

type ServiceStatus = "active" | "draft" | "inactive";

type WhatToExpect = { title: string; detail: string };

type ServiceAPI = {
  id: string;
  title: string;
  slug: string;
  image: string;
  tagline: string;
  description: string;
  iconKey: string;
  overview: string[];
  keyPoints: string[];
  additionalInfo: string[];
  whatToExpect: WhatToExpect[];
  status: ServiceStatus;
};

type ServiceForm = {
  id?: string;
  title: string;
  slug: string;
  image: string;
  tagline: string;
  description: string;
  iconKey: string;
  overview: string;
  keyPoints: string[];
  additionalInfo: string;
  whatToExpect: WhatToExpect[];
  status: ServiceStatus;
};

const STATUS_STYLES: Record<ServiceStatus, string> = {
  active: "bg-green-50 text-green-800 border border-green-100",
  draft: "bg-gray-100 text-gray-500 border border-gray-200",
  inactive: "bg-red-50 text-red-600 border border-red-100",
};

function toForm(a: ServiceAPI): ServiceForm {
  return {
    id: a.id,
    title: a.title,
    slug: a.slug,
    image: a.image || "",
    tagline: a.tagline || "",
    description: a.description || "",
    iconKey: a.iconKey || "",
    overview: (a.overview || []).join("\n"),
    keyPoints: a.keyPoints?.length ? a.keyPoints : [""],
    additionalInfo: (a.additionalInfo || []).join("\n"),
    whatToExpect: a.whatToExpect?.length ? a.whatToExpect : [{ title: "", detail: "" }],
    status: a.status,
  };
}

function toPayload(f: ServiceForm) {
  return {
    title: f.title,
    slug: f.slug,
    image: f.image,
    tagline: f.tagline,
    description: f.description,
    iconKey: f.iconKey,
    status: f.status,
    overview: f.overview.split("\n").map((s) => s.trim()).filter(Boolean),
    keyPoints: f.keyPoints.map((s) => s.trim()).filter(Boolean),
    additionalInfo: f.additionalInfo.split("\n").map((s) => s.trim()).filter(Boolean),
    whatToExpect: f.whatToExpect.filter((w) => w.title.trim() || w.detail.trim()),
  };
}

const EMPTY: ServiceForm = {
  title: "", slug: "", image: "", tagline: "", description: "",
  iconKey: "", overview: "", keyPoints: [""], additionalInfo: "",
  whatToExpect: [{ title: "", detail: "" }], status: "draft",
};

const inputCls = "border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-green-700 bg-gray-50";

function slugify(s: string) { return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); }

/* ── Icon picker ── */
const ICON_NAMES = Object.keys(LucideIcons).filter((k) => {
  // Skip non-PascalCase, aliases ending in "Icon", and utility exports
  if (k[0] !== k[0].toUpperCase() || k.endsWith("Icon") || k === "default" || k === "createLucideIcon" || k === "icons") return false;
  const val = (LucideIcons as any)[k];
  return typeof val === "function" || (typeof val === "object" && val !== null && "$$typeof" in val);
});

function IconPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const [iconSearch, setIconSearch] = useState("");
  const matches = useMemo(() => {
    const q = iconSearch.toLowerCase();
    return q ? ICON_NAMES.filter((n) => n.toLowerCase().includes(q)) : ICON_NAMES;
  }, [iconSearch]);

  const Chosen = value ? (LucideIcons as any)[value] : null;

  return (
    <div className="flex flex-col gap-1.5 relative">
      <label className="text-xs font-semibold text-gray-600">Icon</label>
      <button type="button" onClick={() => setOpen(!open)} className={`${inputCls} flex items-center gap-2 text-left`}>
        {Chosen ? <Chosen size={14} strokeWidth={1.5} /> : null}
        <span className="flex-1 truncate">{value || "Select icon…"}</span>
        <ChevronDown size={12} className={`text-gray-400 transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 right-0 z-20 mt-1 border border-gray-200 rounded-lg bg-white shadow-xl p-3 flex flex-col gap-2">
          <input value={iconSearch} onChange={(e) => setIconSearch(e.target.value)} placeholder="Search icons…" autoFocus className="border border-gray-200 rounded px-2.5 py-1.5 text-xs text-gray-900 outline-none focus:ring-1 focus:ring-green-700" />
          <div className="grid grid-cols-6 gap-1.5 overflow-y-auto" style={{ maxHeight: "14rem" }}>
            {matches.map((name) => {
              const Icon = (LucideIcons as any)[name];
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => { onChange(name); setOpen(false); setIconSearch(""); }}
                  title={name}
                  className={`w-8 h-8 flex items-center justify-center rounded transition ${value === name ? "bg-green-100 text-green-900" : "hover:bg-gray-100 text-gray-500"}`}
                >
                  <Icon size={14} strokeWidth={1.5} />
                </button>
              );
            })}
            {matches.length === 0 && <p className="col-span-6 text-center text-gray-400 text-xs py-3">No icons found</p>}
          </div>
          <p className="text-[10px] text-gray-400 text-center">{matches.length} icons</p>
        </div>
      )}
    </div>
  );
}

export default function HealthServicesPage() {
  const [items, setItems] = useState<ServiceForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ServiceStatus | "all">("all");
  const [panel, setPanel] = useState<{ mode: "new" | "edit"; data: ServiceForm } | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    const res = await api.get<ServiceAPI[]>("/admin/cms/health-services?limit=200");
    if (res.ok && res.data) setItems(res.data.map(toForm));
    setLoading(false);
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const filtered = useMemo(() =>
    items.filter((i) => {
      const matchSearch = i.title.toLowerCase().includes(search.toLowerCase());
      const matchFilter = statusFilter === "all" || i.status === statusFilter;
      return matchSearch && matchFilter;
    }), [items, search, statusFilter]);

  const openNew = () => setPanel({ mode: "new", data: { ...EMPTY, keyPoints: [""], whatToExpect: [{ title: "", detail: "" }] } });
  const openEdit = (item: ServiceForm) => setPanel({ mode: "edit", data: { ...item, keyPoints: [...item.keyPoints], whatToExpect: item.whatToExpect.map((w) => ({ ...w })) } });

  const save = async () => {
    if (!panel) return;
    setSaving(true);
    const payload = toPayload(panel.data);
    if (panel.mode === "new") {
      const res = await api.post<ServiceAPI>("/admin/cms/health-services", payload);
      if (res.ok && res.data) {
        setItems((prev) => [toForm(res.data!), ...prev]);
        toast.success("Service created");
      } else {
        toast.error(res.error || "Failed to create");
      }
    } else {
      const res = await api.patch<ServiceAPI>(`/admin/cms/health-services/${panel.data.id}`, payload);
      if (res.ok && res.data) {
        setItems((prev) => prev.map((i) => i.id === panel.data.id ? toForm(res.data!) : i));
        toast.success("Service updated");
      } else {
        toast.error(res.error || "Failed to update");
      }
    }
    setSaving(false);
    setPanel(null);
  };

  const remove = async (id: string) => {
    const res = await api.del(`/admin/cms/health-services/${id}`);
    if (res.ok) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      toast.success("Service deleted");
      if (panel?.data.id === id) setPanel(null);
    } else {
      toast.error(res.error || "Failed to delete");
    }
    setDeleteId(null);
  };

  const setField = (k: string, v: string) => {
    setPanel((p) => {
      if (!p) return p;
      const next = { ...p, data: { ...p.data, [k]: v } };
      if (k === "title" && p.mode === "new") next.data.slug = slugify(v);
      return next;
    });
  };

  /* ── Array field helpers ── */
  const updateKeyPoint = (idx: number, val: string) => {
    setPanel((p) => {
      if (!p) return p;
      const kp = [...p.data.keyPoints];
      kp[idx] = val;
      return { ...p, data: { ...p.data, keyPoints: kp } };
    });
  };
  const addKeyPoint = () => {
    setPanel((p) => p ? { ...p, data: { ...p.data, keyPoints: [...p.data.keyPoints, ""] } } : p);
  };
  const removeKeyPoint = (idx: number) => {
    setPanel((p) => {
      if (!p) return p;
      const kp = p.data.keyPoints.filter((_, i) => i !== idx);
      return { ...p, data: { ...p.data, keyPoints: kp.length ? kp : [""] } };
    });
  };

  const updateWTE = (idx: number, field: "title" | "detail", val: string) => {
    setPanel((p) => {
      if (!p) return p;
      const wte = p.data.whatToExpect.map((w, i) => i === idx ? { ...w, [field]: val } : w);
      return { ...p, data: { ...p.data, whatToExpect: wte } };
    });
  };
  const addWTE = () => {
    setPanel((p) => p ? { ...p, data: { ...p.data, whatToExpect: [...p.data.whatToExpect, { title: "", detail: "" }] } } : p);
  };
  const removeWTE = (idx: number) => {
    setPanel((p) => {
      if (!p) return p;
      const wte = p.data.whatToExpect.filter((_, i) => i !== idx);
      return { ...p, data: { ...p.data, whatToExpect: wte.length ? wte : [{ title: "", detail: "" }] } };
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 text-xl font-bold">Health Services</h1>
          <p className="text-gray-500 text-sm mt-1">{items.filter((i) => i.status === "active").length} active · {items.length} total</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 bg-green-900 hover:bg-green-800 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition">
          <Plus size={14} strokeWidth={2} /> New Service
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" strokeWidth={1.5} />
          <input type="text" placeholder="Search services…" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-green-700 bg-white shadow-sm transition" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(["all", "active", "draft", "inactive"] as const).map((f) => (
            <button key={f} onClick={() => setStatusFilter(f)} className={`px-3 py-2 rounded-lg text-xs font-semibold capitalize transition ${statusFilter === f ? "bg-green-900 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-green-900"}`}>{f}</button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 items-start">
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="divide-y divide-gray-50">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-start gap-3 px-5 py-4 animate-pulse">
                  <div className="w-8 h-8 rounded-lg bg-gray-200 shrink-0" />
                  <div className="flex-1">
                    <div className="h-3.5 w-40 bg-gray-200 rounded mb-2" />
                    <div className="h-2.5 w-56 bg-gray-100 rounded mb-2" />
                    <div className="h-4 w-14 bg-gray-100 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-12">No services found.</p>
          ) : (
            <ul className="divide-y divide-gray-50">
              {filtered.map((item) => {
                const Icon = item.iconKey ? (LucideIcons as any)[item.iconKey] : HeartPulse;
                return (
                  <li key={item.id} className="flex items-start gap-3 px-5 py-4 hover:bg-gray-50 transition">
                    <div className="w-8 h-8 rounded-lg bg-green-900/10 flex items-center justify-center shrink-0">
                      {Icon ? <Icon size={14} strokeWidth={1.5} className="text-green-900" /> : <HeartPulse size={14} strokeWidth={1.5} className="text-green-900" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 font-semibold text-sm truncate">{item.title}</p>
                      <p className="text-gray-400 text-xs mt-0.5 line-clamp-1">{item.tagline}</p>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize mt-1.5 inline-block ${STATUS_STYLES[item.status]}`}>{item.status}</span>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => openEdit(item)} className="p-1.5 text-gray-300 hover:text-green-900 transition"><Pencil size={13} strokeWidth={1.5} /></button>
                      <button onClick={() => setDeleteId(item.id!)} className="p-1.5 text-gray-300 hover:text-red-500 transition"><Trash2 size={13} strokeWidth={1.5} /></button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {panel ? (
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-gray-900 font-semibold text-base">{panel.mode === "new" ? "New Service" : "Edit Service"}</h2>
              <button onClick={() => setPanel(null)} className="text-gray-300 hover:text-gray-600 transition"><X size={16} strokeWidth={1.5} /></button>
            </div>
            <div className="p-6 flex flex-col gap-5 max-h-[75vh] overflow-y-auto">
              <ImageUpload value={panel.data.image} onChange={(v) => setField("image", v)} label="Hero Image" aspectRatio="landscape" folder="health-services" />

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">Title</label>
                  <input value={panel.data.title} onChange={(e) => setField("title", e.target.value)} placeholder="Service title" className={inputCls} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">Slug</label>
                  <input value={panel.data.slug} onChange={(e) => setField("slug", e.target.value)} placeholder="auto-generated" className={`${inputCls} text-gray-400`} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">Tagline</label>
                  <input value={panel.data.tagline} onChange={(e) => setField("tagline", e.target.value)} placeholder="Short description" className={inputCls} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-600">Status</label>
                    <select value={panel.data.status} onChange={(e) => setField("status", e.target.value)} className={`${inputCls} appearance-none`}>
                      <option value="draft">Draft</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  <IconPicker value={panel.data.iconKey} onChange={(v) => setField("iconKey", v)} />
                </div>
              </div>

              {/* ── Overview ── */}
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider pt-2">Overview</p>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600">Overview Paragraphs <span className="text-gray-400 font-normal">(one paragraph per line)</span></label>
                <textarea value={panel.data.overview} onChange={(e) => setField("overview", e.target.value)} rows={4} placeholder="Overview paragraph 1&#10;Overview paragraph 2" className={`${inputCls} resize-none`} />
              </div>

              {/* ── Highlights ── */}
              <div className="flex items-center justify-between pt-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Highlight Offers</p>
                <button type="button" onClick={addKeyPoint} className="flex items-center gap-1 text-xs font-semibold text-green-800 hover:text-green-900 transition">
                  <PlusCircle size={13} strokeWidth={1.5} /> Add
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {panel.data.keyPoints.map((kp, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      value={kp}
                      onChange={(e) => updateKeyPoint(idx, e.target.value)}
                      placeholder={`Highlight ${idx + 1}`}
                      className={`${inputCls} flex-1`}
                    />
                    <button type="button" onClick={() => removeKeyPoint(idx)} className="text-gray-300 hover:text-red-500 transition shrink-0">
                      <XCircle size={16} strokeWidth={1.5} />
                    </button>
                  </div>
                ))}
              </div>

              {/* ── Our Approach ── */}
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider pt-2">Our Approach</p>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600">Approach Paragraphs <span className="text-gray-400 font-normal">(one paragraph per line)</span></label>
                <textarea value={panel.data.additionalInfo} onChange={(e) => setField("additionalInfo", e.target.value)} rows={3} placeholder="Approach paragraph 1&#10;Approach paragraph 2" className={`${inputCls} resize-none`} />
              </div>

              {/* ── What to Expect ── */}
              <div className="flex items-center justify-between pt-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">What to Expect</p>
                <button type="button" onClick={addWTE} className="flex items-center gap-1 text-xs font-semibold text-green-800 hover:text-green-900 transition">
                  <PlusCircle size={13} strokeWidth={1.5} /> Add
                </button>
              </div>
              <div className="flex flex-col gap-3">
                {panel.data.whatToExpect.map((wte, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      value={wte.title}
                      onChange={(e) => updateWTE(idx, "title", e.target.value)}
                      placeholder="Step title"
                      className={`${inputCls} w-2/5`}
                    />
                    <input
                      value={wte.detail}
                      onChange={(e) => updateWTE(idx, "detail", e.target.value)}
                      placeholder="Step detail"
                      className={`${inputCls} flex-1 text-gray-500`}
                    />
                    <button type="button" onClick={() => removeWTE(idx)} className="text-gray-300 hover:text-red-500 transition shrink-0">
                      <XCircle size={16} strokeWidth={1.5} />
                    </button>
                  </div>
                ))}
              </div>

              <button onClick={save} disabled={!panel.data.title || saving} className="w-full bg-green-900 hover:bg-green-800 disabled:opacity-50 text-white text-sm font-semibold py-2.5 rounded-xl transition flex items-center justify-center gap-2">
                {saving && <Loader2 size={14} className="animate-spin" />}
                {panel.mode === "new" ? "Create Service" : "Save Changes"}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-8 flex flex-col items-center justify-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
              <HeartPulse size={20} strokeWidth={1.5} className="text-gray-300" />
            </div>
            <p className="text-gray-400 text-sm">Select a service to edit, or create a new one.</p>
          </div>
        )}
      </div>

      {deleteId && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl flex flex-col gap-4">
            <h3 className="text-gray-900 font-semibold text-base">Delete service?</h3>
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
