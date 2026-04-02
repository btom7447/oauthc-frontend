"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { api } from "@/lib/api-client";
import toast from "react-hot-toast";
import { Search, Plus, GraduationCap, Pencil, Trash2, X, Loader2, PlusCircle, XCircle } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";

type SchoolStatus = "active" | "inactive";
type Programme = { name: string; duration: string; details: string };
type Facility = { title: string; detail: string };
type FacultyMember = { name: string; office: string; qualification: string; image: string };

type SchoolAPI = {
  id: string;
  name: string;
  slug: string;
  image: string;
  tagline: string;
  overview: string[];
  programmes: Programme[];
  facilities: Facility[];
  moreDetails: string[];
  facultyMembers: FacultyMember[];
  dean: string;
  email: string;
  phone: string;
  accreditation: string;
  status: SchoolStatus;
};

type SchoolForm = {
  id?: string;
  name: string;
  slug: string;
  image: string;
  tagline: string;
  overview: string;
  programmes: Programme[];
  facilities: Facility[];
  moreDetails: string;
  facultyMembers: FacultyMember[];
  dean: string;
  email: string;
  phone: string;
  accreditation: string;
  status: SchoolStatus;
};

const STATUS_STYLES: Record<SchoolStatus, string> = {
  active: "bg-green-50 text-green-800 border border-green-100",
  inactive: "bg-gray-100 text-gray-500 border border-gray-200",
};

function toForm(a: SchoolAPI): SchoolForm {
  return {
    ...a,
    overview: (a.overview || []).join("\n"),
    programmes: a.programmes?.length ? a.programmes : [{ name: "", duration: "", details: "" }],
    facilities: a.facilities?.length ? a.facilities : [{ title: "", detail: "" }],
    moreDetails: (a.moreDetails || []).join("\n"),
    facultyMembers: a.facultyMembers?.length ? a.facultyMembers : [{ name: "", office: "", qualification: "", image: "" }],
  };
}

function toPayload(f: SchoolForm) {
  return {
    name: f.name, slug: f.slug, image: f.image, tagline: f.tagline,
    dean: f.dean, email: f.email, phone: f.phone, accreditation: f.accreditation, status: f.status,
    overview: f.overview.split("\n").map((s) => s.trim()).filter(Boolean),
    programmes: f.programmes.filter((p) => p.name.trim()),
    facilities: f.facilities.filter((fac) => fac.title.trim()),
    moreDetails: f.moreDetails.split("\n").map((s) => s.trim()).filter(Boolean),
    facultyMembers: f.facultyMembers.filter((fm) => fm.name.trim()),
  };
}

const EMPTY: SchoolForm = {
  name: "", slug: "", image: "", tagline: "", overview: "",
  programmes: [{ name: "", duration: "", details: "" }],
  facilities: [{ title: "", detail: "" }],
  moreDetails: "",
  facultyMembers: [{ name: "", office: "", qualification: "", image: "" }],
  dean: "", email: "", phone: "", accreditation: "", status: "active",
};

const inputCls = "border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-green-700 bg-gray-50";

function slugify(s: string) { return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); }

