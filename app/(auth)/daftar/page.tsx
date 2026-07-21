"use client";

import { useState } from "react";
import { registerAction } from "@/lib/actions";
import Link from "next/link";

export default function DaftarPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirm_password") as string;

    if (password !== confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter");
      setLoading(false);
      return;
    }

    const result = await registerAction(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background dot-pattern px-4 py-8">
      <div className="w-full max-w-md animate-scale-in">
        {/* Back to Home */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-primary transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Beranda
          </Link>
        </div>

        {/* Card */}
        <div className="bg-surface border border-border rounded-2xl p-8 shadow-lg">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center mb-4 shadow-md">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-text-primary mb-1">
              Daftar Pelaku UMKM
            </h1>
            <p className="text-text-muted text-sm">
              Buat akun untuk mendaftarkan UMKM Anda
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 p-3 rounded-lg bg-danger-light border border-danger/20 text-danger text-sm flex items-center gap-2 animate-fade-in">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          {/* Form */}
          <form action={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="nama_lengkap" className="form-label">Nama Lengkap</label>
              <input type="text" id="nama_lengkap" name="nama_lengkap" required placeholder="Nama lengkap Anda" className="form-input" />
            </div>

            <div>
              <label htmlFor="email" className="form-label">Email</label>
              <input type="email" id="email" name="email" required placeholder="email@contoh.com" className="form-input" autoComplete="email" />
            </div>

            <div>
              <label htmlFor="no_whatsapp" className="form-label">No. WhatsApp</label>
              <input type="text" id="no_whatsapp" name="no_whatsapp" required placeholder="6281234567890" className="form-input" />
              <p className="text-text-muted text-xs mt-1">Format: 62xxx (tanpa + atau spasi)</p>
            </div>

            <div>
              <label htmlFor="password" className="form-label">Password</label>
              <input type="password" id="password" name="password" required placeholder="Minimal 6 karakter" className="form-input" autoComplete="new-password" />
            </div>

            <div>
              <label htmlFor="confirm_password" className="form-label">Konfirmasi Password</label>
              <input type="password" id="confirm_password" name="confirm_password" required placeholder="Ulangi password" className="form-input" autoComplete="new-password" />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full !py-3 !mt-6" id="register-submit">
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Mendaftar...
                </span>
              ) : (
                "Daftar Sekarang"
              )}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-sm text-text-muted mt-6">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-primary font-semibold hover:underline">
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
