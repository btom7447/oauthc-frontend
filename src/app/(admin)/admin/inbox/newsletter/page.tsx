"use client";

import { useState, useMemo } from "react";
import { Search, Newspaper, Mail, Trash2 } from "lucide-react";

type Subscriber = {
  id: string;
  email: string;
  subscribedAt: string;
  status: "active" | "unsubscribed";
};

const MOCK: Subscriber[] = [
  { id: "1", email: "chidi@email.com", subscribedAt: "2026-03-10T08:00:00Z", status: "active" },
  { id: "2", email: "fatima.bello@gmail.com", subscribedAt: "2026-03-12T11:22:00Z", status: "active" },
  { id: "3", email: "emeka.obi@yahoo.com", subscribedAt: "2026-03-15T09:45:00Z", status: "unsubscribed" },
  { id: "4", email: "aisha.m@email.com", subscribedAt: "2026-03-18T14:00:00Z", status: "active" },
  { id: "5", email: "blessing@outlook.com", subscribedAt: "2026-03-20T07:30:00Z", status: "active" },
  { id: "6", email: "segun.ola@gmail.com", subscribedAt: "2026-03-22T16:10:00Z", status: "active" },
  { id: "7", email: "chinwe.eze@email.com", subscribedAt: "2026-03-25T10:05:00Z", status: "unsubscribed" },
  { id: "8", email: "ibrahim.m@email.com", subscribedAt: "2026-03-28T12:33:00Z", status: "active" },
];

export default function NewsletterInboxPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "unsubscribed">("all");
  const [items, setItems] = useState(MOCK);

  const filtered = useMemo(
    () =>
      items.filter((i) => {
        const matchSearch = i.email.toLowerCase().includes(search.toLowerCase());
        const matchFilter = filter === "all" || i.status === filter;
        return matchSearch && matchFilter;
      }),
    [items, search, filter]
  );

  const remove = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));

  const activeCount = items.filter((i) => i.status === "active").length;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-gray-900 text-xl font-bold">Newsletter Subscribers</h1>
        <p className="text-gray-500 text-sm mt-1">
          {activeCount} active · {items.length} total
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" strokeWidth={1.5} />
          <input
            type="text"
            placeholder="Search email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent bg-white shadow-sm transition"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "active", "unsubscribed"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold capitalize transition ${
                filter === f ? "bg-green-900 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-green-900"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Subscribed</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center text-gray-400 text-sm py-12">No subscribers found.</td>
                </tr>
              ) : (
                filtered.map((sub) => (
                  <tr key={sub.id} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-3.5">
                      <span className="flex items-center gap-2 text-gray-800">
                        <Mail size={13} strokeWidth={1.5} className="text-gray-400 shrink-0" />
                        {sub.email}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 text-xs">
                      {new Date(sub.subscribedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                        sub.status === "active"
                          ? "bg-green-50 text-green-800 border border-green-100"
                          : "bg-gray-100 text-gray-500 border border-gray-200"
                      }`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => remove(sub.id)}
                        className="text-gray-300 hover:text-red-500 transition"
                        title="Remove"
                      >
                        <Trash2 size={14} strokeWidth={1.5} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export hint */}
      <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-5 py-3.5 shadow-sm">
        <Newspaper size={15} strokeWidth={1.5} className="text-gray-400 shrink-0" />
        <p className="text-gray-500 text-xs">
          Export functionality and bulk email integration coming soon.
        </p>
      </div>
    </div>
  );
}
