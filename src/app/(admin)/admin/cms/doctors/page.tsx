"use client";

import { useState, useMemo } from "react";
import { Search, Plus, Stethoscope, Pencil, Trash2, X } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";

type DoctorStatus = "active" | "inactive" | "on-leave";
type Education = { degree: string; institution: string; year: string };

type Doctor = {
  id: string;
  name: string;
  slug: string;
  image: string;
  gender: "male" | "female";
  specialty: string;
  department: string;
  center: string;
  yearsOfExperience: string;
  languages: string;
  qualifications: string;
  bio: string;
  expertise: string;
  education: Education[];
  socialLinkedin: string;
  socialFacebook: string;
  socialInstagram: string;
  email: string;
  phone: string;
  status: DoctorStatus;
  available: boolean;
};

const MOCK: Doctor[] = [
  { id: "1", name: "Dr. Adewale Ojo", slug: "dr-adewale-ojo", image: "", gender: "male", specialty: "Cardiology", department: "Cardiology", center: "OAUTHC Main Campus", yearsOfExperience: "15", languages: "English, Yoruba", qualifications: "MBBS, FWACP", bio: "Consultant Cardiologist with over 15 years of clinical experience.\nSpecialises in interventional cardiology and heart failure management.", expertise: "Interventional Cardiology\nHeart Failure\nHypertension", education: [{ degree: "MBBS", institution: "Obafemi Awolowo University", year: "2005" }, { degree: "FWACP", institution: "West African College of Physicians", year: "2012" }], socialLinkedin: "", socialFacebook: "", socialInstagram: "", email: "a.ojo@oauthc.gov.ng", phone: "+234 801 000 0001", status: "active", available: true },
  { id: "2", name: "Dr. Ngozi Chukwu", slug: "dr-ngozi-chukwu", image: "", gender: "female", specialty: "Radiology", department: "Radiology", center: "OAUTHC Main Campus", yearsOfExperience: "10", languages: "English, Igbo", qualifications: "MBBS, FMCR", bio: "Specialist in diagnostic and interventional radiology.", expertise: "CT Imaging\nMRI Interpretation\nInterventional Radiology", education: [{ degree: "MBBS", institution: "University of Nigeria, Nsukka", year: "2008" }], socialLinkedin: "", socialFacebook: "", socialInstagram: "", email: "n.chukwu@oauthc.gov.ng", phone: "+234 801 000 0002", status: "active", available: true },
];

const STATUS_STYLES: Record<DoctorStatus, string> = {
  active: "bg-green-50 text-green-800 border border-green-100",
  inactive: "bg-gray-100 text-gray-500 border border-gray-200",
  "on-leave": "bg-amber-50 text-amber-700 border border-amber-100",
};

const EMPTY_EDU: Education = { degree: "", institution: "", year: "" };
const EMPTY: Omit<Doctor, "id"> = { name: "", slug: "", image: "", gender: "male", specialty: "", department: "", center: "", yearsOfExperience: "", languages: "", qualifications: "", bio: "", expertise: "", education: [], socialLinkedin: "", socialFacebook: "", socialInstagram: "", email: "", phone: "", status: "active", available: true };

function slugify(s: string) { return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); }

