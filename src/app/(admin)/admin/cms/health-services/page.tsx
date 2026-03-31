"use client";

import { useState, useMemo } from "react";
import { Search, Plus, HeartPulse, Pencil, Trash2, X } from "lucide-react";

type ServiceStatus = "active" | "draft" | "inactive";

type HealthService = {
  id: string;
  title: string;
  description: string;
  department: string;
  category: string;
  status: ServiceStatus;
};

const MOCK: HealthService[] = [
  { id: "1", title: "Cardiac Catheterisation", description: "Minimally invasive procedure to diagnose and treat cardiovascular conditions.", department: "Cardiology", category: "Diagnostic", status: "active" },
  { id: "2", title: "MRI Scanning", description: "Advanced magnetic resonance imaging for detailed internal body scans.", department: "Radiology", category: "Imaging", status: "active" },
  { id: "3", title: "Chemotherapy", description: "Drug-based treatment for cancer patients.", department: "Oncology", category: "Treatment", status: "active" },
  { id: "4", title: "Neonatal Intensive Care", description: "Specialised care unit for premature and critically ill newborns.", department: "Paediatrics", category: "Intensive Care", status: "active" },
  { id: "5", title: "Cataract Surgery", description: "Surgical removal of the cloudy lens and replacement with an artificial lens.", department: "Ophthalmology", category: "Surgery", status: "active" },
  { id: "6", title: "Stroke Rehabilitation", description: "Comprehensive rehabilitation programme for post-stroke patients.", department: "Neurology", category: "Rehabilitation", status: "active" },
  { id: "7", title: "Skin Biopsy", description: "Removal of a small skin sample for laboratory analysis.", department: "Dermatology", category: "Diagnostic", status: "draft" },
  { id: "8", title: "Physiotherapy", description: "Physical therapy sessions for musculoskeletal and neurological conditions.", department: "Physiotherapy", category: "Rehabilitation", status: "active" },
  { id: "9", title: "Diabetes Management Clinic", description: "Outpatient clinic for monitoring and managing diabetic patients.", department: "Endocrinology", category: "Outpatient", status: "active" },
  { id: "10", title: "HIV/AIDS Counselling", description: "Confidential counselling, testing, and treatment support services.", department: "Infectious Diseases", category: "Counselling", status: "active" },
  { id: "11", title: "Antenatal Care", description: "Regular check-ups and care for pregnant women.", department: "Obstetrics & Gynaecology", category: "Maternal Health", status: "active" },
  { id: "12", title: "Blood Bank Services", description: "Safe blood collection, testing, storage and transfusion services.", department: "Haematology", category: "Support Services", status: "inactive" },
];

const STATUS_STYLES: Record<ServiceStatus, string> = {
  active: "bg-green-50 text-green-800 border border-green-100",
  draft: "bg-gray-100 text-gray-500 border border-gray-200",
  inactive: "bg-red-50 text-red-600 border border-red-100",
};

const EMPTY: Omit<HealthService, "id"> = { title: "", description: "", department: "", category: "", status: "draft" };

export default function HealthServicesCMSPage() {
  const [items, setItems] = useState(MOCK);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<ServiceStatus | "all">("all");
  const [panel, setPanel] = useState<{ mode: "new" | "edit"; data: Omit<HealthService, "id"> & { id?: string } } | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

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
  const setField = (k: string, v: string) => setPanel((p) => p ? { ...p, data: { ...p.data, [k]: v } } : p);

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
                    <HeartPulse size={14} strokeWidth={1.5} className="text-amber-600" />
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
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <h2 className="text-gray-900 font-semibold text-base">{panel.mode === "new" ? "New Service" : "Edit Service"}</h2>
              <button onClick={() => setPanel(null)} className="text-gray-300 hover:text-gray-600 transition"><X size={16} strokeWidth={1.5} /></button>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600">Title</label>
                <input value={panel.data.title} onChange={(e) => setField("title", e.target.value)} placeholder="Service name" className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-green-700 bg-gray-50" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600">Description</label>
                <textarea value={panel.data.description} onChange={(e) => setField("description", e.target.value)} rows={3} placeholder="Short description…" className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-green-700 bg-gray-50 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">Department</label>
                  <input value={panel.data.department} onChange={(e) => setField("department", e.target.value)} placeholder="e.g. Cardiology" className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-green-700 bg-gray-50" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">Category</label>
                  <input value={panel.data.category} onChange={(e) => setField("category", e.target.value)} placeholder="e.g. Diagnostic" className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-green-700 bg-gray-50" />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600">Status</label>
                <select value={panel.data.status} onChange={(e) => setField("status", e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-green-700 bg-gray-50 appearance-none">
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <button onClick={save} disabled={!panel.data.title} className="w-full bg-green-900 hover:bg-green-800 disabled:opacity-50 text-white text-sm font-semibold py-2.5 rounded-xl transition">
              {panel.mode === "new" ? "Create Service" : "Save Changes"}
            </button>
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
