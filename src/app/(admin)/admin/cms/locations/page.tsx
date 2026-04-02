"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { api } from "@/lib/api-client";
import toast from "react-hot-toast";
import { Search, Plus, MapPin, Pencil, Trash2, X, Loader2 } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";

type LocationType = "main" | "department" | "centre";
type LocationStatus = "active" | "inactive";

type Contact = { label?: string; number: string };

type LocationAPI = {
  id: string;
  name: string;
  slug: string;
  image: string;
  address: string;
  type: LocationType;
  phone: string;
  hours: string;
  lat: number;
  lng: number;
  mapsQuery: string;
  contacts: Contact[];
  status: LocationStatus;
};

type LocationForm = Omit<LocationAPI, "contacts" | "lat" | "lng"> & {
  contacts: string; // "Label: Number" per line
  lat: string;
  lng: string;
};

const STATUS_STYLES: Record<LocationStatus, string> = {
  active: "bg-green-50 text-green-800 border border-green-100",
  inactive: "bg-gray-100 text-gray-500 border border-gray-200",
};

const TYPE_STYLES: Record<LocationType, string> = {
  main: "bg-blue-50 text-blue-700 border border-blue-100",
  department: "bg-purple-50 text-purple-700 border border-purple-100",
  centre: "bg-amber-50 text-amber-700 border border-amber-100",
};

function toForm(a: LocationAPI): LocationForm {
  return {
    ...a,
    lat: a.lat ? String(a.lat) : "",
    lng: a.lng ? String(a.lng) : "",
    contacts: (a.contacts || []).map((c) => c.label ? `${c.label}: ${c.number}` : c.number).join("\n"),
  };
}

function toPayload(f: LocationForm) {
  return {
    ...f,
    lat: parseFloat(f.lat) || 0,
    lng: parseFloat(f.lng) || 0,
    contacts: f.contacts.split("\n").filter(Boolean).map((line) => {
      const idx = line.indexOf(":");
      if (idx > -1) return { label: line.slice(0, idx).trim(), number: line.slice(idx + 1).trim() };
      return { number: line.trim() };
    }),
  };
}

const EMPTY: Omit<LocationForm, "id"> = { name: "", slug: "", image: "", address: "", type: "department", phone: "", hours: "", lat: "", lng: "", mapsQuery: "", contacts: "", status: "active" };

const inputCls = "border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-green-700 bg-gray-50";

function slugify(s: string) { return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); }

