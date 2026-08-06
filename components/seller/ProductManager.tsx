"use client";

import type { UmkmProduct } from "@/lib/types";
import { createProduct, deleteProduct, toggleProductAvailable } from "@/lib/actions";
import { formatRupiah } from "@/lib/utils";
import Image from "next/image";
import { useState, useRef } from "react";

export default function ProductManager({ umkmId, products }: { umkmId: string; products: UmkmProduct[] }) {
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData(e.currentTarget);
      formData.set("umkm_id", umkmId);
      formData.set("urutan", String(products.length));
      const result = await createProduct(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        setShowForm(false);
        setPreview(null);
      }
    } catch {
      setError("Gagal menyimpan produk.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Hapus produk "${name}"?`)) return;
    setDeletingId(id);
    try {
      await deleteProduct(id);
    } finally {
      setDeletingId(null);
    }
  }

  async function handleToggle(id: string, current: boolean) {
    setTogglingId(id);
    try {
      await toggleProductAvailable(id, !current);
    } finally {
      setTogglingId(null);
    }
  }

  return (
    <div>
      {/* Add Button */}
      <button onClick={() => setShowForm(!showForm)} className="btn-primary mb-6">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d={showForm ? "M6 18L18 6M6 6l12 12" : "M12 4v16m8-8H4"} />
        </svg>
        {showForm ? "Batal" : "Tambah Produk"}
      </button>

      {/* Add Form */}
      {showForm && (
        <div className="bg-surface border border-border rounded-xl p-5 mb-6 animate-fade-in">
          {error && (
            <div className="p-3 rounded-lg bg-danger-light border border-danger/20 text-danger text-sm mb-4">{error}</div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Photo */}
            <div className="border-2 border-dashed border-border rounded-xl p-4 text-center cursor-pointer hover:border-primary transition-colors" onClick={() => fileRef.current?.click()}>
              {preview ? (
                <div className="relative w-32 h-32 mx-auto rounded-lg overflow-hidden">
                  <Image src={preview} alt="Preview" fill className="object-cover" />
                </div>
              ) : (
                <div className="py-2">
                  <svg className="w-8 h-8 mx-auto text-text-muted mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-text-muted text-xs">Upload foto produk</p>
                </div>
              )}
              <input ref={fileRef} type="file" name="foto" accept="image/*" className="hidden" onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) { const r = new FileReader(); r.onloadend = () => setPreview(r.result as string); r.readAsDataURL(file); }
              }} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Nama Produk <span className="text-danger">*</span></label>
                <input type="text" name="nama_produk" required placeholder="Nama produk" className="form-input" />
              </div>
              <div>
                <label className="form-label">Harga (Rp)</label>
                <input type="number" name="harga" placeholder="Kosongkan jika hubungi untuk harga" className="form-input" min="0" />
              </div>
            </div>

            <div>
              <label className="form-label">Deskripsi</label>
              <textarea name="deskripsi" rows={2} placeholder="Deskripsi singkat..." className="form-input resize-none" />
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
                "Tambah Produk"
              )}
            </button>
          </form>
        </div>
      )}

      {/* Product List */}
      {products.length === 0 && !showForm ? (
        <div className="text-center py-12 bg-surface border border-border rounded-xl">
          <svg className="w-12 h-12 mx-auto text-text-muted mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <p className="text-text-secondary font-medium">Belum ada produk</p>
          <p className="text-text-muted text-sm mt-1">Tambahkan produk atau layanan Anda</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p) => (
            <div key={p.id} className="bg-surface border border-border rounded-xl overflow-hidden">
              <div className="relative aspect-square bg-border-light">
                <Image src={p.foto_url} alt={p.nama_produk} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover" />
                {!p.is_available && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="badge badge-danger">Tidak Tersedia</span>
                  </div>
                )}
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-text-primary text-sm truncate">{p.nama_produk}</h3>
                <p className="text-primary font-bold text-sm mt-1">
                  {p.harga ? formatRupiah(p.harga) : "Hubungi untuk harga"}
                </p>
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border-light">
                  {togglingId === p.id ? (
                    <svg className="animate-spin w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : (
                    <button onClick={() => handleToggle(p.id, p.is_available)} className={`toggle ${p.is_available ? "active" : ""} scale-90`} title="Ketersediaan" />
                  )}
                  <span className="text-xs text-text-muted flex-1">{p.is_available ? "Tersedia" : "Habis"}</span>
                  <button onClick={() => handleDelete(p.id, p.nama_produk)} disabled={deletingId === p.id} className="p-1.5 rounded-lg text-text-muted hover:text-danger hover:bg-danger-light transition-colors" title="Hapus">
                    {deletingId === p.id ? (
                      <svg className="animate-spin w-4 h-4 text-danger" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
