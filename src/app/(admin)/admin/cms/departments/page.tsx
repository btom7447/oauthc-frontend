"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Plus, Building2, Pencil, Trash2, X, Loader2, PlusCircle } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";
import { api } from "@/lib/api-client";
import toast from "react-hot-toast";

type DeptStatus = "active" | "inactive";

type Facility = { title: string; detail: string };
type Procedure = { name: string; description: string };

type Department = {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  overview: string[];
  conditions: string[];
  facilities: Facility[];
  procedures: Procedure[];
  head: string;
  phone: string;
  email: string;
  location: string;
  status: DeptStatus;
};

function slugify(s: string) { return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); }

const STATUS_STYLES: Record<DeptStatus, string> = {
  active: "bg-green-50 text-green-800 border border-green-100",
  inactive: "bg-gray-100 text-gray-500 border border-gray-200",
};

const EMPTY: Omit<Department, "id"> = { name: "", slug: "", image: "", description: "", overview: [], conditions: [], facilities: [], procedures: [], head: "", phone: "", email: "", location: "", status: "active" };

export default function DepartmentsCMSPage() {
  const [items, setItems] = useState<Department[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<DeptStatus | "all">("all");
  const [panel, setPanel] = useState<{ mode: "new" | "edit"; data: Omit<Department, "id"> & { id?: string } } | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("limit", "100");
    if (search) params.set("search", search);
    if (filter !== "all") params.set("status", filter);

    const res = await api.get<Department[]>(`/admin/cms/departments?${params.toString()}`);
    if (res.ok && res.data) setItems(res.data);
    setLoading(false);
  }, [search, filter]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const openNew = () => setPanel({ mode: "new", data: { ...EMPTY } });
  const openEdit = (item: Department) => setPanel({ mode: "edit", data: { ...item } });

  const save = async () => {
    if (!panel) return;
    setSaving(true);

    if (panel.mode === "new") {
      const res = await api.post<Department>("/admin/cms/departments", panel.data);
      if (res.ok && res.data) {
        setItems((prev) => [res.data!, ...prev]);
        toast.success("Department created");
        setPanel(null);
      } else {
        toast.error(res.error || "Failed to create");
      }
    } else {
      const res = await api.patch<Department>(`/admin/cms/departments/${panel.data.id}`, panel.data);
      if (res.ok && res.data) {
        setItems((prev) => prev.map((i) => i.id === panel.data.id ? res.data! : i));
        toast.success("Department updated");
        setPanel(null);
      } else {
        toast.error(res.error || "Failed to update");
      }
    }
    setSaving(false);
  };

  const remove = async (id: string) => {
    const res = await api.del(`/admin/cms/departments/${id}`);
    if (res.ok) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      toast.success("Department deleted");
      if (panel?.data.id === id) setPanel(null);
    } else {
      toast.error(res.error || "Failed to delete");
    }
    setDeleteId(null);
  };

  const setField = (k: string, v: any) => setPanel((p) => {
    if (!p) return p;
    const next = { ...p, data: { ...p.data, [k]: v } };
    if (k === "name" && p.mode === "new") next.data.slug = slugify(v);
    return next;
  });

  /* ── Array helpers ── */
  const addOverview = () => setPanel((p) => p ? { ...p, data: { ...p.data, overview: [...p.data.overview, ""] } } : p);
  const setOverview = (i: number, v: string) => setPanel((p) => {
    if (!p) return p;
    const arr = [...p.data.overview];
    arr[i] = v;
    return { ...p, data: { ...p.data, overview: arr } };
  });
  const removeOverview = (i: number) => setPanel((p) => p ? { ...p, data: { ...p.data, overview: p.data.overview.filter((_, idx) => idx !== i) } } : p);

  const addCondition = () => setPanel((p) => p ? { ...p, data: { ...p.data, conditions: [...p.data.conditions, ""] } } : p);
  const setCondition = (i: number, v: string) => setPanel((p) => {
    if (!p) return p;
    const arr = [...p.data.conditions];
    arr[i] = v;
    return { ...p, data: { ...p.data, conditions: arr } };
  });
  const removeCondition = (i: number) => setPanel((p) => p ? { ...p, data: { ...p.data, conditions: p.data.conditions.filter((_, idx) => idx !== i) } } : p);

  const addFacility = () => setPanel((p) => p ? { ...p, data: { ...p.data, facilities: [...p.data.facilities, { title: "", detail: "" }] } } : p);
  const setFacility = (i: number, k: "title" | "detail", v: string) => setPanel((p) => {
    if (!p) return p;
    const arr = [...p.data.facilities];
    arr[i] = { ...arr[i], [k]: v };
    return { ...p, data: { ...p.data, facilities: arr } };
  });
  const removeFacility = (i: number) => setPanel((p) => p ? { ...p, data: { ...p.data, facilities: p.data.facilities.filter((_, idx) => idx !== i) } } : p);

  const addProcedure = () => setPanel((p) => p ? { ...p, data: { ...p.data, procedures: [...p.data.procedures, { name: "", description: "" }] } } : p);
  const setProcedure = (i: number, k: "name" | "description", v: string) => setPanel((p) => {
    if (!p) return p;
    const arr = [...p.data.procedures];
    arr[i] = { ...arr[i], [k]: v };
    return { ...p, data: { ...p.data, procedures: arr } };
  });
  const removeProcedure = (i: number) => setPanel((p) => p ? { ...p, data: { ...p.data, procedures: p.data.procedures.filter((_, idx) => idx !== i) } } : p);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 text-xl font-bold">Departments & Centres</h1>
          <p className="text-gray-500 text-sm mt-1">{items.filter((i) => i.status === "active").length} active · {items.length} total</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 bg-green-900 hover:bg-green-800 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition">
          <Plus size={14} strokeWidth={2} /> New
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" strokeWidth={1.5} />
          <input type="text" placeholder="Search name, head…" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-green-700 bg-white shadow-sm transition" />
        </div>
        <div className="flex gap-2">
          {(["all", "active", "inactive"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-2 rounded-lg text-xs font-semibold capitalize transition ${filter === f ? "bg-green-900 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-green-900"}`}>{f}</button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 items-start">
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="divide-y divide-gray-50">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-start gap-3 px-5 py-4 animate-pulse">
                  <div className="w-9 h-9 rounded-xl bg-gray-200 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="h-3.5 w-36 bg-gray-200 rounded mb-2" />
                    <div className="h-2.5 w-52 bg-gray-100 rounded mb-2" />
                    <div className="flex gap-3"><div className="h-4 w-14 bg-gray-100 rounded-full" /><div className="h-3 w-24 bg-gray-100 rounded" /></div>
                  </div>
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-12">No departments found.</p>
          ) : (
            <ul className="divide-y divide-gray-50">
              {items.map((item) => (
                <li key={item.id} className="flex items-start gap-3 px-5 py-4 hover:bg-gray-50 transition">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                    <Building2 size={14} strokeWidth={1.5} className="text-blue-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 font-semibold text-sm">{item.name}</p>
                    <p className="text-gray-400 text-xs mt-0.5 line-clamp-1">{item.description}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${STATUS_STYLES[item.status]}`}>{item.status}</span>
                      <span className="text-[10px] text-gray-400">{item.head}</span>
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
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 flex flex-col gap-5 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between sticky top-0 bg-white pb-3 border-b border-gray-50 z-10">
              <h2 className="text-gray-900 font-semibold text-base">{panel.mode === "new" ? "New Department" : "Edit Department"}</h2>
              <button onClick={() => setPanel(null)} className="text-gray-300 hover:text-gray-600 transition"><X size={16} strokeWidth={1.5} /></button>
            </div>
            <ImageUpload value={panel.data.image} onChange={(url) => setField("image", url)} label="Department Image" folder="oauthc/departments" />
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">Name</label>
                  <input value={panel.data.name} onChange={(e) => setField("name", e.target.value)} placeholder="Department name" className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-green-700 bg-gray-50" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">Slug</label>
                  <input value={panel.data.slug} onChange={(e) => setField("slug", e.target.value)} placeholder="url-slug" className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-green-700 bg-gray-50" />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600">Description</label>
                <textarea value={panel.data.description} onChange={(e) => setField("description", e.target.value)} rows={3} placeholder="Brief description…" className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-green-700 bg-gray-50 resize-none" />
              </div>
              {/* Overview paragraphs */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-gray-600">Overview Paragraphs</label>
                  <button type="button" onClick={addOverview} className="flex items-center gap-1 text-xs text-green-900 hover:text-green-700 font-medium transition">
                    <PlusCircle size={12} strokeWidth={2} /> Add
                  </button>
                </div>
                {panel.data.overview.map((p, i) => (
                  <div key={i} className="flex gap-2">
                    <textarea value={p} onChange={(e) => setOverview(i, e.target.value)} rows={2} placeholder={`Paragraph ${i + 1}…`} className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-green-700 bg-gray-50 resize-none" />
                    <button type="button" onClick={() => removeOverview(i)} className="text-gray-300 hover:text-red-500 transition shrink-0 mt-1"><X size={14} strokeWidth={1.5} /></button>
                  </div>
                ))}
              </div>

              {/* Conditions */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-gray-600">Conditions Treated</label>
                  <button type="button" onClick={addCondition} className="flex items-center gap-1 text-xs text-green-900 hover:text-green-700 font-medium transition">
                    <PlusCircle size={12} strokeWidth={2} /> Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {panel.data.conditions.map((c, i) => (
                    <div key={i} className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg pl-3 pr-1.5 py-1.5">
                      <input value={c} onChange={(e) => setCondition(i, e.target.value)} placeholder="Condition…" className="border-none bg-transparent text-sm text-gray-700 outline-none w-40" />
                      <button type="button" onClick={() => removeCondition(i)} className="text-gray-300 hover:text-red-500 transition"><X size={12} strokeWidth={1.5} /></button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Facilities */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-gray-600">Facilities & Equipment</label>
                  <button type="button" onClick={addFacility} className="flex items-center gap-1 text-xs text-green-900 hover:text-green-700 font-medium transition">
                    <PlusCircle size={12} strokeWidth={2} /> Add
                  </button>
                </div>
                {panel.data.facilities.map((f, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <input value={f.title} onChange={(e) => setFacility(i, "title", e.target.value)} placeholder="Title" className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-green-700 bg-gray-50" />
                      <input value={f.detail} onChange={(e) => setFacility(i, "detail", e.target.value)} placeholder="Detail" className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-green-700 bg-gray-50" />
                    </div>
                    <button type="button" onClick={() => removeFacility(i)} className="text-gray-300 hover:text-red-500 transition shrink-0 mt-2"><X size={14} strokeWidth={1.5} /></button>
                  </div>
                ))}
              </div>

              {/* Procedures */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-gray-600">Procedures & Services</label>
                  <button type="button" onClick={addProcedure} className="flex items-center gap-1 text-xs text-green-900 hover:text-green-700 font-medium transition">
                    <PlusCircle size={12} strokeWidth={2} /> Add
                  </button>
                </div>
                {panel.data.procedures.map((pr, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <div className="flex-1 flex flex-col gap-1.5">
                      <input value={pr.name} onChange={(e) => setProcedure(i, "name", e.target.value)} placeholder="Procedure name" className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-green-700 bg-gray-50" />
                      <textarea value={pr.description} onChange={(e) => setProcedure(i, "description", e.target.value)} rows={2} placeholder="Description…" className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-green-700 bg-gray-50 resize-none" />
                    </div>
                    <button type="button" onClick={() => removeProcedure(i)} className="text-gray-300 hover:text-red-500 transition shrink-0 mt-2"><X size={14} strokeWidth={1.5} /></button>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">Head of Dept.</label>
                  <input value={panel.data.head} onChange={(e) => setField("head", e.target.value)} placeholder="Dr. Name" className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-green-700 bg-gray-50" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">Location</label>
                  <input value={panel.data.location} onChange={(e) => setField("location", e.target.value)} placeholder="e.g. Block A, 1st Floor" className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-green-700 bg-gray-50" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">Phone</label>
                  <input value={panel.data.phone} onChange={(e) => setField("phone", e.target.value)} placeholder="+234 8xx xxx xxxx" className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-green-700 bg-gray-50" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">Email</label>
                  <input type="email" value={panel.data.email} onChange={(e) => setField("email", e.target.value)} placeholder="dept@oauthc.gov.ng" className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-green-700 bg-gray-50" />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600">Status</label>
                <select value={panel.data.status} onChange={(e) => setField("status", e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-green-700 bg-gray-50 appearance-none">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <button onClick={save} disabled={!panel.data.name || saving} className="w-full bg-green-900 hover:bg-green-800 disabled:opacity-50 text-white text-sm font-semibold py-2.5 rounded-xl transition">
              {saving ? "Saving…" : panel.mode === "new" ? "Create Department" : "Save Changes"}
            </button>
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-8 flex flex-col items-center justify-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
              <Building2 size={20} strokeWidth={1.5} className="text-gray-300" />
            </div>
            <p className="text-gray-400 text-sm">Select a department to edit, or create a new one.</p>
          </div>
        )}
      </div>

      {deleteId && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl flex flex-col gap-4">
            <h3 className="text-gray-900 font-semibold text-base">Delete department?</h3>
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