export default function LocationsPage() {
  const [items, setItems] = useState<LocationForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [panel, setPanel] = useState<{ mode: "new" | "edit"; data: Omit<LocationForm, "id"> & { id?: string } } | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    const res = await api.get<LocationAPI[]>("/admin/cms/locations?limit=200");
    if (res.ok && res.data) setItems(res.data.map(toForm));
    setLoading(false);
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const filtered = useMemo(() =>
    items.filter((i) => i.name.toLowerCase().includes(search.toLowerCase())), [items, search]);

  const openNew = () => setPanel({ mode: "new", data: { ...EMPTY } });
  const openEdit = (item: LocationForm) => setPanel({ mode: "edit", data: { ...item } });

  const save = async () => {
    if (!panel) return;
    setSaving(true);
    const payload = toPayload(panel.data as LocationForm);
    if (panel.mode === "new") {
      const res = await api.post<LocationAPI>("/admin/cms/locations", payload);
      if (res.ok && res.data) {
        setItems((prev) => [toForm(res.data!), ...prev]);
        toast.success("Location created");
      } else {
        toast.error(res.error || "Failed to create");
      }
    } else {
      const res = await api.patch<LocationAPI>(`/admin/cms/locations/${panel.data.id}`, payload);
      if (res.ok && res.data) {
        const updated = toForm(res.data!);
        setItems((prev) => prev.map((i) => i.id === panel.data.id ? updated : i));
        toast.success("Location updated");
      } else {
        toast.error(res.error || "Failed to update");
      }
    }
    setSaving(false);
    setPanel(null);
  };

  const remove = async (id: string) => {
    const res = await api.del(`/admin/cms/locations/${id}`);
    if (res.ok) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      toast.success("Location deleted");
      if (panel?.data.id === id) setPanel(null);
    } else {
      toast.error(res.error || "Failed to delete");
    }
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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 text-xl font-bold">Locations</h1>
          <p className="text-gray-500 text-sm mt-1">{items.filter((i) => i.status === "active").length} active · {items.length} total</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 bg-green-900 hover:bg-green-800 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition">
          <Plus size={14} strokeWidth={2} /> New Location
        </button>
      </div>

      <div className="relative max-w-xs">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" strokeWidth={1.5} />
        <input type="text" placeholder="Search locations…" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-green-700 bg-white shadow-sm transition" />
      </div>

      <div className="grid lg:grid-cols-2 gap-4 items-start">
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="divide-y divide-gray-50">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-start gap-3 px-5 py-4 animate-pulse">
                  <div className="w-8 h-8 rounded-lg bg-gray-200 shrink-0" />
                  <div className="flex-1">
                    <div className="h-3.5 w-36 bg-gray-200 rounded mb-2" />
                    <div className="h-2.5 w-48 bg-gray-100 rounded mb-2" />
                    <div className="flex gap-2"><div className="h-4 w-16 bg-gray-100 rounded-full" /><div className="h-4 w-14 bg-gray-100 rounded-full" /></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-12">No locations found.</p>
          ) : (
            <ul className="divide-y divide-gray-50">
              {filtered.map((item) => (
                <li key={item.id} className="flex items-start gap-3 px-5 py-4 hover:bg-gray-50 transition">
                  <div className="w-8 h-8 rounded-lg bg-green-900/10 flex items-center justify-center shrink-0">
                    <MapPin size={14} strokeWidth={1.5} className="text-green-900" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 font-semibold text-sm truncate">{item.name}</p>
                    <p className="text-gray-400 text-xs mt-0.5 truncate">{item.address}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${TYPE_STYLES[item.type]}`}>{item.type}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${STATUS_STYLES[item.status]}`}>{item.status}</span>
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
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-gray-900 font-semibold text-base">{panel.mode === "new" ? "New Location" : "Edit Location"}</h2>
              <button onClick={() => setPanel(null)} className="text-gray-300 hover:text-gray-600 transition"><X size={16} strokeWidth={1.5} /></button>
            </div>
            <div className="p-6 flex flex-col gap-5 max-h-[75vh] overflow-y-auto">
              <ImageUpload value={panel.data.image} onChange={(v) => setField("image", v)} label="Image" aspectRatio="landscape" folder="locations" />

              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Core Details</p>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">Name</label>
                  <input value={panel.data.name} onChange={(e) => setField("name", e.target.value)} placeholder="Location name" className={inputCls} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">Slug</label>
                  <input value={panel.data.slug} onChange={(e) => setField("slug", e.target.value)} placeholder="auto-generated" className={`${inputCls} text-gray-400`} />
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
                    <input value={panel.data.phone} onChange={(e) => setField("phone", e.target.value)} placeholder="+234…" className={inputCls} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-600">Opening Hours</label>
                    <input value={panel.data.hours} onChange={(e) => setField("hours", e.target.value)} placeholder="Mon-Fri 8am-5pm" className={inputCls} />
                  </div>
                </div>
              </div>

              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider pt-2">Maps & Contacts</p>
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-600">Latitude</label>
                    <input value={panel.data.lat} onChange={(e) => setField("lat", e.target.value)} placeholder="7.5171" className={inputCls} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-600">Longitude</label>
                    <input value={panel.data.lng} onChange={(e) => setField("lng", e.target.value)} placeholder="4.5261" className={inputCls} />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">Maps Query <span className="text-gray-400 font-normal">(URL-encoded address for Google Maps)</span></label>
                  <input value={panel.data.mapsQuery} onChange={(e) => setField("mapsQuery", e.target.value)} placeholder="OAUTHC+Ile-Ife+Nigeria" className={inputCls} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">Contacts <span className="text-gray-400 font-normal">(one per line — Label: Number)</span></label>
                  <textarea value={panel.data.contacts} onChange={(e) => setField("contacts", e.target.value)} rows={4} placeholder={"Reception: +234 000 0000\nEmergency: +234 111 1111"} className={`${inputCls} resize-none`} />
                </div>
              </div>

              <button onClick={save} disabled={!panel.data.name || saving} className="w-full bg-green-900 hover:bg-green-800 disabled:opacity-50 text-white text-sm font-semibold py-2.5 rounded-xl transition flex items-center justify-center gap-2">
                {saving && <Loader2 size={14} className="animate-spin" />}
                {panel.mode === "new" ? "Create Location" : "Save Changes"}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-8 flex flex-col items-center justify-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
              <MapPin size={20} strokeWidth={1.5} className="text-gray-300" />
            </div>
            <p className="text-gray-400 text-sm">Select a location to edit, or create a new one.</p>
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
