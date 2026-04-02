"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { api } from "@/lib/api-client";
import toast from "react-hot-toast";
import { Search, BookOpen, User, Mail, Calendar, ChevronDown, Download, Trash2, Loader2 } from "lucide-react";

type EthicsStatus = "received" | "under-review" | "approved" | "rejected";

type EthicsSubmission = {
  id: string;
  applicantName: string;
  email: string;
  submittedAt: string;
  yesCount: number;
  noCount: number;
  naCount: number;
  status: EthicsStatus;
  responseNote?: string;
};

type Meta = { total: number; page: number; limit: number; totalPages: number };

const STATUS_STYLES: Record<EthicsStatus, string> = {
  received: "bg-blue-50 text-blue-700 border border-blue-100",
  "under-review": "bg-amber-50 text-amber-700 border border-amber-100",
  approved: "bg-green-50 text-green-800 border border-green-100",
  rejected: "bg-red-50 text-red-700 border border-red-100",
};

const STATUS_OPTIONS: EthicsStatus[] = ["received", "under-review", "approved", "rejected"];

function downloadCSV(data: EthicsSubmission[]) {
  const headers = ["Applicant", "Email", "Submitted At", "Yes", "No", "N/A", "Status", "Response Note"];
  const rows = data.map((i) => [
    i.applicantName,
    i.email,
    new Date(i.submittedAt).toLocaleString("en-GB"),
    i.yesCount,
    i.noCount,
    i.naCount,
    i.status,
    `"${(i.responseNote ?? "").replace(/"/g, '""')}"`,
  ]);
  const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `research-ethics-applications-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ResearchEthicsInboxPage() {
  const [items, setItems] = useState<EthicsSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<EthicsStatus | "all">("all");
  const [selected, setSelected] = useState<EthicsSubmission | null>(null);
  const [note, setNote] = useState("");
  const [editingStatus, setEditingStatus] = useState<EthicsStatus | null>(null);
  const [saving, setSaving] = useState(false);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [page, setPage] = useState(1);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "50" });
    if (search) params.set("search", search);
    if (filter !== "all") params.set("status", filter);
    const res = await api.get<EthicsSubmission[]>(`/inbox/research-ethics?${params}`);
    if (res.ok && res.data) {
      setItems(res.data);
      if (res.meta) setMeta(res.meta as Meta);
    }
    setLoading(false);
  }, [page, search, filter]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const filtered = useMemo(
    () =>
      items.filter((i) => {
        const matchSearch =
          i.applicantName.toLowerCase().includes(search.toLowerCase()) ||
          i.email.toLowerCase().includes(search.toLowerCase());
        return matchSearch;
      }),
    [items, search]
  );

  const updateStatus = async (id: string, status: EthicsStatus, responseNote: string) => {
    setSaving(true);
    const res = await api.patch<EthicsSubmission>(`/inbox/research-ethics/${id}/status`, { status, responseNote });
    setSaving(false);
    if (res.ok && res.data) {
      setItems((prev) => prev.map((i) => (i.id === id ? res.data! : i)));
      setSelected(res.data);
      setEditingStatus(null);
      setNote("");
      toast.success("Status updated");
    } else {
      toast.error(res.error || "Failed to update");
    }
  };

  const remove = async (id: string) => {
    const res = await api.del(`/inbox/research-ethics/${id}`);
    if (res.ok) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      if (selected?.id === id) setSelected(null);
      toast.success("Deleted");
    } else {
      toast.error(res.error || "Failed to delete");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 text-xl font-bold">Research Ethics Applications</h1>
          <p className="text-gray-500 text-sm mt-1">
            {items.filter((i) => i.status === "received").length} pending review · {meta?.total ?? items.length} total
          </p>
        </div>
        <button
          onClick={() => downloadCSV(filtered)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 font-medium hover:border-green-900 hover:text-green-900 transition shadow-sm"
        >
          <Download size={14} strokeWidth={1.5} />
          Export CSV
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" strokeWidth={1.5} />
          <input
            type="text"
            placeholder="Search applicant or email…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent bg-white shadow-sm transition"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(["all", ...STATUS_OPTIONS] as const).map((f) => (
            <button
              key={f}
              onClick={() => { setFilter(f); setPage(1); }}
              className={`px-3 py-2 rounded-lg text-xs font-semibold capitalize transition ${
                filter === f ? "bg-green-900 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-green-900"
              }`}
            >
              {f.replace("-", " ")}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 items-start">
        {/* List */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="divide-y divide-gray-50">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="px-5 py-4 animate-pulse">
                  <div className="h-3.5 w-40 bg-gray-200 rounded mb-2" />
                  <div className="h-2.5 w-32 bg-gray-100 rounded mb-1.5" />
                  <div className="flex gap-3 mt-1.5">
                    <div className="h-3 w-12 bg-gray-100 rounded" />
                    <div className="h-3 w-12 bg-gray-100 rounded" />
                    <div className="h-3 w-12 bg-gray-100 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-12">No applications found.</p>
          ) : (
            <ul className="divide-y divide-gray-50">
              {filtered.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => { setSelected(item); setNote(item.responseNote ?? ""); setEditingStatus(null); }}
                    className={`w-full text-left px-5 py-4 hover:bg-gray-50 transition ${selected?.id === item.id ? "bg-green-50" : ""}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900 font-semibold text-sm truncate">{item.applicantName}</p>
                        <p className="text-gray-400 text-xs truncate">{item.email}</p>
                        <div className="flex gap-3 mt-1.5 text-[10px] text-gray-500">
                          <span className="text-green-700 font-semibold">✓ {item.yesCount} Yes</span>
                          <span className="text-red-600 font-semibold">✗ {item.noCount} No</span>
                          <span className="text-gray-400">{item.naCount} N/A</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${STATUS_STYLES[item.status]}`}>
                          {item.status.replace("-", " ")}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {new Date(item.submittedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                        </span>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Detail */}
        {selected ? (
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 flex flex-col gap-5">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-gray-900 font-semibold text-base">{selected.applicantName}</h2>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize shrink-0 ${STATUS_STYLES[selected.status]}`}>
                  {selected.status.replace("-", " ")}
                </span>
                <button onClick={() => remove(selected.id)} className="text-gray-300 hover:text-red-500 transition p-1">
                  <Trash2 size={13} strokeWidth={1.5} />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2 text-xs text-gray-500">
              <span className="flex items-center gap-2"><User size={12} strokeWidth={1.5} />{selected.applicantName}</span>
              <span className="flex items-center gap-2"><Mail size={12} strokeWidth={1.5} /><a href={`mailto:${selected.email}`} className="text-green-900 hover:underline">{selected.email}</a></span>
              <span className="flex items-center gap-2"><Calendar size={12} strokeWidth={1.5} />{new Date(selected.submittedAt).toLocaleString("en-GB")}</span>
            </div>

            <div className="flex gap-4 bg-gray-50 rounded-xl px-4 py-3 text-sm">
              <span className="text-green-700 font-bold">✓ {selected.yesCount} Yes</span>
              <span className="text-red-600 font-bold">✗ {selected.noCount} No</span>
              <span className="text-gray-400">{selected.naCount} N/A</span>
            </div>

            {selected.responseNote && (
              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs font-semibold text-gray-500 mb-1">Response note</p>
                <p className="text-gray-700 text-sm leading-relaxed">{selected.responseNote}</p>
              </div>
            )}

            {/* Status update */}
            <div className="border-t border-gray-100 pt-4 flex flex-col gap-3">
              <p className="text-xs font-semibold text-gray-600">Update status</p>
              <div className="relative">
                <select
                  value={editingStatus ?? selected.status}
                  onChange={(e) => setEditingStatus(e.target.value as EthicsStatus)}
                  className="w-full border border-gray-200 rounded-lg px-3 pr-8 py-2 text-sm text-gray-700 appearance-none outline-none focus:ring-2 focus:ring-green-700 bg-gray-50"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}</option>
                  ))}
                </select>
                <ChevronDown size={13} strokeWidth={1.5} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                placeholder="Add a response note (optional)…"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-green-700 resize-none bg-gray-50"
              />
              <button
                onClick={() => updateStatus(selected.id, editingStatus ?? selected.status, note)}
                disabled={saving}
                className="w-full bg-green-900 hover:bg-green-800 disabled:opacity-50 text-white text-sm font-semibold py-2.5 rounded-lg transition flex items-center justify-center gap-2"
              >
                {saving && <Loader2 size={14} className="animate-spin" />}
                Save Update
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-8 flex flex-col items-center justify-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
              <BookOpen size={20} strokeWidth={1.5} className="text-gray-300" />
            </div>
            <p className="text-gray-400 text-sm">Select an application to review.</p>
          </div>
        )}
      </div>
    </div>
  );
}
