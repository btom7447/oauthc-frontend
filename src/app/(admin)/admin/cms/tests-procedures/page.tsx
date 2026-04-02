"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { api } from "@/lib/api-client";
import toast from "react-hot-toast";
import { Search, Plus, FlaskConical, Pencil, Trash2, X, Loader2 } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";

type EntryStatus = "published" | "draft";

type TestAPI = {
  id: string;
  name: string;
  slug: string;
  category: string;
  overview: string[];
  images: string[];
  whyItsDone: string[];
  howToPrepare: string[];
  whatToExpect: string[];
  results: string[];
  limitations: string[];
  status: EntryStatus;
};

type TestForm = {
  id: string;
  name: string;
  slug: string;
  category: string;
  overview: string;
  images: string[];
  whyItsDone: string[];
  howToPrepare: string[];
  whatToExpect: string[];
  results: string[];
  limitations: string[];
  status: EntryStatus;
};

const STATUS_STYLES: Record<EntryStatus, string> = {
  published: "bg-green-50 text-green-800 border border-green-100",
  draft: "bg-gray-100 text-gray-500 border border-gray-200",
};

function toForm(a: TestAPI): TestForm {
  return {
    id: a.id,
    name: a.name,
    slug: a.slug,
    category: a.category,
    overview: (a.overview || []).join("\n"),
    images: a.images || [],
    whyItsDone: a.whyItsDone?.length ? a.whyItsDone : [""],
    howToPrepare: a.howToPrepare?.length ? a.howToPrepare : [""],
    whatToExpect: a.whatToExpect?.length ? a.whatToExpect : [""],
    results: a.results?.length ? a.results : [""],
    limitations: a.limitations?.length ? a.limitations : [""],
    status: a.status,
  };
}

function toPayload(f: TestForm) {
  const clean = (arr: string[]) => arr.map((s) => s.trim()).filter(Boolean);
  return {
    name: f.name,
    slug: f.slug,
    category: f.category,
    status: f.status,
    images: f.images,
    overview: f.overview.split("\n").map((l) => l.trim()).filter(Boolean),
    whyItsDone: clean(f.whyItsDone),
    howToPrepare: clean(f.howToPrepare),
    whatToExpect: clean(f.whatToExpect),
    results: clean(f.results),
    limitations: clean(f.limitations),
  };
}

const EMPTY: Omit<TestForm, "id"> = {
  name: "", slug: "", category: "", overview: "", images: [],
  whyItsDone: [""], howToPrepare: [""], whatToExpect: [""], results: [""], limitations: [""],
  status: "draft",
};

const inputCls = "border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-green-700 bg-gray-50";

function slugify(s: string) { return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); }

