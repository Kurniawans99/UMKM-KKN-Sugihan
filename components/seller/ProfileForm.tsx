"use client";

import { updateProfile } from "@/lib/actions";
import { useState } from "react";
import type { Profile } from "@/lib/types";

export default function ProfileForm({ profile }: { profile: Profile }) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const formData = new FormData(e.currentTarget);
      const result = await updateProfile(formData);
      if (result?.error) { setError(result.error); }
      else { setSuccess(true); }
    } catch {
      setError("Gagal memperbarui profil.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-3 rounded-lg bg-danger-light border border-danger/20 text-danger text-sm">{error}</div>
      )}
      {success && (
        <div className="p-3 rounded-lg bg-success-light border border-success/20 text-success text-sm animate-fade-in">
          ✅ Profil berhasil diperbarui
        </div>
      )}

      <div>
        <label htmlFor="nama_lengkap" className="form-label">Nama Lengkap</label>
        <input type="text" id="nama_lengkap" name="nama_lengkap" required defaultValue={profile.nama_lengkap} className="form-input" />
      </div>

      <div>
        <label htmlFor="no_whatsapp" className="form-label">No. WhatsApp</label>
        <input type="text" id="no_whatsapp" name="no_whatsapp" defaultValue={profile.no_whatsapp || ""} placeholder="6281234567890" className="form-input" />
      </div>

      <button type="submit" disabled={loading} className="btn-primary">
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Menyimpan...
          </span>
        ) : (
          "Simpan Profil"
        )}
      </button>
    </form>
  );
}
