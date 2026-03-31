"use client";

import { useState, useMemo } from "react";
import { Search, Plus, GraduationCap, Pencil, Trash2, X } from "lucide-react";

type SchoolStatus = "active" | "inactive";

type School = {
  id: string;
  name: string;
  description: string;
  programmes: string;
  dean: string;
  email: string;
  phone: string;
  accreditation: string;
  status: SchoolStatus;
};

const MOCK: School[] = [
  { id: "1", name: "School of Nursing", description: "Trains professional nurses in both general and specialist nursing disciplines.", programmes: "Basic Nursing, Post-Basic Nursing, Midwifery", dean: "Mrs. Folake Adeyemi", email: "nursing@oauthc.gov.ng", phone: "+234 036 230 410", accreditation: "Nursing and Midwifery Council of Nigeria", status: "active" },
  { id: "2", name: "School of Midwifery", description: "Provides training in midwifery care for mother and child health.", programmes: "Basic Midwifery", dean: "Mrs. Grace Olanrewaju", email: "midwifery@oauthc.gov.ng", phone: "+234 036 230 411", accreditation: "Nursing and Midwifery Council of Nigeria", status: "active" },
  { id: "3", name: "School of Health Information Management", description: "Trains health information management professionals for healthcare systems.", programmes: "Diploma in Health Information Management", dean: "Mr. Segun Akinwale", email: "him@oauthc.gov.ng", phone: "+234 036 230 412", accreditation: "Association of Health Information Managers of Nigeria", status: "active" },
  { id: "4", name: "School of Medical Laboratory Science", description: "Trains laboratory scientists to support clinical diagnosis.", programmes: "Diploma in Medical Laboratory Technology", dean: "Dr. Bisi Oyelola", email: "mls@oauthc.gov.ng", phone: "+234 036 230 413", accreditation: "Medical Laboratory Science Council of Nigeria", status: "active" },
  { id: "5", name: "School of Pharmacy Technicians", description: "Produces pharmacy technicians to support pharmacists in medicine dispensing.", programmes: "Diploma in Pharmacy Technology", dean: "Mr. Adewale Ola", email: "pharmacy-tech@oauthc.gov.ng", phone: "+234 036 230 414", accreditation: "Pharmacists Council of Nigeria", status: "active" },
  { id: "6", name: "School of Perioperative Nursing", description: "Specialised training for perioperative and theatre nursing practice.", programmes: "Post-Basic Perioperative Nursing", dean: "Mrs. Yetunde Sanni", email: "periop@oauthc.gov.ng", phone: "+234 036 230 415", accreditation: "Nursing and Midwifery Council of Nigeria", status: "inactive" },
];

const STATUS_STYLES: Record<SchoolStatus, string> = {
  active: "bg-green-50 text-green-800 border border-green-100",
  inactive: "bg-gray-100 text-gray-500 border border-gray-200",
};

const EMPTY: Omit<School, "id"> = { name: "", description: "", programmes: "", dean: "", email: "", phone: "", accreditation: "", status: "active" };

