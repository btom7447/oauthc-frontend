"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth, type Role, roleLabel } from "@/lib/admin-auth";
import { api } from "@/lib/api-client";
import { useRouter } from "next/navigation";
import { Search, ShieldOff, User, ChevronDown, Check, Filter, UserPlus } from "lucide-react";
import toast from "react-hot-toast";

type StaffUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  department?: string;
  status: "active" | "suspended" | "pending";
  joinedAt: string;
};

type Meta = { total: number; page: number; limit: number; totalPages: number };

const ROLE_STYLES: Record<Role, string> = {
  admin: "bg-red-50 text-red-700 border border-red-100",
  staff: "bg-blue-50 text-blue-700 border border-blue-100",
  doctor: "bg-green-50 text-green-800 border border-green-100",
};

const ROLES: Role[] = ["admin", "staff", "doctor"];

export default function UsersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role | "all">("all");
  const [statusFilter, setStatusFilter] = useState<"active" | "suspended" | "pending" | "all">("all");
  const [users, setUsers] = useState<StaffUser[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", "20");
    if (search) params.set("search", search);
    if (roleFilter !== "all") params.set("role", roleFilter);
    if (statusFilter !== "all") params.set("status", statusFilter);

    const res = await api.get<StaffUser[]>(`/users?${params.toString()}`);
    if (res.ok && res.data) {
      setUsers(res.data);
      if (res.meta) setMeta(res.meta as Meta);
    }
    setLoading(false);
  }, [page, search, roleFilter, statusFilter]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  // Debounce search
  useEffect(() => {
    setPage(1);
  }, [search, roleFilter, statusFilter]);

  if (!user) return null;

  if (user.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4 text-center">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
          <ShieldOff size={24} strokeWidth={1.5} className="text-red-500" />
        </div>
        <div>
          <p className="text-gray-900 font-semibold">Access Restricted</p>
          <p className="text-gray-500 text-sm mt-1">User management is only available to Administrators.</p>
        </div>
        <button onClick={() => router.push("/admin")} className="text-sm text-green-900 font-semibold hover:underline">Back to Dashboard</button>
      </div>
    );
  }

  const changeRole = async (id: string, role: Role) => {
    setOpenDropdown(null);
    const res = await api.patch<StaffUser>(`/users/${id}`, { role });
    if (res.ok && res.data) {
      setUsers((prev) => prev.map((u) => (u.id === id ? res.data! : u)));
      toast.success(`Role updated to ${roleLabel(role)}`);
    } else {
      toast.error(res.error || "Failed to update role");
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "suspended" : "active";
    const res = await api.patch<StaffUser>(`/users/${id}`, { status: newStatus });
    if (res.ok && res.data) {
      setUsers((prev) => prev.map((u) => (u.id === id ? res.data! : u)));
      toast.success(newStatus === "active" ? "User reinstated" : "User suspended");
    } else {
      toast.error(res.error || "Failed to update status");
    }
  };

  const approveUser = async (id: string) => {
    const res = await api.patch<StaffUser>(`/users/${id}/approve`);
    if (res.ok && res.data) {
      setUsers((prev) => prev.map((u) => (u.id === id ? res.data! : u)));
      toast.success("User approved");
    } else {
      toast.error(res.error || "Failed to approve user");
    }
  };

  const activeCount = meta?.total ?? users.length;

  return (
    <div className="flex flex-col gap-6" onClick={() => setOpenDropdown(null)}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 text-xl font-bold">User Management</h1>
          <p className="text-gray-500 text-sm mt-1">{activeCount} total users</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" strokeWidth={1.5} />
          <input type="text" placeholder="Search name or email…" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-green-700 bg-white shadow-sm transition" />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={13} strokeWidth={1.5} className="text-gray-400 shrink-0" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as Role | "all")}
            className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-green-700 bg-white shadow-sm transition appearance-none pr-8 cursor-pointer"
          >
            <option value="all">All Roles</option>
            {ROLES.map((r) => <option key={r} value={r}>{roleLabel(r)}</option>)}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "active" | "suspended" | "pending" | "all")}
            className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-green-700 bg-white shadow-sm transition appearance-none pr-8 cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        {(roleFilter !== "all" || statusFilter !== "all") && (
          <button onClick={() => { setRoleFilter("all"); setStatusFilter("all"); }} className="text-xs text-gray-400 hover:text-gray-600 font-medium transition">
            Clear filters
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Staff</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Role</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Department</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Joined</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0" />
                        <div>
                          <div className="h-3.5 w-28 bg-gray-200 rounded mb-1.5" />
                          <div className="h-2.5 w-36 bg-gray-100 rounded" />
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5"><div className="h-5 w-20 bg-gray-200 rounded-full" /></td>
                    <td className="px-5 py-3.5"><div className="h-3.5 w-24 bg-gray-100 rounded" /></td>
                    <td className="px-5 py-3.5"><div className="h-3 w-20 bg-gray-100 rounded" /></td>
                    <td className="px-5 py-3.5"><div className="h-5 w-16 bg-gray-200 rounded-full" /></td>
                    <td className="px-5 py-3.5"><div className="h-3.5 w-14 bg-gray-100 rounded" /></td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr><td colSpan={6} className="text-center text-gray-400 text-sm py-12">No users found.</td></tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-green-900/10 flex items-center justify-center shrink-0">
                          <User size={14} strokeWidth={1.5} className="text-green-900" />
                        </div>
                        <div>
                          <p className="text-gray-900 font-medium leading-tight">{u.name}</p>
                          <p className="text-gray-400 text-xs">{u.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-3.5">
                      <div className="relative inline-block" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setOpenDropdown(openDropdown === u.id ? null : u.id)}
                          disabled={u.id === user.id || u.status === "pending"}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${ROLE_STYLES[u.role]} ${u.id === user.id || u.status === "pending" ? "cursor-default" : "hover:opacity-80 transition"}`}
                        >
                          {roleLabel(u.role)}
                          {u.id !== user.id && u.status !== "pending" && <ChevronDown size={11} strokeWidth={2} />}
                        </button>
                        {openDropdown === u.id && (
                          <div className="absolute bottom-full left-0 mb-1 bg-white border border-gray-100 rounded-lg shadow-lg z-50 py-1 min-w-35">
                            {ROLES.map((r) => (
                              <button key={r} onClick={() => changeRole(u.id, r)} className="w-full flex items-center gap-2 px-3 py-2 text-xs capitalize text-gray-700 hover:bg-gray-50 transition">
                                {u.role === r && <Check size={11} className="text-green-900 shrink-0" />}
                                <span className={u.role !== r ? "pl-3.75" : ""}>{roleLabel(r)}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="px-5 py-3.5 text-gray-500 text-sm">{u.department ?? "—"}</td>

                    <td className="px-5 py-3.5 text-gray-400 text-xs">
                      {new Date(u.joinedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </td>

                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                        u.status === "active" ? "bg-green-50 text-green-800 border border-green-100" :
                        u.status === "pending" ? "bg-amber-50 text-amber-700 border border-amber-100" :
                        "bg-gray-100 text-gray-500 border border-gray-200"
                      }`}>
                        {u.status}
                      </span>
                    </td>

                    <td className="px-5 py-3.5">
                      {u.id !== user.id && (
                        <div className="flex items-center gap-3">
                          {u.status === "pending" ? (
                            <button onClick={() => approveUser(u.id)} className="flex items-center gap-1 text-xs font-semibold text-green-900 hover:text-green-700 transition">
                              <UserPlus size={12} strokeWidth={2} /> Approve
                            </button>
                          ) : (
                            <button onClick={() => toggleStatus(u.id, u.status)} className={`text-xs font-semibold transition ${u.status === "active" ? "text-red-600 hover:text-red-700" : "text-green-900 hover:text-green-700"}`}>
                              {u.status === "active" ? "Suspend" : "Reinstate"}
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              Page {meta.page} of {meta.totalPages} · {meta.total} users
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                disabled={page >= meta.totalPages}
                className="px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
