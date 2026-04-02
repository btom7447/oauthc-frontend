"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/admin-auth";
import AuthLayout from "@/components/admin/AuthLayout";
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight } from "lucide-react";

const inputCls =
  "w-full border border-gray-200 rounded-xl bg-gray-50 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent transition";

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
    <AuthLayout>
      <div className="flex flex-col gap-7">
        <div>
          <h2 className="text-gray-900 text-2xl font-bold tracking-tight">
            Welcome back
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Sign in to your staff account to continue.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2.5 bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl px-4 py-3">
            <AlertCircle size={15} strokeWidth={1.5} className="shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-600">
              Email Address
            </label>
            <div className="relative">
              <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" strokeWidth={1.5} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@oauthc.gov.ng"
                className={`${inputCls} pl-9 pr-4`}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-600">Password</label>
              <Link href="/forgot-password" className="text-xs text-green-900 font-semibold hover:underline underline-offset-2">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" strokeWidth={1.5} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`${inputCls} pl-9 pr-10`}
                required
                autoComplete="current-password"
              />
              <button type="button" onClick={() => setShowPassword((p) => !p)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition" tabIndex={-1}>
                {showPassword ? <EyeOff size={14} strokeWidth={1.5} /> : <Eye size={14} strokeWidth={1.5} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-1 flex items-center justify-center gap-2 bg-green-900 hover:bg-green-800 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl text-sm transition active:scale-95"
          >
            {loading ? (
              <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Signing in…</>
            ) : (
              <>Sign In <ArrowRight size={14} strokeWidth={2} /></>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-green-900 font-semibold hover:underline underline-offset-2">
            Request access
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