export default function SchoolsCMSPage() {
  const [items, setItems] = useState(MOCK);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<SchoolStatus | "all">("all");
  const [panel, setPanel] = useState<{ mode: "new" | "edit"; data: Omit<School, "id"> & { id?: string } } | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() =>
    items.filter((i) => {
      const matchSearch = i.name.toLowerCase().includes(search.toLowerCase()) || i.dean.toLowerCase().includes(search.toLowerCase());
      const matchFilter = filter === "all" || i.status === filter;
      return matchSearch && matchFilter;
    }), [items, search, filter]);

  const openNew = () => setPanel({ mode: "new", data: { ...EMPTY } });
  const openEdit = (item: School) => setPanel({ mode: "edit", data: { ...item } });
  const save = () => {
    if (!panel) return;
    if (panel.mode === "new") setItems((prev) => [{ ...panel.data, id: String(Date.now()) } as School, ...prev]);
    else setItems((prev) => prev.map((i) => i.id === panel.data.id ? { ...panel.data } as School : i));
    setPanel(null);
  };
  const remove = (id: string) => { setItems((prev) => prev.filter((i) => i.id !== id)); setDeleteId(null); };
  const setField = (k: string, v: string) => setPanel((p) => p ? { ...p, data: { ...p.data, [k]: v } } : p);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 text-xl font-bold">Schools & Training</h1>
          <p className="text-gray-500 text-sm mt-1">{items.filter((i) => i.status === "active").length} active · {items.length} total</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 bg-green-900 hover:bg-green-800 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition">
          <Plus size={14} strokeWidth={2} /> New
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" strokeWidth={1.5} />
          <input type="text" placeholder="Search name, dean…" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-green-700 bg-white shadow-sm transition" />
        </div>
        <div className="flex gap-2">
          {(["all", "active", "inactive"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-2 rounded-lg text-xs font-semibold capitalize transition ${filter === f ? "bg-green-900 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-green-900"}`}>{f}</button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 items-start">
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          {filtered.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-12">No schools found.</p>
          ) : (
            <ul className="divide-y divide-gray-50">
              {filtered.map((item) => (
                <li key={item.id} className="flex items-start gap-3 px-5 py-4 hover:bg-gray-50 transition">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0 mt-0.5">
                    <GraduationCap size={14} strokeWidth={1.5} className="text-indigo-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 font-semibold text-sm">{item.name}</p>
                    <p className="text-gray-400 text-xs mt-0.5">Dean: {item.dean}</p>
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
              <h2 className="text-gray-900 font-semibold text-base">{panel.mode === "new" ? "New School" : "Edit School"}</h2>
              <button onClick={() => setPanel(null)} className="text-gray-300 hover:text-gray-600 transition"><X size={16} strokeWidth={1.5} /></button>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600">School Name</label>
                <input value={panel.data.name} onChange={(e) => setField("name", e.target.value)} placeholder="e.g. School of Nursing" className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-green-700 bg-gray-50" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600">Description</label>
                <textarea value={panel.data.description} onChange={(e) => setField("description", e.target.value)} rows={3} placeholder="About this school…" className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-green-700 bg-gray-50 resize-none" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600">Programmes Offered</label>
                <input value={panel.data.programmes} onChange={(e) => setField("programmes", e.target.value)} placeholder="Comma-separated programme names" className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-green-700 bg-gray-50" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">Dean / Head</label>
                  <input value={panel.data.dean} onChange={(e) => setField("dean", e.target.value)} placeholder="Name" className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-green-700 bg-gray-50" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">Phone</label>
                  <input value={panel.data.phone} onChange={(e) => setField("phone", e.target.value)} placeholder="+234 8xx xxx xxxx" className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-green-700 bg-gray-50" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">Email</label>
                  <input type="email" value={panel.data.email} onChange={(e) => setField("email", e.target.value)} placeholder="school@oauthc.gov.ng" className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-green-700 bg-gray-50" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">Status</label>
                  <select value={panel.data.status} onChange={(e) => setField("status", e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-green-700 bg-gray-50 appearance-none">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600">Accreditation Body</label>
                <input value={panel.data.accreditation} onChange={(e) => setField("accreditation", e.target.value)} placeholder="Accrediting body name" className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-green-700 bg-gray-50" />
              </div>
            </div>
            <button onClick={save} disabled={!panel.data.name} className="w-full bg-green-900 hover:bg-green-800 disabled:opacity-50 text-white text-sm font-semibold py-2.5 rounded-xl transition">
              {panel.mode === "new" ? "Add School" : "Save Changes"}
            </button>
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-8 flex flex-col items-center justify-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
              <GraduationCap size={20} strokeWidth={1.5} className="text-gray-300" />
            </div>
            <p className="text-gray-400 text-sm">Select a school to edit, or add a new one.</p>
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