export default function SchoolsPage() {
  const [items, setItems] = useState<SchoolForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [panel, setPanel] = useState<{ mode: "new" | "edit"; data: SchoolForm } | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    const res = await api.get<SchoolAPI[]>("/admin/cms/schools?limit=200");
    if (res.ok && res.data) setItems(res.data.map(toForm));
    setLoading(false);
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const filtered = useMemo(() =>
    items.filter((i) => i.name.toLowerCase().includes(search.toLowerCase())), [items, search]);

  const openNew = () => setPanel({ mode: "new", data: { ...EMPTY, programmes: [{ name: "", duration: "", details: "" }], facilities: [{ title: "", detail: "" }], facultyMembers: [{ name: "", office: "", qualification: "", image: "" }] } });
  const openEdit = (item: SchoolForm) => setPanel({
    mode: "edit",
    data: { ...item, programmes: item.programmes.map((p) => ({ ...p })), facilities: item.facilities.map((f) => ({ ...f })), facultyMembers: item.facultyMembers.map((f) => ({ ...f })) },
  });

  const save = async () => {
    if (!panel) return;
    setSaving(true);
    const payload = toPayload(panel.data);
    if (panel.mode === "new") {
      const res = await api.post<SchoolAPI>("/admin/cms/schools", payload);
      if (res.ok && res.data) { setItems((prev) => [toForm(res.data!), ...prev]); toast.success("School created"); }
      else toast.error(res.error || "Failed to create");
    } else {
      const res = await api.patch<SchoolAPI>(`/admin/cms/schools/${panel.data.id}`, payload);
      if (res.ok && res.data) { setItems((prev) => prev.map((i) => i.id === panel.data.id ? toForm(res.data!) : i)); toast.success("School updated"); }
      else toast.error(res.error || "Failed to update");
    }
    setSaving(false);
    setPanel(null);
  };

  const remove = async (id: string) => {
    const res = await api.del(`/admin/cms/schools/${id}`);
    if (res.ok) { setItems((prev) => prev.filter((i) => i.id !== id)); toast.success("School deleted"); if (panel?.data.id === id) setPanel(null); }
    else toast.error(res.error || "Failed to delete");
    setDeleteId(null);
  };

  const setField = (k: string, v: string) => {
    setPanel((p) => {
      if (!p) return p;
      const next = { ...p, data: { ...p.data, [k]: v } };
      if (k === "name" && p.mode === "new") next.data.slug = slugify(v);
      return next;
    });
  };

  /* ── Array helpers ── */
  const updateArr = <T,>(key: "programmes" | "facilities" | "facultyMembers", idx: number, field: string, val: string) => {
    setPanel((p) => {
      if (!p) return p;
      const arr = [...(p.data[key] as any[])];
      arr[idx] = { ...arr[idx], [field]: val };
      return { ...p, data: { ...p.data, [key]: arr } };
    });
  };
  const addArr = (key: "programmes" | "facilities" | "facultyMembers") => {
    const empties: Record<string, any> = {
      programmes: { name: "", duration: "", details: "" },
      facilities: { title: "", detail: "" },
      facultyMembers: { name: "", office: "", qualification: "", image: "" },
    };
    setPanel((p) => p ? { ...p, data: { ...p.data, [key]: [...(p.data[key] as any[]), empties[key]] } } : p);
  };
  const removeArr = (key: "programmes" | "facilities" | "facultyMembers", idx: number) => {
    const empties: Record<string, any> = {
      programmes: { name: "", duration: "", details: "" },
      facilities: { title: "", detail: "" },
      facultyMembers: { name: "", office: "", qualification: "", image: "" },
    };
    setPanel((p) => {
      if (!p) return p;
      const arr = (p.data[key] as any[]).filter((_, i) => i !== idx);
      return { ...p, data: { ...p.data, [key]: arr.length ? arr : [empties[key]] } };
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 text-xl font-bold">Schools & Training</h1>
          <p className="text-gray-500 text-sm mt-1">{items.filter((i) => i.status === "active").length} active · {items.length} total</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 bg-green-900 hover:bg-green-800 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition">
          <Plus size={14} strokeWidth={2} /> New School
        </button>
      </div>

      <div className="relative max-w-xs">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" strokeWidth={1.5} />
        <input type="text" placeholder="Search schools…" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-green-700 bg-white shadow-sm transition" />
      </div>

      <div className="grid lg:grid-cols-2 gap-4 items-start">
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="divide-y divide-gray-50">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-start gap-3 px-5 py-4 animate-pulse">
                  <div className="w-8 h-8 rounded-lg bg-gray-200 shrink-0" />
                  <div className="flex-1">
                    <div className="h-3.5 w-44 bg-gray-200 rounded mb-2" />
                    <div className="h-2.5 w-56 bg-gray-100 rounded mb-2" />
                    <div className="h-4 w-14 bg-gray-100 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-12">No schools found.</p>
          ) : (
            <ul className="divide-y divide-gray-50">
              {filtered.map((item) => (
                <li key={item.id} className="flex items-start gap-3 px-5 py-4 hover:bg-gray-50 transition">
                  <div className="w-8 h-8 rounded-lg bg-green-900/10 flex items-center justify-center shrink-0">
                    <GraduationCap size={14} strokeWidth={1.5} className="text-green-900" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 font-semibold text-sm truncate">{item.name}</p>
                    <p className="text-gray-400 text-xs mt-0.5 line-clamp-1">{item.tagline}</p>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize mt-1.5 inline-block ${STATUS_STYLES[item.status]}`}>{item.status}</span>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => openEdit(item)} className="p-1.5 text-gray-300 hover:text-green-900 transition"><Pencil size={13} strokeWidth={1.5} /></button>
                    <button onClick={() => setDeleteId(item.id!)} className="p-1.5 text-gray-300 hover:text-red-500 transition"><Trash2 size={13} strokeWidth={1.5} /></button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {panel ? (
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-gray-900 font-semibold text-base">{panel.mode === "new" ? "New School" : "Edit School"}</h2>
              <button onClick={() => setPanel(null)} className="text-gray-300 hover:text-gray-600 transition"><X size={16} strokeWidth={1.5} /></button>
            </div>
            <div className="p-6 flex flex-col gap-5 max-h-[75vh] overflow-y-auto">
              <ImageUpload value={panel.data.image} onChange={(v) => setField("image", v)} label="Image" aspectRatio="landscape" folder="schools" />

              {/* Core */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">School Name</label>
                  <input value={panel.data.name} onChange={(e) => setField("name", e.target.value)} placeholder="School of Nursing" className={inputCls} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-600">Slug</label>
                    <input value={panel.data.slug} onChange={(e) => setField("slug", e.target.value)} placeholder="auto-generated" className={`${inputCls} text-gray-400`} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-600">Status</label>
                    <select value={panel.data.status} onChange={(e) => setField("status", e.target.value)} className={`${inputCls} appearance-none`}>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">Tagline</label>
                  <input value={panel.data.tagline} onChange={(e) => setField("tagline", e.target.value)} placeholder="Short description" className={inputCls} />
                </div>
              </div>

              {/* Overview */}
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider pt-2">Overview</p>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600">Overview Paragraphs <span className="text-gray-400 font-normal">(one per line)</span></label>
                <textarea value={panel.data.overview} onChange={(e) => setField("overview", e.target.value)} rows={4} placeholder="Paragraph 1&#10;Paragraph 2" className={`${inputCls} resize-none`} />
              </div>

              {/* Programmes */}
              <div className="flex items-center justify-between pt-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Programmes</p>
                <button type="button" onClick={() => addArr("programmes")} className="flex items-center gap-1 text-xs font-semibold text-green-800 hover:text-green-900 transition">
                  <PlusCircle size={13} strokeWidth={1.5} /> Add
                </button>
              </div>
              <div className="flex flex-col gap-3">
                {panel.data.programmes.map((p, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input value={p.name} onChange={(e) => updateArr("programmes", idx, "name", e.target.value)} placeholder="Programme name" className={`${inputCls} flex-1`} />
                    <input value={p.duration} onChange={(e) => updateArr("programmes", idx, "duration", e.target.value)} placeholder="Duration" className={`${inputCls} w-28`} />
                    <input value={p.details} onChange={(e) => updateArr("programmes", idx, "details", e.target.value)} placeholder="Details" className={`${inputCls} flex-1`} />
                    <button type="button" onClick={() => removeArr("programmes", idx)} className="text-gray-300 hover:text-red-500 transition shrink-0">
                      <XCircle size={16} strokeWidth={1.5} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Facilities */}
              <div className="flex items-center justify-between pt-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Facilities & Resources</p>
                <button type="button" onClick={() => addArr("facilities")} className="flex items-center gap-1 text-xs font-semibold text-green-800 hover:text-green-900 transition">
                  <PlusCircle size={13} strokeWidth={1.5} /> Add
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {panel.data.facilities.map((f, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input value={f.title} onChange={(e) => updateArr("facilities", idx, "title", e.target.value)} placeholder="Facility name" className={`${inputCls} w-2/5`} />
                    <input value={f.detail} onChange={(e) => updateArr("facilities", idx, "detail", e.target.value)} placeholder="Detail" className={`${inputCls} flex-1`} />
                    <button type="button" onClick={() => removeArr("facilities", idx)} className="text-gray-300 hover:text-red-500 transition shrink-0">
                      <XCircle size={16} strokeWidth={1.5} />
                    </button>
                  </div>
                ))}
              </div>

              {/* More Details */}
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider pt-2">More Details</p>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600">Additional Paragraphs <span className="text-gray-400 font-normal">(one per line)</span></label>
                <textarea value={panel.data.moreDetails} onChange={(e) => setField("moreDetails", e.target.value)} rows={3} placeholder="Additional info paragraph 1&#10;Paragraph 2" className={`${inputCls} resize-none`} />
              </div>

              {/* Faculty */}
              <div className="flex items-center justify-between pt-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Faculty Members</p>
                <button type="button" onClick={() => addArr("facultyMembers")} className="flex items-center gap-1 text-xs font-semibold text-green-800 hover:text-green-900 transition">
                  <PlusCircle size={13} strokeWidth={1.5} /> Add
                </button>
              </div>
              <div className="flex flex-col gap-3">
                {panel.data.facultyMembers.map((fm, idx) => (
                  <div key={idx} className="flex flex-col gap-2 border border-gray-100 rounded-lg p-3 bg-gray-50/50">
                    <div className="flex items-center gap-2">
                      <input value={fm.name} onChange={(e) => updateArr("facultyMembers", idx, "name", e.target.value)} placeholder="Full name" className={`${inputCls} flex-1 bg-white`} />
                      <input value={fm.office} onChange={(e) => updateArr("facultyMembers", idx, "office", e.target.value)} placeholder="Office/Role" className={`${inputCls} flex-1 bg-white`} />
                      <button type="button" onClick={() => removeArr("facultyMembers", idx)} className="text-gray-300 hover:text-red-500 transition shrink-0">
                        <XCircle size={16} strokeWidth={1.5} />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <input value={fm.qualification} onChange={(e) => updateArr("facultyMembers", idx, "qualification", e.target.value)} placeholder="Qualification" className={`${inputCls} flex-1 bg-white`} />
                      <input value={fm.image} onChange={(e) => updateArr("facultyMembers", idx, "image", e.target.value)} placeholder="Image URL (optional)" className={`${inputCls} flex-1 bg-white text-gray-400`} />
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={save} disabled={!panel.data.name || saving} className="w-full bg-green-900 hover:bg-green-800 disabled:opacity-50 text-white text-sm font-semibold py-2.5 rounded-xl transition flex items-center justify-center gap-2">
                {saving && <Loader2 size={14} className="animate-spin" />}
                {panel.mode === "new" ? "Create School" : "Save Changes"}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-8 flex flex-col items-center justify-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
              <GraduationCap size={20} strokeWidth={1.5} className="text-gray-300" />
            </div>
            <p className="text-gray-400 text-sm">Select a school to edit, or create a new one.</p>
          </div>
        )}
      </div>

      {deleteId && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl flex flex-col gap-4">
            <h3 className="text-gray-900 font-semibold text-base">Delete school?</h3>
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
