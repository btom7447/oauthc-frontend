"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import AuthLayout from "@/components/admin/AuthLayout";
import { Mail, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSent(true);
  };

  return (
    <AuthLayout>
      {sent ? (
        <div className="flex flex-col gap-6">
          <div className="w-14 h-14 rounded-2xl bg-green-900/10 flex items-center justify-center">
            <CheckCircle size={26} strokeWidth={1.5} className="text-green-900" />
          </div>
          <div>
            <h2 className="text-gray-900 text-2xl font-bold tracking-tight">Check your inbox</h2>
            <p className="text-gray-500 text-sm mt-2 leading-relaxed">
              We&apos;ve sent a password reset link to{" "}
              <span className="font-semibold text-gray-800">{email}</span>. The link expires in 30 minutes.
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl border border-gray-100 px-4 py-4 text-sm text-gray-500 leading-relaxed">
            Didn&apos;t receive it? Check your spam folder, or{" "}
            <button onClick={() => setSent(false)} className="text-green-900 font-semibold hover:underline underline-offset-2">
              try a different email
            </button>.
          </div>
          <Link href="/login" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition">
            <ArrowLeft size={14} strokeWidth={1.5} />Back to sign in
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-7">
          <div>
            <h2 className="text-gray-900 text-2xl font-bold tracking-tight">Forgot your password?</h2>
            <p className="text-gray-500 text-sm mt-1 leading-relaxed">
              Enter your staff email and we&apos;ll send you a secure link to reset your password.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600">Email Address</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" strokeWidth={1.5} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@oauthc.gov.ng"
                  className="w-full border border-gray-200 rounded-xl bg-gray-50 pl-9 pr-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent transition"
                  required
                  autoComplete="email"
                />
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full mt-1 flex items-center justify-center gap-2 bg-green-900 hover:bg-green-800 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl text-sm transition active:scale-95">
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Sending…</>
              ) : (
                <>Send Reset Link <ArrowRight size={14} strokeWidth={2} /></>
              )}
            </button>
          </form>
          <Link href="/login" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition">
            <ArrowLeft size={14} strokeWidth={1.5} />Back to sign in
          </Link>
        </div>
      )}
    </AuthLayout>
  );
}
