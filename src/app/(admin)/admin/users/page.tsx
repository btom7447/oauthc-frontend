"use client";

import { useState } from "react";
import { useAuth, type Role } from "@/lib/admin-auth";
import { useRouter } from "next/navigation";
import {
  Search,
  ShieldOff,
  User,
  ChevronDown,
  Check,
} from "lucide-react";

type StaffUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  department?: string;
  status: "active" | "suspended";
};

const MOCK_USERS: StaffUser[] = [
  { id: "1", name: "Emeka Okafor", email: "admin@oauthc.gov.ng", role: "admin", status: "active" },
  { id: "2", name: "Amaka Nwosu", email: "staff@oauthc.gov.ng", role: "staff", status: "active" },
  { id: "3", name: "Dr. Adewale Ojo", email: "doctor@oauthc.gov.ng", role: "doctor", department: "Cardiology", status: "active" },
  { id: "4", name: "Dr. Ngozi Chukwu", email: "ngozi@oauthc.gov.ng", role: "doctor", department: "Radiology", status: "active" },
  { id: "5", name: "Dr. Tunde Lawal", email: "tunde@oauthc.gov.ng", role: "doctor", department: "Neurology", status: "active" },
  { id: "6", name: "Dr. Kemi Adeyinka", email: "kemi@oauthc.gov.ng", role: "doctor", department: "Ophthalmology", status: "suspended" },
  { id: "7", name: "Dr. Yetunde Abiola", email: "yetunde@oauthc.gov.ng", role: "doctor", department: "Oncology", status: "active" },
  { id: "8", name: "Bola Fashola", email: "bola@oauthc.gov.ng", role: "staff", status: "active" },
];

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
  const [users, setUsers] = useState<StaffUser[]>(MOCK_USERS);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  if (!user) return null;

  if (user.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4 text-center">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
          <ShieldOff size={24} strokeWidth={1.5} className="text-red-500" />
        </div>
        <div>
          <p className="text-gray-900 font-semibold">Access Restricted</p>
          <p className="text-gray-500 text-sm mt-1">
            User management is only available to Administrators.
          </p>
        </div>
        <button
          onClick={() => router.push("/admin")}
          className="text-sm text-green-900 font-semibold hover:underline"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.includes(search.toLowerCase())
  );

  const changeRole = (id: string, role: Role) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
    setOpenDropdown(null);
  };

  const toggleStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === "active" ? "suspended" : "active" }
          : u
      )
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-gray-900 text-xl font-bold">User Management</h1>
        <p className="text-gray-500 text-sm mt-1">
          {filtered.length} staff member{filtered.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-xs">
        <Search
          size={14}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          strokeWidth={1.5}
        />
        <input
          type="text"
          placeholder="Search name, email, role…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent bg-white shadow-sm transition"
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Staff
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Role
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Department
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Status
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-gray-400 text-sm py-12">
                    No users found.
                  </td>
                </tr>
              ) : (
                filtered.map((u) => (
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

                    {/* Role dropdown */}
                    <td className="px-5 py-3.5">
                      <div className="relative inline-block">
                        <button
                          onClick={() =>
                            setOpenDropdown(openDropdown === u.id ? null : u.id)
                          }
                          disabled={u.id === user.id}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${ROLE_STYLES[u.role]} ${u.id === user.id ? "cursor-default" : "hover:opacity-80 transition"}`}
                        >
                          {u.role.replace("-", " ")}
                          {u.id !== user.id && (
                            <ChevronDown size={11} strokeWidth={2} />
                          )}
                        </button>

                        {openDropdown === u.id && (
                          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-100 rounded-lg shadow-lg z-10 py-1 min-w-[140px]">
                            {ROLES.map((r) => (
                              <button
                                key={r}
                                onClick={() => changeRole(u.id, r)}
                                className="w-full flex items-center gap-2 px-3 py-2 text-xs capitalize text-gray-700 hover:bg-gray-50 transition"
                              >
                                {u.role === r && (
                                  <Check size={11} className="text-green-900 shrink-0" />
                                )}
                                <span className={u.role !== r ? "pl-[15px]" : ""}>
                                  {r.replace("-", " ")}
                                </span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="px-5 py-3.5 text-gray-500">
                      {u.department ?? "—"}
                    </td>

                    <td className="px-5 py-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                          u.status === "active"
                            ? "bg-green-50 text-green-800 border border-green-100"
                            : "bg-gray-100 text-gray-500 border border-gray-200"
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>

                    <td className="px-5 py-3.5">
                      {u.id !== user.id && (
                        <button
                          onClick={() => toggleStatus(u.id)}
                          className={`text-xs font-semibold transition ${
                            u.status === "active"
                              ? "text-red-600 hover:text-red-700"
                              : "text-green-900 hover:text-green-700"
                          }`}
                        >
                          {u.status === "active" ? "Suspend" : "Reinstate"}
                        </button>
                      )}
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