export default function DoctorsCMSPage() {
  const [items, setItems] = useState(MOCK);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<DoctorStatus | "all">("all");
  const [panel, setPanel] = useState<{ mode: "new" | "edit"; data: Omit<Doctor, "id"> & { id?: string } } | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() =>
    items.filter((i) => {
      const matchSearch = i.name.toLowerCase().includes(search.toLowerCase()) || i.specialty.toLowerCase().includes(search.toLowerCase());
      return matchSearch && (filter === "all" || i.status === filter);
    }), [items, search, filter]);

  const openNew = () => setPanel({ mode: "new", data: { ...EMPTY, education: [] } });
  const openEdit = (item: Doctor) => setPanel({ mode: "edit", data: { ...item } });

  const save = () => {
    if (!panel) return;
    if (panel.mode === "new") setItems((prev) => [{ ...panel.data, id: String(Date.now()) } as Doctor, ...prev]);
    else setItems((prev) => prev.map((i) => i.id === panel.data.id ? { ...panel.data } as Doctor : i));
    setPanel(null);
  };

  const remove = (id: string) => { setItems((prev) => prev.filter((i) => i.id !== id)); setDeleteId(null); };

  const setField = (k: string, v: string | boolean) => setPanel((p) => {
    if (!p) return p;
    const next = { ...p, data: { ...p.data, [k]: v } };
    if (k === "name" && p.mode === "new") next.data.slug = slugify(v as string);
    return next;
  });

  const setEdu = (idx: number, k: keyof Education, v: string) => setPanel((p) => {
    if (!p) return p;
    const education = [...p.data.education];
    education[idx] = { ...education[idx], [k]: v };
    return { ...p, data: { ...p.data, education } };
  });

  const addEdu = () => setPanel((p) => p ? { ...p, data: { ...p.data, education: [...p.data.education, { ...EMPTY_EDU }] } } : p);
  const removeEdu = (idx: number) => setPanel((p) => p ? { ...p, data: { ...p.data, education: p.data.education.filter((_, i) => i !== idx) } } : p);

  const inputCls = "border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-green-700 bg-gray-50";

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

      <div className="grid lg:grid-cols-5 gap-4 items-start">
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
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
                    <p className="text-gray-500 text-xs">{item.specialty} · {item.yearsOfExperience}yr</p>
                    <div className="flex items-center gap-2 mt-1.5">
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
          <div className="lg:col-span-3 bg-white border border-gray-100 rounded-xl shadow-sm p-6 flex flex-col gap-5 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between sticky top-0 bg-white pb-3 border-b border-gray-50 z-10">
              <h2 className="text-gray-900 font-semibold text-base">{panel.mode === "new" ? "New Doctor" : "Edit Doctor"}</h2>
              <button onClick={() => setPanel(null)} className="text-gray-300 hover:text-gray-600 transition"><X size={16} strokeWidth={1.5} /></button>
            </div>

            <ImageUpload value={panel.data.image} onChange={(url) => setField("image", url)} label="Profile Photo" aspectRatio="square" folder="oauthc/doctors" />

            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Basic Info</p>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600">Full Name</label>
              <input value={panel.data.name} onChange={(e) => setField("name", e.target.value)} placeholder="Dr. Full Name" className={inputCls} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600">Slug</label>
                <input value={panel.data.slug} onChange={(e) => setField("slug", e.target.value)} placeholder="url-friendly-name" className={inputCls} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600">Gender</label>
                <select value={panel.data.gender} onChange={(e) => setField("gender", e.target.value)} className={`${inputCls} appearance-none`}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600">Specialty</label>
                <input value={panel.data.specialty} onChange={(e) => setField("specialty", e.target.value)} placeholder="e.g. Cardiology" className={inputCls} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600">Department</label>
                <input value={panel.data.department} onChange={(e) => setField("department", e.target.value)} placeholder="Department" className={inputCls} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600">Centre / Hospital</label>
                <input value={panel.data.center} onChange={(e) => setField("center", e.target.value)} placeholder="OAUTHC Main Campus" className={inputCls} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600">Years of Experience</label>
                <input type="number" min="0" value={panel.data.yearsOfExperience} onChange={(e) => setField("yearsOfExperience", e.target.value)} placeholder="15" className={inputCls} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600">Languages <span className="font-normal text-gray-400">(comma-sep.)</span></label>
                <input value={panel.data.languages} onChange={(e) => setField("languages", e.target.value)} placeholder="English, Yoruba" className={inputCls} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600">Qualifications <span className="font-normal text-gray-400">(comma-sep.)</span></label>
                <input value={panel.data.qualifications} onChange={(e) => setField("qualifications", e.target.value)} placeholder="MBBS, FWACP" className={inputCls} />
              </div>
            </div>

            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pt-1">Contact</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600">Email</label>
                <input type="email" value={panel.data.email} onChange={(e) => setField("email", e.target.value)} placeholder="doctor@oauthc.gov.ng" className={inputCls} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600">Phone</label>
                <input value={panel.data.phone} onChange={(e) => setField("phone", e.target.value)} placeholder="+234 8xx xxx xxxx" className={inputCls} />
              </div>
            </div>

            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pt-1">Profile Content</p>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600">Bio <span className="font-normal text-gray-400">(one paragraph per line)</span></label>
              <textarea value={panel.data.bio} onChange={(e) => setField("bio", e.target.value)} rows={4} placeholder={"Paragraph 1\nParagraph 2"} className={`${inputCls} resize-none`} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600">Areas of Expertise <span className="font-normal text-gray-400">(one per line)</span></label>
              <textarea value={panel.data.expertise} onChange={(e) => setField("expertise", e.target.value)} rows={3} placeholder={"Interventional Cardiology\nHeart Failure"} className={`${inputCls} resize-none`} />
            </div>

            <div className="flex items-center justify-between pt-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Education</p>
              <button type="button" onClick={addEdu} className="text-xs text-green-900 font-semibold hover:underline">+ Add</button>
            </div>
            {panel.data.education.map((edu, idx) => (
              <div key={idx} className="grid grid-cols-7 gap-2 items-end">
                <div className="col-span-2 flex flex-col gap-1">
                  <label className="text-[10px] font-semibold text-gray-500">Degree</label>
                  <input value={edu.degree} onChange={(e) => setEdu(idx, "degree", e.target.value)} placeholder="MBBS" className="border border-gray-200 rounded-lg px-2.5 py-2 text-xs text-gray-700 outline-none focus:ring-2 focus:ring-green-700 bg-gray-50" />
                </div>
                <div className="col-span-3 flex flex-col gap-1">
                  <label className="text-[10px] font-semibold text-gray-500">Institution</label>
                  <input value={edu.institution} onChange={(e) => setEdu(idx, "institution", e.target.value)} placeholder="University name" className="border border-gray-200 rounded-lg px-2.5 py-2 text-xs text-gray-700 outline-none focus:ring-2 focus:ring-green-700 bg-gray-50" />
                </div>
                <div className="col-span-1 flex flex-col gap-1">
                  <label className="text-[10px] font-semibold text-gray-500">Year</label>
                  <input value={edu.year} onChange={(e) => setEdu(idx, "year", e.target.value)} placeholder="2010" className="border border-gray-200 rounded-lg px-2.5 py-2 text-xs text-gray-700 outline-none focus:ring-2 focus:ring-green-700 bg-gray-50" />
                </div>
                <div className="col-span-1 flex items-end pb-1.5">
                  <button type="button" onClick={() => removeEdu(idx)} className="text-gray-300 hover:text-red-500 transition"><X size={13} strokeWidth={1.5} /></button>
                </div>
              </div>
            ))}

            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pt-1">Social Links</p>
            <div className="grid grid-cols-3 gap-3">
              {(["socialLinkedin", "socialFacebook", "socialInstagram"] as const).map((key) => (
                <div key={key} className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">{key.replace("social", "")}</label>
                  <input value={panel.data[key] ?? ""} onChange={(e) => setField(key, e.target.value)} placeholder="https://…" className={inputCls} />
                </div>
              ))}
            </div>

            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pt-1">Status</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600">Status</label>
                <select value={panel.data.status} onChange={(e) => setField("status", e.target.value)} className={`${inputCls} appearance-none`}>
                  <option value="active">Active</option>
                  <option value="on-leave">On Leave</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600">Availability</label>
                <select value={panel.data.available ? "yes" : "no"} onChange={(e) => setField("available", e.target.value === "yes")} className={`${inputCls} appearance-none`}>
                  <option value="yes">Available</option>
                  <option value="no">Unavailable</option>
                </select>
              </div>
            </div>

            <button onClick={save} disabled={!panel.data.name} className="w-full bg-green-900 hover:bg-green-800 disabled:opacity-50 text-white text-sm font-semibold py-2.5 rounded-xl transition">
              {panel.mode === "new" ? "Add Doctor" : "Save Changes"}
            </button>
          </div>
        ) : (
          <div className="lg:col-span-3 bg-white border border-gray-100 rounded-xl shadow-sm p-8 flex flex-col items-center justify-center text-center gap-3">
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
