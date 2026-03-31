"use client";

import { useState, useMemo } from "react";
import { Search, Mail, Calendar, User, Download } from "lucide-react";

type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  submittedAt: string;
  status: "unread" | "read" | "replied";
};

const MOCK: ContactSubmission[] = [
  { id: "1", name: "Chidi Okonkwo", email: "chidi@email.com", subject: "Appointment inquiry", message: "I would like to know how to book an appointment with a cardiologist.", submittedAt: "2026-04-01T09:14:00Z", status: "unread" },
  { id: "2", name: "Fatima Bello", email: "fatima@email.com", subject: "Medical records request", message: "Please how can I get a copy of my discharge summary?", submittedAt: "2026-04-01T11:42:00Z", status: "read" },
  { id: "3", name: "Emeka Obi", email: "emeka@email.com", subject: "Complaint — long wait times", message: "I waited over 3 hours at the OPD on Wednesday. This is unacceptable.", submittedAt: "2026-04-02T08:05:00Z", status: "unread" },
  { id: "4", name: "Aisha Mohammed", email: "aisha@email.com", subject: "Compliment", message: "Dr. Adewale and his team were absolutely wonderful. Thank you!", submittedAt: "2026-04-02T14:30:00Z", status: "replied" },
  { id: "5", name: "Blessing Nwosu", email: "blessing@email.com", subject: "Research partnership", message: "We are a health NGO interested in collaborating on community health programmes.", submittedAt: "2026-04-03T10:18:00Z", status: "unread" },
];

const STATUS_STYLES = {
  unread: "bg-blue-50 text-blue-700 border border-blue-100",
  read: "bg-gray-100 text-gray-500 border border-gray-200",
  replied: "bg-green-50 text-green-800 border border-green-100",
};

function downloadCSV(data: ContactSubmission[]) {
  const headers = ["Name", "Email", "Subject", "Message", "Submitted At", "Status"];
  const rows = data.map((i) => [
    i.name, i.email, i.subject,
    `"${i.message.replace(/"/g, '""')}"`,
    new Date(i.submittedAt).toLocaleString("en-GB"),
    i.status,
  ]);
  const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `contact-forms-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ContactInboxPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<ContactSubmission | null>(null);
  const [items, setItems] = useState(MOCK);

  const filtered = useMemo(
    () =>
      items.filter(
        (i) =>
          i.name.toLowerCase().includes(search.toLowerCase()) ||
          i.subject.toLowerCase().includes(search.toLowerCase()) ||
          i.email.toLowerCase().includes(search.toLowerCase())
      ),
    [items, search]
  );

  const markRead = (id: string) =>
    setItems((prev) => prev.map((i) => (i.id === id && i.status === "unread" ? { ...i, status: "read" } : i)));

  const unreadCount = items.filter((i) => i.status === "unread").length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 text-xl font-bold">Contact Forms</h1>
          <p className="text-gray-500 text-sm mt-1">
            {unreadCount} unread · {items.length} total
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

      <div className="relative max-w-xs">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" strokeWidth={1.5} />
        <input
          type="text"
          placeholder="Search name, email, subject…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent bg-white shadow-sm transition"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-4 items-start">
        {/* List */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          {filtered.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-12">No submissions found.</p>
          ) : (
            <ul className="divide-y divide-gray-50">
              {filtered.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => { setSelected(item); markRead(item.id); }}
                    className={`w-full text-left px-5 py-4 hover:bg-gray-50 transition ${selected?.id === item.id ? "bg-green-50" : ""}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          {item.status === "unread" && <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />}
                          <span className={`text-sm font-semibold truncate ${item.status === "unread" ? "text-gray-900" : "text-gray-600"}`}>
                            {item.name}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 truncate mt-0.5">{item.subject}</p>
                        <p className="text-xs text-gray-400 truncate mt-0.5">{item.message}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${STATUS_STYLES[item.status]}`}>
                          {item.status}
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
              <h2 className="text-gray-900 font-semibold text-base">{selected.subject}</h2>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize shrink-0 ${STATUS_STYLES[selected.status]}`}>
                {selected.status}
              </span>
            </div>
            <div className="flex flex-col gap-2 text-xs text-gray-500">
              <span className="flex items-center gap-2"><User size={12} strokeWidth={1.5} />{selected.name}</span>
              <span className="flex items-center gap-2"><Mail size={12} strokeWidth={1.5} /><a href={`mailto:${selected.email}`} className="text-green-900 hover:underline">{selected.email}</a></span>
              <span className="flex items-center gap-2"><Calendar size={12} strokeWidth={1.5} />{new Date(selected.submittedAt).toLocaleString("en-GB")}</span>
            </div>
            <div className="border-t border-gray-100 pt-4">
              <p className="text-gray-700 text-sm leading-relaxed">{selected.message}</p>
            </div>
            <a
              href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
              className="flex items-center justify-center gap-2 w-full bg-green-900 hover:bg-green-800 text-white text-sm font-semibold py-2.5 rounded-lg transition"
            >
              <Mail size={14} strokeWidth={1.5} />
              Reply via Email
            </a>
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-8 flex flex-col items-center justify-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
              <Mail size={20} strokeWidth={1.5} className="text-gray-300" />
            </div>
            <p className="text-gray-400 text-sm">Select a submission to view details.</p>
          </div>
        )}
      </div>
    </div>
  );
}
