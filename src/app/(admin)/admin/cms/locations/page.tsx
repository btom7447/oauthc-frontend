"use client";

import { useState, useMemo } from "react";
import { Search, Plus, MapPin, Pencil, Trash2, X } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";

type LocationType = "main" | "department" | "centre";
type LocationStatus = "active" | "inactive";

type Location = {
  id: string;
  name: string;
  slug: string;
  image: string;
  address: string;
  type: LocationType;
  phone: string;
  hours: string;
  lat: string;
  lng: string;
  mapsQuery: string;
  contacts: string;
  status: LocationStatus;
};

function slugify(s: string) { return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); }

const MOCK: Location[] = [
  { id: "1", name: "Main Hospital", slug: "main-hospital", image: "", address: "PMB 5538, Ile-Ife, Osun State", type: "main", phone: "+234 036 230 372", hours: "24/7", lat: "7.4924", lng: "4.5124", mapsQuery: "", contacts: "", status: "active" },
  { id: "2", name: "Cardiology Centre", slug: "cardiology-centre", image: "", address: "Block A, OAUTHC Main Campus, Ile-Ife", type: "centre", phone: "+234 036 230 380", hours: "Mon–Fri 8am–5pm", lat: "7.4928", lng: "4.5130", mapsQuery: "", contacts: "", status: "active" },
  { id: "3", name: "Radiology Department", slug: "radiology-department", image: "", address: "Block B, OAUTHC Main Campus, Ile-Ife", type: "department", phone: "+234 036 230 382", hours: "Mon–Fri 8am–4pm", lat: "7.4926", lng: "4.5128", mapsQuery: "", contacts: "", status: "active" },
  { id: "4", name: "Eye Centre (LAUTECH)", slug: "eye-centre-lautech", image: "", address: "LAUTECH Teaching Hospital, Ogbomoso", type: "centre", phone: "+234 038 710 421", hours: "Mon–Sat 8am–5pm", lat: "8.1333", lng: "4.2500", mapsQuery: "", contacts: "", status: "active" },
  { id: "5", name: "Emergency & Trauma Centre", slug: "emergency-trauma-centre", image: "", address: "Main Gate, OAUTHC Campus, Ile-Ife", type: "centre", phone: "+234 036 230 400", hours: "24/7", lat: "7.4920", lng: "4.5120", mapsQuery: "", contacts: "", status: "active" },
  { id: "6", name: "Cancer Research Centre", slug: "cancer-research-centre", image: "", address: "Research Block, OAUTHC Main Campus", type: "centre", phone: "+234 036 230 391", hours: "Mon–Fri 9am–4pm", lat: "7.4930", lng: "4.5135", mapsQuery: "", contacts: "", status: "active" },
  { id: "7", name: "Outpatient Department (OPD)", slug: "outpatient-department-opd", image: "", address: "OPD Block, OAUTHC Main Campus", type: "department", phone: "+234 036 230 375", hours: "Mon–Fri 8am–3pm", lat: "7.4922", lng: "4.5126", mapsQuery: "", contacts: "", status: "active" },
  { id: "8", name: "Pharmacy", slug: "pharmacy", image: "", address: "Ground Floor, Main Hospital Block", type: "department", phone: "+234 036 230 376", hours: "24/7", lat: "7.4925", lng: "4.5123", mapsQuery: "", contacts: "", status: "active" },
];

const TYPE_STYLES: Record<LocationType, string> = {
  main: "bg-green-50 text-green-800 border border-green-100",
  department: "bg-blue-50 text-blue-700 border border-blue-100",
  centre: "bg-amber-50 text-amber-700 border border-amber-100",
};

const STATUS_STYLES: Record<LocationStatus, string> = {
  active: "bg-green-50 text-green-800 border border-green-100",
  inactive: "bg-gray-100 text-gray-500 border border-gray-200",
};

const EMPTY: Omit<Location, "id"> = { name: "", slug: "", image: "", address: "", type: "department", phone: "", hours: "", lat: "", lng: "", mapsQuery: "", contacts: "", status: "active" };

const inputCls = "border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-green-700 bg-gray-50";
const textareaCls = `${inputCls} resize-none`;

