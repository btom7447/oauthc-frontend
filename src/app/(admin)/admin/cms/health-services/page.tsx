"use client";

import { useState, useMemo } from "react";
import * as LucideIcons from "lucide-react";
import { Search, Plus, HeartPulse, Pencil, Trash2, X, ChevronDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";

// All lucide-react icon components (forwardRef objects with displayName, no duplicate Icon-suffixed aliases)
const ICON_MAP: Record<string, LucideIcon> = Object.fromEntries(
  Object.entries(LucideIcons).filter(
    ([name, val]) =>
      /^[A-Z]/.test(name) &&
      !name.endsWith("Icon") &&
      typeof val === "object" &&
      val !== null &&
      (val as Record<string, unknown>).displayName
  )
) as Record<string, LucideIcon>;

type ServiceStatus = "active" | "draft" | "inactive";

type HealthService = {
  id: string;
  title: string;
  slug: string;
  image: string;
  tagline: string;
  description: string;
  department: string;
  category: string;
  iconKey: string;
  overview: string;
  keyPoints: string;
  additionalInfo: string;
  whatToExpect: string;
  status: ServiceStatus;
};

function slugify(s: string) { return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); }



const MOCK: HealthService[] = [
  { id: "1", title: "Cardiac Catheterisation", slug: "cardiac-catheterisation", image: "", tagline: "", description: "Minimally invasive procedure to diagnose and treat cardiovascular conditions.", department: "Cardiology", category: "Diagnostic", iconKey: "", overview: "", keyPoints: "", additionalInfo: "", whatToExpect: "", status: "active" },
  { id: "2", title: "MRI Scanning", slug: "mri-scanning", image: "", tagline: "", description: "Advanced magnetic resonance imaging for detailed internal body scans.", department: "Radiology", category: "Imaging", iconKey: "", overview: "", keyPoints: "", additionalInfo: "", whatToExpect: "", status: "active" },
  { id: "3", title: "Chemotherapy", slug: "chemotherapy", image: "", tagline: "", description: "Drug-based treatment for cancer patients.", department: "Oncology", category: "Treatment", iconKey: "", overview: "", keyPoints: "", additionalInfo: "", whatToExpect: "", status: "active" },
  { id: "4", title: "Neonatal Intensive Care", slug: "neonatal-intensive-care", image: "", tagline: "", description: "Specialised care unit for premature and critically ill newborns.", department: "Paediatrics", category: "Intensive Care", iconKey: "", overview: "", keyPoints: "", additionalInfo: "", whatToExpect: "", status: "active" },
  { id: "5", title: "Cataract Surgery", slug: "cataract-surgery", image: "", tagline: "", description: "Surgical removal of the cloudy lens and replacement with an artificial lens.", department: "Ophthalmology", category: "Surgery", iconKey: "", overview: "", keyPoints: "", additionalInfo: "", whatToExpect: "", status: "active" },
  { id: "6", title: "Stroke Rehabilitation", slug: "stroke-rehabilitation", image: "", tagline: "", description: "Comprehensive rehabilitation programme for post-stroke patients.", department: "Neurology", category: "Rehabilitation", iconKey: "", overview: "", keyPoints: "", additionalInfo: "", whatToExpect: "", status: "active" },
  { id: "7", title: "Skin Biopsy", slug: "skin-biopsy", image: "", tagline: "", description: "Removal of a small skin sample for laboratory analysis.", department: "Dermatology", category: "Diagnostic", iconKey: "", overview: "", keyPoints: "", additionalInfo: "", whatToExpect: "", status: "draft" },
  { id: "8", title: "Physiotherapy", slug: "physiotherapy", image: "", tagline: "", description: "Physical therapy sessions for musculoskeletal and neurological conditions.", department: "Physiotherapy", category: "Rehabilitation", iconKey: "", overview: "", keyPoints: "", additionalInfo: "", whatToExpect: "", status: "active" },
  { id: "9", title: "Diabetes Management Clinic", slug: "diabetes-management-clinic", image: "", tagline: "", description: "Outpatient clinic for monitoring and managing diabetic patients.", department: "Endocrinology", category: "Outpatient", iconKey: "", overview: "", keyPoints: "", additionalInfo: "", whatToExpect: "", status: "active" },
  { id: "10", title: "HIV/AIDS Counselling", slug: "hiv-aids-counselling", image: "", tagline: "", description: "Confidential counselling, testing, and treatment support services.", department: "Infectious Diseases", category: "Counselling", iconKey: "", overview: "", keyPoints: "", additionalInfo: "", whatToExpect: "", status: "active" },
  { id: "11", title: "Antenatal Care", slug: "antenatal-care", image: "", tagline: "", description: "Regular check-ups and care for pregnant women.", department: "Obstetrics & Gynaecology", category: "Maternal Health", iconKey: "", overview: "", keyPoints: "", additionalInfo: "", whatToExpect: "", status: "active" },
  { id: "12", title: "Blood Bank Services", slug: "blood-bank-services", image: "", tagline: "", description: "Safe blood collection, testing, storage and transfusion services.", department: "Haematology", category: "Support Services", iconKey: "", overview: "", keyPoints: "", additionalInfo: "", whatToExpect: "", status: "inactive" },
];

