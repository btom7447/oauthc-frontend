"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { api } from "@/lib/api-client";
import toast from "react-hot-toast";
import { Search, Mail, Trash2, Download, Loader2 } from "lucide-react";

type Subscriber = {
  id: string;
  email: string;
  subscribedAt: string;
  status: "active" | "unsubscribed";
};

type Meta = { total: number; page: number; limit: number; totalPages: number };

function downloadCSV(data: Subscriber[]) {
  const headers = ["Email", "Subscribed At", "Status"];
  const rows = data.map((i) => [
    i.email,
    new Date(i.subscribedAt).toLocaleString("en-GB"),
    i.status,
  ]);
  const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `newsletter-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function NewsletterInboxPage() {
  const [items, setItems] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "unsubscribed">("all");
  const [meta, setMeta] = useState<Meta | null>(null);
  const [page, setPage] = useState(1);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "50" });
    if (search) params.set("search", search);
    if (filter !== "all") params.set("status", filter);
    const res = await api.get<Subscriber[]>(`/inbox/newsletter?${params}`);
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
        const matchSearch = i.email.toLowerCase().includes(search.toLowerCase());
        return matchSearch;
      }),
    [items, search]
  );

  const remove = async (id: string) => {
    const res = await api.del(`/inbox/newsletter/${id}`);
    if (res.ok) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      toast.success("Subscriber removed");
    } else {
      toast.error(res.error || "Failed to remove");
    }
  };

  const unsubscribe = async (id: string) => {
    const res = await api.patch<Subscriber>(`/inbox/newsletter/${id}/unsubscribe`);
    if (res.ok && res.data) {
      setItems((prev) => prev.map((i) => (i.id === id ? res.data! : i)));
      toast.success("Marked as unsubscribed");
    } else {
      toast.error(res.error || "Failed to unsubscribe");
    }
  };

  const activeCount = items.filter((i) => i.status === "active").length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 text-xl font-bold">Newsletter Subscribers</h1>
          <p className="text-gray-500 text-sm mt-1">
            {activeCount} active · {meta?.total ?? items.length} total
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
            placeholder="Search email…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent bg-white shadow-sm transition"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "active", "unsubscribed"] as const).map((f) => (
            <button
              key={f}
              onClick={() => { setFilter(f); setPage(1); }}
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
              {loading ? (
                <tr><td colSpan={4} className="text-center py-12"><Loader2 size={20} className="animate-spin text-gray-400 mx-auto" /></td></tr>
              ) : filtered.length === 0 ? (
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
                      <div className="flex items-center gap-2">
                        {sub.status === "active" && (
                          <button
                            onClick={() => unsubscribe(sub.id)}
                            className="text-xs text-gray-400 hover:text-amber-600 font-medium transition"
                          >
                            Unsubscribe
                          </button>
                        )}
                        <button
                          onClick={() => remove(sub.id)}
                          className="text-gray-300 hover:text-red-500 transition"
                          title="Remove"
                        >
                          <Trash2 size={14} strokeWidth={1.5} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