export default function LocationsCMSPage() {
  const [items, setItems] = useState(MOCK);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<LocationType | "all">("all");
  const [panel, setPanel] = useState<{ mode: "new" | "edit"; data: Omit<Location, "id"> & { id?: string } } | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() =>
    items.filter((i) => {
      const matchSearch = i.name.toLowerCase().includes(search.toLowerCase()) || i.address.toLowerCase().includes(search.toLowerCase());
      const matchFilter = filter === "all" || i.type === filter;
      return matchSearch && matchFilter;
    }), [items, search, filter]);

  const openNew = () => setPanel({ mode: "new", data: { ...EMPTY } });
  const openEdit = (item: Location) => setPanel({ mode: "edit", data: { ...item } });
  const save = () => {
    if (!panel) return;
    if (panel.mode === "new") setItems((prev) => [{ ...panel.data, id: String(Date.now()) } as Location, ...prev]);
    else setItems((prev) => prev.map((i) => i.id === panel.data.id ? { ...panel.data } as Location : i));
    setPanel(null);
  };
  const remove = (id: string) => { setItems((prev) => prev.filter((i) => i.id !== id)); setDeleteId(null); };
  const setField = (k: string, v: string) =>
    setPanel((p) => {
      if (!p) return p;
      const update: Record<string, string> = { [k]: v };
      if (k === "name" && p.mode === "new") update.slug = slugify(v);
      return { ...p, data: { ...p.data, ...update } };
    });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 text-xl font-bold">Locations</h1>
          <p className="text-gray-500 text-sm mt-1">{items.filter((i) => i.status === "active").length} active · {items.length} total</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 bg-green-900 hover:bg-green-800 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition">
          <Plus size={14} strokeWidth={2} /> New
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" strokeWidth={1.5} />
          <input type="text" placeholder="Search name, address…" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-green-700 bg-white shadow-sm transition" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(["all", "main", "department", "centre"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-2 rounded-lg text-xs font-semibold capitalize transition ${filter === f ? "bg-green-900 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-green-900"}`}>{f}</button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 items-start">
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          {filtered.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-12">No locations found.</p>
          ) : (
            <ul className="divide-y divide-gray-50">
              {filtered.map((item) => (
                <li key={item.id} className="flex items-start gap-3 px-5 py-4 hover:bg-gray-50 transition">
                  <div className="w-9 h-9 rounded-xl bg-cyan-50 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin size={14} strokeWidth={1.5} className="text-cyan-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 font-semibold text-sm">{item.name}</p>
                    <p className="text-gray-400 text-xs mt-0.5 truncate">{item.address}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${TYPE_STYLES[item.type]}`}>{item.type}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLES[item.status]}`}>{item.status}</span>
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
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm flex flex-col max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 z-10 bg-white border-b border-gray-100 flex items-center justify-between px-6 py-4">
              <h2 className="text-gray-900 font-semibold text-base">{panel.mode === "new" ? "New Location" : "Edit Location"}</h2>
              <button onClick={() => setPanel(null)} className="text-gray-300 hover:text-gray-600 transition"><X size={16} strokeWidth={1.5} /></button>
            </div>

            <div className="flex flex-col gap-5 p-6">
              {/* Image */}
              <ImageUpload
                value={panel.data.image}
                onChange={(v) => setField("image", v)}
                label="Location Image"
                aspectRatio="landscape"
                folder="locations"
              />

              {/* Core */}
              <div className="flex flex-col gap-4">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Core Details</p>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">Name</label>
                  <input value={panel.data.name} onChange={(e) => setField("name", e.target.value)} placeholder="Location name" className={inputCls} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">Slug</label>
                  <input value={panel.data.slug} onChange={(e) => setField("slug", e.target.value)} placeholder="auto-generated from name" className={inputCls} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">Address</label>
                  <input value={panel.data.address} onChange={(e) => setField("address", e.target.value)} placeholder="Full address" className={inputCls} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-600">Type</label>
                    <select value={panel.data.type} onChange={(e) => setField("type", e.target.value)} className={`${inputCls} appearance-none`}>
                      <option value="main">Main</option>
                      <option value="department">Department</option>
                      <option value="centre">Centre</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-600">Status</label>
                    <select value={panel.data.status} onChange={(e) => setField("status", e.target.value)} className={`${inputCls} appearance-none`}>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-600">Phone</label>
                    <input value={panel.data.phone} onChange={(e) => setField("phone", e.target.value)} placeholder="+234 xxx xxx xxxx" className={inputCls} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-600">Opening Hours</label>
                    <input value={panel.data.hours} onChange={(e) => setField("hours", e.target.value)} placeholder="e.g. 24/7 or Mon–Fri 8am–5pm" className={inputCls} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-600">Latitude</label>
                    <input value={panel.data.lat} onChange={(e) => setField("lat", e.target.value)} placeholder="e.g. 7.4924" className={inputCls} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-600">Longitude</label>
                    <input value={panel.data.lng} onChange={(e) => setField("lng", e.target.value)} placeholder="e.g. 4.5124" className={inputCls} />
                  </div>
                </div>
              </div>

              {/* Maps & Contacts */}
              <div className="flex flex-col gap-4">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Maps & Contacts</p>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">Maps Query <span className="text-gray-400 font-normal">(URL-encoded address, e.g. "OAUTHC+Ile-Ife")</span></label>
                  <input value={panel.data.mapsQuery} onChange={(e) => setField("mapsQuery", e.target.value)} placeholder="e.g. OAUTHC+Ile-Ife+Osun+State" className={inputCls} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">Contacts <span className="text-gray-400 font-normal">(format: "Label: Number", one per line)</span></label>
                  <textarea value={panel.data.contacts} onChange={(e) => setField("contacts", e.target.value)} rows={4} placeholder={"Reception: +234 036 230 372\nEmergency: +234 036 230 400"} className={textareaCls} />
                </div>
              </div>

              <button onClick={save} disabled={!panel.data.name} className="w-full bg-green-900 hover:bg-green-800 disabled:opacity-50 text-white text-sm font-semibold py-2.5 rounded-xl transition">
                {panel.mode === "new" ? "Add Location" : "Save Changes"}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-8 flex flex-col items-center justify-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
              <MapPin size={20} strokeWidth={1.5} className="text-gray-300" />
            </div>
            <p className="text-gray-400 text-sm">Select a location to edit, or add a new one.</p>
          </div>
        )}
      </div>

      {deleteId && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl flex flex-col gap-4">
            <h3 className="text-gray-900 font-semibold text-base">Delete location?</h3>
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
