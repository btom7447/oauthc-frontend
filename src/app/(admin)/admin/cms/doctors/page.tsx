"use client";

import { useState, useMemo } from "react";
import { Search, Plus, Stethoscope, Pencil, Trash2, X } from "lucide-react";

type DoctorStatus = "active" | "inactive" | "on-leave";

type Doctor = {
  id: string;
  name: string;
  specialty: string;
  department: string;
  email: string;
  phone: string;
  bio: string;
  status: DoctorStatus;
  available: boolean;
};

const MOCK: Doctor[] = [
  { id: "1", name: "Dr. Adewale Ojo", specialty: "Cardiology", department: "Cardiology", email: "a.ojo@oauthc.gov.ng", phone: "+234 801 000 0001", bio: "Consultant Cardiologist with over 15 years of experience.", status: "active", available: true },
  { id: "2", name: "Dr. Ngozi Chukwu", specialty: "Radiology", department: "Radiology", email: "n.chukwu@oauthc.gov.ng", phone: "+234 801 000 0002", bio: "Specialist in diagnostic and interventional radiology.", status: "active", available: true },
  { id: "3", name: "Dr. Tunde Lawal", specialty: "Neurology", department: "Neurology", email: "t.lawal@oauthc.gov.ng", phone: "+234 801 000 0003", bio: "Neurologist specialising in stroke and epilepsy management.", status: "active", available: false },
  { id: "4", name: "Dr. Kemi Adeyinka", specialty: "Ophthalmology", department: "Ophthalmology", email: "k.adeyinka@oauthc.gov.ng", phone: "+234 801 000 0004", bio: "Eye specialist with expertise in cataract and glaucoma surgery.", status: "active", available: true },
  { id: "5", name: "Dr. Yetunde Abiola", specialty: "Oncology", department: "Oncology", email: "y.abiola@oauthc.gov.ng", phone: "+234 801 000 0005", bio: "Medical oncologist focused on breast and colorectal cancers.", status: "on-leave", available: false },
  { id: "6", name: "Dr. Emeka Nwosu", specialty: "Paediatrics", department: "Paediatrics", email: "e.nwosu@oauthc.gov.ng", phone: "+234 801 000 0006", bio: "Consultant paediatrician with a focus on neonatal care.", status: "active", available: true },
];

const STATUS_STYLES: Record<DoctorStatus, string> = {
  active: "bg-green-50 text-green-800 border border-green-100",
  inactive: "bg-gray-100 text-gray-500 border border-gray-200",
  "on-leave": "bg-amber-50 text-amber-700 border border-amber-100",
};

const EMPTY: Omit<Doctor, "id"> = { name: "", specialty: "", department: "", email: "", phone: "", bio: "", status: "active", available: true };

