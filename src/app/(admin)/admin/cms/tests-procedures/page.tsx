"use client";

import { useState, useMemo } from "react";
import { Search, Plus, FlaskConical, Pencil, Trash2, X } from "lucide-react";

type EntryStatus = "published" | "draft";

type TestEntry = {
  id: string;
  name: string;
  description: string;
  preparation: string;
  duration: string;
  category: string;
  department: string;
  status: EntryStatus;
};

const MOCK: TestEntry[] = [
  { id: "1", name: "Full Blood Count (FBC)", description: "A routine blood test that evaluates overall health and detects a wide range of disorders.", preparation: "No fasting required.", duration: "24 hours", category: "Laboratory", department: "Haematology", status: "published" },
  { id: "2", name: "CT Scan", description: "A computerised tomography scan that uses X-rays to create cross-sectional images of the body.", preparation: "Remove metal objects. Contrast dye may be used — fast for 4 hours if so.", duration: "15–30 minutes", category: "Imaging", department: "Radiology", status: "published" },
  { id: "3", name: "Electrocardiogram (ECG)", description: "Records the electrical activity of the heart at rest.", preparation: "No special preparation required.", duration: "10 minutes", category: "Cardiac", department: "Cardiology", status: "published" },
  { id: "4", name: "Colonoscopy", description: "An exam used to detect changes or abnormalities in the large intestine and rectum.", preparation: "Clear liquid diet the day before. Bowel prep medication required.", duration: "30–60 minutes", category: "Endoscopy", department: "Gastroenterology", status: "published" },
  { id: "5", name: "Pap Smear", description: "A procedure to test for cervical cancer in women.", preparation: "Avoid intercourse, douching or vaginal medicines 2 days before.", duration: "5–10 minutes", category: "Gynaecological", department: "Obstetrics & Gynaecology", status: "published" },
  { id: "6", name: "MRI Brain", description: "Magnetic resonance imaging of the brain to detect abnormalities.", preparation: "Remove all metallic objects. Inform staff of implants.", duration: "45–60 minutes", category: "Imaging", department: "Radiology", status: "published" },
  { id: "7", name: "Thyroid Function Test", description: "Blood tests that check how well the thyroid gland is working.", preparation: "Fasting for 8 hours recommended.", duration: "24–48 hours", category: "Laboratory", department: "Endocrinology", status: "draft" },
];

const STATUS_STYLES: Record<EntryStatus, string> = {
  published: "bg-green-50 text-green-800 border border-green-100",
  draft: "bg-gray-100 text-gray-500 border border-gray-200",
};

const EMPTY: Omit<TestEntry, "id"> = { name: "", description: "", preparation: "", duration: "", category: "", department: "", status: "draft" };

export default function TestsProceduresPage() {
  const [items, setItems] = useState(MOCK);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<EntryStatus | "all">("all");
  const [panel, setPanel] = useState<{ mode: "new" | "edit"; data: Omit<TestEntry, "id"> & { id?: string } } | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() =>
    items.filter((i) => {
      const matchSearch = i.name.toLowerCase().includes(search.toLowerCase()) || i.category.toLowerCase().includes(search.toLowerCase()) || i.department.toLowerCase().includes(search.toLowerCase());
      const matchFilter = filter === "all" || i.status === filter;
      return matchSearch && matchFilter;
    }), [items, search, filter]);

  const openNew = () => setPanel({ mode: "new", data: { ...EMPTY } });
  const openEdit = (item: TestEntry) => setPanel({ mode: "edit", data: { ...item } });
  const save = () => {
    if (!panel) return;
    if (panel.mode === "new") setItems((prev) => [{ ...panel.data, id: String(Date.now()) } as TestEntry, ...prev]);
    else setItems((prev) => prev.map((i) => i.id === panel.data.id ? { ...panel.data } as TestEntry : i));
    setPanel(null);
  };
  const remove = (id: string) => { setItems((prev) => prev.filter((i) => i.id !== id)); setDeleteId(null); };
  const setField = (k: string, v: string) => setPanel((p) => p ? { ...p, data: { ...p.data, [k]: v } } : p);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 text-xl font-bold">Tests & Procedures</h1>
          <p className="text-gray-500 text-sm mt-1">{items.filter((i) => i.status === "published").length} published · {items.length} total</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 bg-green-900 hover:bg-green-800 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition">
          <Plus size={14} strokeWidth={2} /> New
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" strokeWidth={1.5} />
          <input type="text" placeholder="Search name, category…" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-green-700 bg-white shadow-sm transition" />
        </div>
        <div className="flex gap-2">
          {(["all", "published", "draft"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-2 rounded-lg text-xs font-semibold capitalize transition ${filter === f ? "bg-green-900 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-green-900"}`}>{f}</button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 items-start">
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          {filtered.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-12">No entries found.</p>
          ) : (
            <ul className="divide-y divide-gray-50">
              {filtered.map((item) => (
                <li key={item.id} className="flex items-start gap-3 px-5 py-4 hover:bg-gray-50 transition">
                  <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center shrink-0 mt-0.5">
                    <FlaskConical size={14} strokeWidth={1.5} className="text-violet-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 font-semibold text-sm">{item.name}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{item.category} · {item.department}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${STATUS_STYLES[item.status]}`}>{item.status}</span>
                      <span className="text-[10px] text-gray-400">{item.duration}</span>
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
              <h2 className="text-gray-900 font-semibold text-base">{panel.mode === "new" ? "New Entry" : "Edit Entry"}</h2>
              <button onClick={() => setPanel(null)} className="text-gray-300 hover:text-gray-600 transition"><X size={16} strokeWidth={1.5} /></button>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600">Name</label>
                <input value={panel.data.name} onChange={(e) => setField("name", e.target.value)} placeholder="Test or procedure name" className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-green-700 bg-gray-50" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600">Description</label>
                <textarea value={panel.data.description} onChange={(e) => setField("description", e.target.value)} rows={3} placeholder="What is this test?" className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-green-700 bg-gray-50 resize-none" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600">Preparation Instructions</label>
                <textarea value={panel.data.preparation} onChange={(e) => setField("preparation", e.target.value)} rows={2} placeholder="How should the patient prepare?" className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-green-700 bg-gray-50 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">Category</label>
                  <input value={panel.data.category} onChange={(e) => setField("category", e.target.value)} placeholder="e.g. Imaging" className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-green-700 bg-gray-50" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">Department</label>
                  <input value={panel.data.department} onChange={(e) => setField("department", e.target.value)} placeholder="e.g. Radiology" className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-green-700 bg-gray-50" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">Duration</label>
                  <input value={panel.data.duration} onChange={(e) => setField("duration", e.target.value)} placeholder="e.g. 15–30 minutes" className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-green-700 bg-gray-50" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">Status</label>
                  <select value={panel.data.status} onChange={(e) => setField("status", e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-green-700 bg-gray-50 appearance-none">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>
            </div>
            <button onClick={save} disabled={!panel.data.name} className="w-full bg-green-900 hover:bg-green-800 disabled:opacity-50 text-white text-sm font-semibold py-2.5 rounded-xl transition">
              {panel.mode === "new" ? "Create Entry" : "Save Changes"}
            </button>
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
