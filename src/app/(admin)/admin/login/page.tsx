"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/admin-auth";
import { Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import Image from "next/image";

export default function AdminLoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      router.push("/admin");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — image panel (3/4) */}
      <div className="hidden lg:flex lg:w-3/4 relative">
        <Image
          src="/images/admin/auth.jpg"
          alt="OAUTHC Hospital"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-green-950/60" />

        {/* Branding overlay */}
        <div className="relative z-10 flex flex-col justify-between h-full p-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 relative">
              <Image src="/logo.png" alt="OAUTHC" fill className="object-contain" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">OAUTHC</span>
          </div>

          <div className="max-w-lg">
            <h1 className="text-white text-4xl font-bold font-yeseva leading-snug">
              Delivering excellence in healthcare, research, and training.
            </h1>
            <p className="text-green-200 mt-4 text-base leading-relaxed">
              Welcome to the OAUTHC staff portal. Manage appointments, content,
              and hospital operations from one place.
            </p>
          </div>

          <p className="text-green-300 text-xs">
            © {new Date().getFullYear()} Obafemi Awolowo University Teaching Hospitals Complex
          </p>
        </div>
      </div>

      {/* Right — form panel (1/4) */}
      <div className="w-full lg:w-1/4 bg-white flex flex-col justify-center px-8 py-12">
        {/* Mobile logo */}
        <div className="flex items-center gap-3 mb-8 lg:hidden">
          <div className="w-8 h-8 relative">
            <Image src="/logo.png" alt="OAUTHC" fill className="object-contain" />
          </div>
          <span className="text-gray-900 font-bold text-base">OAUTHC Admin</span>
        </div>

        <div className="flex flex-col gap-1.5 mb-8">
          <h2 className="text-gray-900 text-2xl font-bold">Sign in</h2>
          <p className="text-gray-400 text-sm">Enter your credentials to continue.</p>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2.5 bg-red-50 border border-red-100 text-red-700 text-sm rounded-lg px-4 py-3 mb-5">
            <AlertCircle size={15} strokeWidth={1.5} className="shrink-0" />
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Email Address
            </label>
            <div className="relative">
              <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" strokeWidth={1.5} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@oauthc.gov.ng"
                className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent transition"
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Password
            </label>
            <div className="relative">
              <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" strokeWidth={1.5} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-gray-200 rounded-lg pl-9 pr-10 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent transition"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              >
                {showPassword ? <EyeOff size={14} strokeWidth={1.5} /> : <Eye size={14} strokeWidth={1.5} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-900 hover:bg-green-800 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg text-sm transition active:scale-95"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        {/* Demo credentials */}
        <div className="mt-8 border-t border-gray-100 pt-6 flex flex-col gap-1.5">
          <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-1">
            Demo credentials
          </p>
          {[
            { role: "Super Admin", email: "super@oauthc.gov.ng" },
            { role: "Admin", email: "admin@oauthc.gov.ng" },
            { role: "Doctor", email: "doctor@oauthc.gov.ng" },
          ].map(({ role, email: e }) => (
            <button
              key={e}
              type="button"
              onClick={() => { setEmail(e); setPassword("password"); }}
              className="text-left text-xs text-gray-500 hover:text-green-900 transition"
            >
              <span className="font-semibold">{role}:</span> {e}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