export default function DoctorsCMSPage() {
  const [items, setItems] = useState(MOCK);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<DoctorStatus | "all">("all");
  const [panel, setPanel] = useState<{ mode: "new" | "edit"; data: Omit<Doctor, "id"> & { id?: string } } | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() =>
    items.filter((i) => {
      const matchSearch = i.name.toLowerCase().includes(search.toLowerCase()) || i.specialty.toLowerCase().includes(search.toLowerCase()) || i.department.toLowerCase().includes(search.toLowerCase());
      const matchFilter = filter === "all" || i.status === filter;
      return matchSearch && matchFilter;
    }), [items, search, filter]);

  const openNew = () => setPanel({ mode: "new", data: { ...EMPTY } });
  const openEdit = (item: Doctor) => setPanel({ mode: "edit", data: { ...item } });

  const save = () => {
    if (!panel) return;
    if (panel.mode === "new") {
      setItems((prev) => [{ ...panel.data, id: String(Date.now()) } as Doctor, ...prev]);
    } else {
      setItems((prev) => prev.map((i) => i.id === panel.data.id ? { ...panel.data } as Doctor : i));
    }
    setPanel(null);
  };

  const remove = (id: string) => { setItems((prev) => prev.filter((i) => i.id !== id)); setDeleteId(null); };
  const setField = (k: string, v: string | boolean) => setPanel((p) => p ? { ...p, data: { ...p.data, [k]: v } } : p);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 text-xl font-bold">Doctors</h1>
          <p className="text-gray-500 text-sm mt-1">{items.filter((i) => i.status === "active").length} active · {items.length} total</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 bg-green-900 hover:bg-green-800 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition">
          <Plus size={14} strokeWidth={2} /> New
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" strokeWidth={1.5} />
          <input type="text" placeholder="Search name, specialty…" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-green-700 bg-white shadow-sm transition" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(["all", "active", "on-leave", "inactive"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-2 rounded-lg text-xs font-semibold capitalize transition ${filter === f ? "bg-green-900 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-green-900"}`}>{f.replace("-", " ")}</button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 items-start">
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          {filtered.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-12">No doctors found.</p>
          ) : (
            <ul className="divide-y divide-gray-50">
              {filtered.map((item) => (
                <li key={item.id} className="flex items-start gap-3 px-5 py-4 hover:bg-gray-50 transition">
                  <div className="w-9 h-9 rounded-full bg-green-900/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Stethoscope size={14} strokeWidth={1.5} className="text-green-900" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 font-semibold text-sm">{item.name}</p>
                    <p className="text-gray-500 text-xs">{item.specialty} · {item.department}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${STATUS_STYLES[item.status]}`}>{item.status.replace("-", " ")}</span>
                      {item.available && <span className="text-[10px] text-green-700 font-semibold">Available</span>}
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
              <h2 className="text-gray-900 font-semibold text-base">{panel.mode === "new" ? "New Doctor" : "Edit Doctor"}</h2>
              <button onClick={() => setPanel(null)} className="text-gray-300 hover:text-gray-600 transition"><X size={16} strokeWidth={1.5} /></button>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600">Full Name</label>
                <input value={panel.data.name} onChange={(e) => setField("name", e.target.value)} placeholder="Dr. Full Name" className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-green-700 bg-gray-50" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">Specialty</label>
                  <input value={panel.data.specialty} onChange={(e) => setField("specialty", e.target.value)} placeholder="e.g. Cardiology" className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-green-700 bg-gray-50" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">Department</label>
                  <input value={panel.data.department} onChange={(e) => setField("department", e.target.value)} placeholder="Department" className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-green-700 bg-gray-50" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">Email</label>
                  <input type="email" value={panel.data.email} onChange={(e) => setField("email", e.target.value)} placeholder="email@oauthc.gov.ng" className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-green-700 bg-gray-50" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">Phone</label>
                  <input value={panel.data.phone} onChange={(e) => setField("phone", e.target.value)} placeholder="+234 8xx xxx xxxx" className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-green-700 bg-gray-50" />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600">Bio</label>
                <textarea value={panel.data.bio} onChange={(e) => setField("bio", e.target.value)} rows={3} placeholder="Short biography…" className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-green-700 bg-gray-50 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">Status</label>
                  <select value={panel.data.status} onChange={(e) => setField("status", e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-green-700 bg-gray-50 appearance-none">
                    <option value="active">Active</option>
                    <option value="on-leave">On Leave</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">Availability</label>
                  <select value={panel.data.available ? "yes" : "no"} onChange={(e) => setField("available", e.target.value === "yes")} className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-green-700 bg-gray-50 appearance-none">
                    <option value="yes">Available</option>
                    <option value="no">Unavailable</option>
                  </select>
                </div>
              </div>
            </div>
            <button onClick={save} disabled={!panel.data.name} className="w-full bg-green-900 hover:bg-green-800 disabled:opacity-50 text-white text-sm font-semibold py-2.5 rounded-xl transition">
              {panel.mode === "new" ? "Add Doctor" : "Save Changes"}
            </button>
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-8 flex flex-col items-center justify-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
              <Stethoscope size={20} strokeWidth={1.5} className="text-gray-300" />
            </div>
            <p className="text-gray-400 text-sm">Select a doctor to edit, or add a new profile.</p>
          </div>
        )}
      </div>

      {deleteId && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl flex flex-col gap-4">
            <h3 className="text-gray-900 font-semibold text-base">Remove doctor?</h3>
            <p className="text-gray-500 text-sm">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 border border-gray-200 text-gray-700 text-sm font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition">Cancel</button>
              <button onClick={() => remove(deleteId)} className="flex-1 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold py-2.5 rounded-xl transition">Remove</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