const STATUS_STYLES: Record<ServiceStatus, string> = {
  active: "bg-green-50 text-green-800 border border-green-100",
  draft: "bg-gray-100 text-gray-500 border border-gray-200",
  inactive: "bg-red-50 text-red-600 border border-red-100",
};

const EMPTY: Omit<HealthService, "id"> = { title: "", slug: "", image: "", tagline: "", description: "", department: "", category: "", iconKey: "", overview: "", keyPoints: "", additionalInfo: "", whatToExpect: "", status: "draft" };

const inputCls = "border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-green-700 bg-gray-50";
const textareaCls = `${inputCls} resize-none`;

export default function HealthServicesCMSPage() {
  const [items, setItems] = useState(MOCK);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<ServiceStatus | "all">("all");
  const [panel, setPanel] = useState<{ mode: "new" | "edit"; data: Omit<HealthService, "id"> & { id?: string } } | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [iconPickerOpen, setIconPickerOpen] = useState(false);
  const [iconSearch, setIconSearch] = useState("");

  const filtered = useMemo(() =>
    items.filter((i) => {
      const matchSearch = i.title.toLowerCase().includes(search.toLowerCase()) || i.department.toLowerCase().includes(search.toLowerCase());
      const matchFilter = filter === "all" || i.status === filter;
      return matchSearch && matchFilter;
    }), [items, search, filter]);

  const openNew = () => setPanel({ mode: "new", data: { ...EMPTY } });
  const openEdit = (item: HealthService) => setPanel({ mode: "edit", data: { ...item } });
  const save = () => {
    if (!panel) return;
    if (panel.mode === "new") setItems((prev) => [{ ...panel.data, id: String(Date.now()) } as HealthService, ...prev]);
    else setItems((prev) => prev.map((i) => i.id === panel.data.id ? { ...panel.data } as HealthService : i));
    setPanel(null);
  };
  const remove = (id: string) => { setItems((prev) => prev.filter((i) => i.id !== id)); setDeleteId(null); };
  const setField = (k: string, v: string) =>
    setPanel((p) => {
      if (!p) return p;
      const update: Record<string, string> = { [k]: v };
      if (k === "title" && p.mode === "new") update.slug = slugify(v);
      return { ...p, data: { ...p.data, ...update } };
    });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 text-xl font-bold">Health Services</h1>
          <p className="text-gray-500 text-sm mt-1">{items.filter((i) => i.status === "active").length} active · {items.length} total</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 bg-green-900 hover:bg-green-800 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition">
          <Plus size={14} strokeWidth={2} /> New
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" strokeWidth={1.5} />
          <input type="text" placeholder="Search title, department…" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-green-700 bg-white shadow-sm transition" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(["all", "active", "draft", "inactive"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-2 rounded-lg text-xs font-semibold capitalize transition ${filter === f ? "bg-green-900 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-green-900"}`}>{f}</button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 items-start">
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          {filtered.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-12">No services found.</p>
          ) : (
            <ul className="divide-y divide-gray-50">
              {filtered.map((item) => (
                <li key={item.id} className="flex items-start gap-3 px-5 py-4 hover:bg-gray-50 transition">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center shrink-0 mt-0.5">
                    {(() => { const Icon = item.iconKey ? (ICON_MAP[item.iconKey] ?? HeartPulse) : HeartPulse; return <Icon size={14} strokeWidth={1.5} className="text-amber-600" />; })()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 font-semibold text-sm truncate">{item.title}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{item.department} · {item.category}</p>
                    <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize mt-1.5 ${STATUS_STYLES[item.status]}`}>{item.status}</span>
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
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm flex flex-col max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 z-10 bg-white border-b border-gray-100 flex items-center justify-between px-6 py-4">
              <h2 className="text-gray-900 font-semibold text-base">{panel.mode === "new" ? "New Service" : "Edit Service"}</h2>
              <button onClick={() => setPanel(null)} className="text-gray-300 hover:text-gray-600 transition"><X size={16} strokeWidth={1.5} /></button>
            </div>

            <div className="flex flex-col gap-5 p-6">
              {/* Image */}
              <ImageUpload
                value={panel.data.image}
                onChange={(v) => setField("image", v)}
                label="Service Image"
                aspectRatio="landscape"
                folder="health-services"
              />

              {/* Core */}
              <div className="flex flex-col gap-4">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Core Details</p>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">Title</label>
                  <input value={panel.data.title} onChange={(e) => setField("title", e.target.value)} placeholder="Service name" className={inputCls} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">Slug</label>
                  <input value={panel.data.slug} onChange={(e) => setField("slug", e.target.value)} placeholder="auto-generated from title" className={inputCls} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">Tagline</label>
                  <input value={panel.data.tagline} onChange={(e) => setField("tagline", e.target.value)} placeholder="Short description shown on cards" className={inputCls} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">Description</label>
                  <textarea value={panel.data.description} onChange={(e) => setField("description", e.target.value)} rows={3} placeholder="Short description…" className={textareaCls} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-600">Department</label>
                    <input value={panel.data.department} onChange={(e) => setField("department", e.target.value)} placeholder="e.g. Cardiology" className={inputCls} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-600">Category</label>
                    <input value={panel.data.category} onChange={(e) => setField("category", e.target.value)} placeholder="e.g. Diagnostic" className={inputCls} />
                  </div>
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
                </div>

                {/* Icon picker */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">Icon</label>
                  <button
                    type="button"
                    onClick={() => { setIconPickerOpen((v) => !v); setIconSearch(""); }}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm text-left transition ${iconPickerOpen ? "border-green-700 ring-2 ring-green-700" : "border-gray-200 hover:border-gray-300"} bg-gray-50`}
                  >
                    {(() => {
                      const Icon = panel.data.iconKey ? (ICON_MAP[panel.data.iconKey] ?? null) : null;
                      return Icon
                        ? <Icon size={15} strokeWidth={1.5} className="text-amber-600 shrink-0" />
                        : <HeartPulse size={15} strokeWidth={1.5} className="text-gray-300 shrink-0" />;
                    })()}
                    <span className={`flex-1 truncate ${panel.data.iconKey ? "text-gray-700" : "text-gray-400"}`}>
                      {panel.data.iconKey || "Choose icon…"}
                    </span>
                    <ChevronDown size={12} strokeWidth={1.5} className="text-gray-400 shrink-0" />
                  </button>

                  {iconPickerOpen && (
                    <div className="border border-gray-200 rounded-xl bg-white shadow-md flex flex-col overflow-hidden">
                      {/* Search */}
                      <div className="p-2 border-b border-gray-100">
                        <div className="relative">
                          <Search size={12} strokeWidth={1.5} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                          <input
                            type="text"
                            placeholder="Search icons…"
                            value={iconSearch}
                            onChange={(e) => setIconSearch(e.target.value)}
                            className="w-full pl-7 pr-3 py-1.5 text-xs text-gray-700 placeholder-gray-400 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-700 bg-gray-50"
                            autoFocus
                          />
                        </div>
                      </div>

                      {/* Scrollable icon grid */}
                      <div className="h-56 overflow-y-auto p-2">
                        {(() => {
                          const matches = Object.entries(ICON_MAP).filter(([name]) =>
                            name.toLowerCase().includes(iconSearch.toLowerCase())
                          );
                          if (matches.length === 0) return (
                            <p className="text-center text-gray-400 text-xs py-8">No icons match "{iconSearch}"</p>
                          );
                          return (
                            <div className="grid grid-cols-6 gap-1">
                              {matches.map(([name, Icon]) => (
                                <button
                                  key={name}
                                  type="button"
                                  title={name}
                                  onClick={() => { setField("iconKey", name); setIconPickerOpen(false); setIconSearch(""); }}
                                  className={`flex flex-col items-center justify-center gap-1 p-2 rounded-lg text-[9px] font-medium transition ${panel.data.iconKey === name ? "bg-amber-50 text-amber-700 border border-amber-200" : "text-gray-500 hover:bg-gray-100"}`}
                                >
                                  <Icon size={16} strokeWidth={1.5} className={panel.data.iconKey === name ? "text-amber-600" : "text-gray-500"} />
                                  <span className="truncate w-full text-center leading-tight">{name}</span>
                                </button>
                              ))}
                            </div>
                          );
                        })()}
                      </div>

                      {panel.data.iconKey && (
                        <div className="border-t border-gray-100 px-3 py-2">
                          <button
                            type="button"
                            onClick={() => { setField("iconKey", ""); setIconPickerOpen(false); }}
                            className="text-[11px] text-gray-400 hover:text-red-500 transition"
                          >
                            Clear selection
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col gap-4">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Content</p>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">Overview <span className="text-gray-400 font-normal">(one paragraph per line)</span></label>
                  <textarea value={panel.data.overview} onChange={(e) => setField("overview", e.target.value)} rows={4} placeholder={"Paragraph one…\nParagraph two…"} className={textareaCls} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">Key Points <span className="text-gray-400 font-normal">(one per line)</span></label>
                  <textarea value={panel.data.keyPoints} onChange={(e) => setField("keyPoints", e.target.value)} rows={4} placeholder={"Point one\nPoint two\nPoint three"} className={textareaCls} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">Additional Info <span className="text-gray-400 font-normal">(one paragraph per line)</span></label>
                  <textarea value={panel.data.additionalInfo} onChange={(e) => setField("additionalInfo", e.target.value)} rows={3} placeholder={"Extra paragraph one…\nExtra paragraph two…"} className={textareaCls} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">What to Expect <span className="text-gray-400 font-normal">(format: "Title: Detail", one per line)</span></label>
                  <textarea value={panel.data.whatToExpect} onChange={(e) => setField("whatToExpect", e.target.value)} rows={4} placeholder={"Arrival: Please arrive 15 minutes early.\nConsultation: The doctor will review your history."} className={textareaCls} />
                </div>
              </div>

              <button onClick={save} disabled={!panel.data.title} className="w-full bg-green-900 hover:bg-green-800 disabled:opacity-50 text-white text-sm font-semibold py-2.5 rounded-xl transition">
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
