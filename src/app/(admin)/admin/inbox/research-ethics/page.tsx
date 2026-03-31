"use client";

import { useState, useMemo } from "react";
import { Search, Microscope, User, Mail, Calendar, ChevronDown } from "lucide-react";

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

const MOCK: EthicsSubmission[] = [
  { id: "1", applicantName: "Dr. Seun Adesanya", email: "seun@unife.edu.ng", submittedAt: "2026-03-15T10:00:00Z", yesCount: 10, noCount: 1, naCount: 1, status: "approved", responseNote: "All requirements met. Clearance granted." },
  { id: "2", applicantName: "Prof. Bisi Adewale", email: "bisi.adewale@oauthc.gov.ng", submittedAt: "2026-03-20T09:30:00Z", yesCount: 8, noCount: 3, naCount: 1, status: "under-review" },
  { id: "3", applicantName: "Dr. Kola Fashola", email: "kola.f@research.ng", submittedAt: "2026-03-28T14:15:00Z", yesCount: 6, noCount: 4, naCount: 2, status: "received" },
  { id: "4", applicantName: "Mrs. Tola Ogunsanya", email: "tola.o@unilag.edu.ng", submittedAt: "2026-04-01T08:45:00Z", yesCount: 9, noCount: 2, naCount: 1, status: "received" },
  { id: "5", applicantName: "Dr. Ngozi Ibe", email: "ngozi.ibe@email.com", submittedAt: "2026-04-02T11:20:00Z", yesCount: 4, noCount: 7, naCount: 1, status: "rejected", responseNote: "Insufficient documentation. Please resubmit with complete IRB protocol." },
];

const STATUS_STYLES: Record<EthicsStatus, string> = {
  received: "bg-blue-50 text-blue-700 border border-blue-100",
  "under-review": "bg-amber-50 text-amber-700 border border-amber-100",
  approved: "bg-green-50 text-green-800 border border-green-100",
  rejected: "bg-red-50 text-red-700 border border-red-100",
};

const STATUS_OPTIONS: EthicsStatus[] = ["received", "under-review", "approved", "rejected"];

export default function ResearchEthicsInboxPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<EthicsStatus | "all">("all");
  const [items, setItems] = useState(MOCK);
  const [selected, setSelected] = useState<EthicsSubmission | null>(null);
  const [note, setNote] = useState("");
  const [editingStatus, setEditingStatus] = useState<EthicsStatus | null>(null);

  const filtered = useMemo(
    () =>
      items.filter((i) => {
        const matchSearch =
          i.applicantName.toLowerCase().includes(search.toLowerCase()) ||
          i.email.toLowerCase().includes(search.toLowerCase());
        const matchFilter = filter === "all" || i.status === filter;
        return matchSearch && matchFilter;
      }),
    [items, search, filter]
  );

  const updateStatus = (id: string, status: EthicsStatus, responseNote: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status, responseNote: responseNote || i.responseNote } : i))
    );
    if (selected?.id === id) setSelected((prev) => prev ? { ...prev, status, responseNote } : null);
    setEditingStatus(null);
    setNote("");
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-gray-900 text-xl font-bold">Research Ethics Applications</h1>
        <p className="text-gray-500 text-sm mt-1">
          {items.filter((i) => i.status === "received").length} pending review · {items.length} total
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" strokeWidth={1.5} />
          <input
            type="text"
            placeholder="Search applicant or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent bg-white shadow-sm transition"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(["all", ...STATUS_OPTIONS] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
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
          {filtered.length === 0 ? (
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
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize shrink-0 ${STATUS_STYLES[selected.status]}`}>
                {selected.status.replace("-", " ")}
              </span>
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
                className="w-full bg-green-900 hover:bg-green-800 text-white text-sm font-semibold py-2.5 rounded-lg transition"
              >
                Save Update
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-8 flex flex-col items-center justify-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
              <Microscope size={20} strokeWidth={1.5} className="text-gray-300" />
            </div>
            <p className="text-gray-400 text-sm">Select an application to review.</p>
          </div>
        )}
      </div>
    </div>
  );
}
