"use client";

import type { UmkmGallery } from "@/lib/types";
import { addGalleryPhoto, deleteGalleryPhoto } from "@/lib/actions";
import Image from "next/image";
import { useState, useRef } from "react";

export default function GalleryManager({ umkmId, gallery }: { umkmId: string; gallery: UmkmGallery[] }) {
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData(e.currentTarget);
      formData.set("umkm_id", umkmId);
      formData.set("urutan", String(gallery.length));
      const result = await addGalleryPhoto(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        setShowForm(false);
        setPreview(null);
      }
    } catch {
      setError("Gagal mengupload foto.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Hapus foto ini?")) return;
    setDeletingId(id);
    try {
      await deleteGalleryPhoto(id);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <button onClick={() => setShowForm(!showForm)} className="btn-primary mb-6">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d={showForm ? "M6 18L18 6M6 6l12 12" : "M12 4v16m8-8H4"} />
        </svg>
        {showForm ? "Batal" : "Tambah Foto"}
      </button>

      {showForm && (
        <div className="bg-surface border border-border rounded-xl p-5 mb-6 animate-fade-in">
          {error && (
            <div className="p-3 rounded-lg bg-danger-light border border-danger/20 text-danger text-sm mb-4">{error}</div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-xl p-4 text-center cursor-pointer hover:border-primary transition-colors" onClick={() => fileRef.current?.click()}>
              {preview ? (
                <div className="relative w-48 h-48 mx-auto rounded-lg overflow-hidden">
                  <Image src={preview} alt="Preview" fill className="object-cover" />
                </div>
              ) : (
                <div className="py-4">
                  <svg className="w-10 h-10 mx-auto text-text-muted mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-text-muted text-sm">Klik untuk upload foto</p>
                </div>
              )}
              <input ref={fileRef} type="file" name="foto" accept="image/*" className="hidden" onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) { const r = new FileReader(); r.onloadend = () => setPreview(r.result as string); r.readAsDataURL(file); }
              }} />
            </div>
            <div>
              <label className="form-label">Caption (opsional)</label>
              <input type="text" name="caption" placeholder="Keterangan foto..." className="form-input" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Mengupload...
                </span>
              ) : (
                "Upload Foto"
              )}
            </button>
          </form>
        </div>
      )}

      {gallery.length === 0 && !showForm ? (
        <div className="text-center py-12 bg-surface border border-border rounded-xl">
          <svg className="w-12 h-12 mx-auto text-text-muted mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-text-secondary font-medium">Belum ada foto</p>
          <p className="text-text-muted text-sm mt-1">Tambahkan foto usaha, proses produksi, dll</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {gallery.map((photo) => (
            <div key={photo.id} className="relative group rounded-xl overflow-hidden bg-border-light aspect-square">
              <Image src={photo.foto_url} alt={photo.caption || "Foto galeri"} fill sizes="(max-width: 640px) 50vw, 25vw" className="object-cover" />
              {photo.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                  <p className="text-white text-xs">{photo.caption}</p>
                </div>
              )}
              <button
                onClick={() => handleDelete(photo.id)}
                disabled={deletingId === photo.id}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-danger disabled:opacity-100"
                title="Hapus"
              >
                {deletingId === photo.id ? (
                  <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