export default function TestsProceduresPage() {
  const [items, setItems] = useState<TestForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<EntryStatus | "all">("all");
  const [panel, setPanel] = useState<{ mode: "new" | "edit"; data: Omit<TestForm, "id"> & { id?: string } } | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    const res = await api.get<TestAPI[]>("/admin/cms/tests?limit=200");
    if (res.ok && res.data) setItems(res.data.map(toForm));
    setLoading(false);
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const filtered = useMemo(() =>
    items.filter((i) => {
      const matchSearch = i.name.toLowerCase().includes(search.toLowerCase()) || i.category.toLowerCase().includes(search.toLowerCase());
      const matchFilter = statusFilter === "all" || i.status === statusFilter;
      return matchSearch && matchFilter;
    }), [items, search, statusFilter]);

  const openNew = () => setPanel({ mode: "new", data: { ...EMPTY, whyItsDone: [""], howToPrepare: [""], whatToExpect: [""], results: [""], limitations: [""] } });
  const openEdit = (item: TestForm) => setPanel({ mode: "edit", data: { ...item, whyItsDone: [...item.whyItsDone], howToPrepare: [...item.howToPrepare], whatToExpect: [...item.whatToExpect], results: [...item.results], limitations: [...item.limitations] } });

  const save = async () => {
    if (!panel) return;
    setSaving(true);
    const payload = toPayload(panel.data as TestForm);
    if (panel.mode === "new") {
      const res = await api.post<TestAPI>("/admin/cms/tests", payload);
      if (res.ok && res.data) {
        setItems((prev) => [toForm(res.data!), ...prev]);
        toast.success("Entry created");
      } else {
        toast.error(res.error || "Failed to create");
      }
    } else {
      const res = await api.patch<TestAPI>(`/admin/cms/tests/${panel.data.id}`, payload);
      if (res.ok && res.data) {
        setItems((prev) => prev.map((i) => i.id === panel.data.id ? toForm(res.data!) : i));
        toast.success("Entry updated");
      } else {
        toast.error(res.error || "Failed to update");
      }
    }
    setSaving(false);
    setPanel(null);
  };

  const remove = async (id: string) => {
    const res = await api.del(`/admin/cms/tests/${id}`);
    if (res.ok) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      toast.success("Entry deleted");
      if (panel?.data.id === id) setPanel(null);
    } else {
      toast.error(res.error || "Failed to delete");
    }
    setDeleteId(null);
  };

  const setField = (k: string, v: string | string[]) => {
    setPanel((p) => {
      if (!p) return p;
      const next = { ...p, data: { ...p.data, [k]: v } };
      if (k === "name" && p.mode === "new") next.data.slug = slugify(v as string);
      return next;
    });
  };

  const updateArr = (field: string, idx: number, val: string) =>
    setPanel((p) => {
      if (!p) return p;
      const arr = [...(p.data as any)[field]];
      arr[idx] = val;
      return { ...p, data: { ...p.data, [field]: arr } };
    });

  const addArr = (field: string) =>
    setPanel((p) => {
      if (!p) return p;
      return { ...p, data: { ...p.data, [field]: [...(p.data as any)[field], ""] } };
    });

  const removeArr = (field: string, idx: number) =>
    setPanel((p) => {
      if (!p) return p;
      const arr = [...(p.data as any)[field]];
      arr.splice(idx, 1);
      return { ...p, data: { ...p.data, [field]: arr.length ? arr : [""] } };
    });

  const renderArrayField = (label: string, field: string, placeholder: string, numbered?: boolean) => {
    const arr: string[] = (panel?.data as any)?.[field] || [""];
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-gray-600">{label}</label>
          <button type="button" onClick={() => addArr(field)} className="flex items-center gap-1 text-xs text-green-900 hover:text-green-700 font-semibold transition">
            <Plus size={12} strokeWidth={2} /> Add
          </button>
        </div>
        {arr.map((val, i) => (
          <div key={i} className="flex gap-2 items-center">
            {numbered && <span className="text-xs font-semibold text-gray-400 w-5 shrink-0">{i + 1}.</span>}
            <input
              value={val}
              onChange={(e) => updateArr(field, i, e.target.value)}
              placeholder={placeholder}
              className={`${inputCls} flex-1`}
            />
            {arr.length > 1 && (
              <button type="button" onClick={() => removeArr(field, i)} className="text-gray-300 hover:text-red-500 transition p-1.5">
                <X size={14} strokeWidth={1.5} />
              </button>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 text-xl font-bold">Tests & Procedures</h1>
          <p className="text-gray-500 text-sm mt-1">{items.filter((i) => i.status === "published").length} published · {items.length} total</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 bg-green-900 hover:bg-green-800 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition">
          <Plus size={14} strokeWidth={2} /> New Entry
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" strokeWidth={1.5} />
          <input type="text" placeholder="Search name, category…" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-green-700 bg-white shadow-sm transition" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(["all", "published", "draft"] as const).map((f) => (
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
                    <div className="h-2.5 w-20 bg-gray-100 rounded mb-2" />
                    <div className="h-4 w-16 bg-gray-100 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-12">No entries found.</p>
          ) : (
            <ul className="divide-y divide-gray-50">
              {filtered.map((item) => (
                <li key={item.id} className="flex items-start gap-3 px-5 py-4 hover:bg-gray-50 transition">
                  <div className="w-8 h-8 rounded-lg bg-green-900/10 flex items-center justify-center shrink-0">
                    <FlaskConical size={14} strokeWidth={1.5} className="text-green-900" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 font-semibold text-sm truncate">{item.name}</p>
                    {item.category && <p className="text-gray-400 text-xs mt-0.5">{item.category}</p>}
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize mt-1.5 inline-block ${STATUS_STYLES[item.status]}`}>{item.status}</span>
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
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-gray-900 font-semibold text-base">{panel.mode === "new" ? "New Entry" : "Edit Entry"}</h2>
              <button onClick={() => setPanel(null)} className="text-gray-300 hover:text-gray-600 transition"><X size={16} strokeWidth={1.5} /></button>
            </div>
            <div className="p-6 flex flex-col gap-5 max-h-[75vh] overflow-y-auto">
              <ImageUpload
                value={panel.data.images}
                onChange={(urls: string[]) => setField("images", urls)}
                label="Images"
                maxImages={4}
                aspectRatio="landscape"
                folder="tests"
              />

              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Basic Info</p>
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-600">Name</label>
                    <input value={panel.data.name} onChange={(e) => setField("name", e.target.value)} placeholder="Test/procedure name" className={inputCls} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-600">Category</label>
                    <input value={panel.data.category} onChange={(e) => setField("category", e.target.value)} placeholder="e.g. Blood Test" className={inputCls} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-600">Slug</label>
                    <input value={panel.data.slug} onChange={(e) => setField("slug", e.target.value)} placeholder="auto-generated" className={`${inputCls} text-gray-400`} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-600">Status</label>
                    <select value={panel.data.status} onChange={(e) => setField("status", e.target.value)} className={`${inputCls} appearance-none`}>
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                </div>
              </div>

              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider pt-2">Content Sections</p>
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">Overview <span className="text-gray-400 font-normal">(one paragraph per line)</span></label>
                  <textarea value={panel.data.overview} onChange={(e) => setField("overview", e.target.value)} rows={4} placeholder="Overview paragraph 1&#10;Overview paragraph 2" className={`${inputCls} resize-none`} />
                </div>

                {renderArrayField("Why It's Done", "whyItsDone", "e.g. To diagnose infections")}
                {renderArrayField("How to Prepare", "howToPrepare", "e.g. Fast for 8-12 hours before the test", true)}
                {renderArrayField("What to Expect", "whatToExpect", "e.g. A small blood sample will be drawn")}
                {renderArrayField("Results", "results", "e.g. Normal range: 4,500-11,000 cells/mcL")}
                {renderArrayField("Limitations", "limitations", "e.g. May produce false positives in certain conditions")}
              </div>

              <button onClick={save} disabled={!panel.data.name || saving} className="w-full bg-green-900 hover:bg-green-800 disabled:opacity-50 text-white text-sm font-semibold py-2.5 rounded-xl transition flex items-center justify-center gap-2">
                {saving && <Loader2 size={14} className="animate-spin" />}
                {panel.mode === "new" ? "Create Entry" : "Save Changes"}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-8 flex flex-col items-center justify-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
              <FlaskConical size={20} strokeWidth={1.5} className="text-gray-300" />
            </div>
            <p className="text-gray-400 text-sm">Select an entry to edit, or create a new one.</p>
          </div>
        )}
      </div>

      {deleteId && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl flex flex-col gap-4">
            <h3 className="text-gray-900 font-semibold text-base">Delete entry?</h3>
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
