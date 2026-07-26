"use client";

import { KATEGORI_USAHA, DAFTAR_DUSUN } from "@/lib/constants";
import type { Umkm } from "@/lib/types";
import { useState, useRef } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import CustomSelect from "@/components/shared/CustomSelect";

const LocationPicker = dynamic(() => import("@/components/shared/LocationPicker"), {
  ssr: false,
  loading: () => (
    <div className="h-[280px] rounded-xl bg-slate-100 animate-pulse flex items-center justify-center">
      <span className="text-slate-400 text-sm">Memuat peta...</span>
    </div>
  ),
});

interface UmkmFormProps {
  umkm?: Umkm;
  action: (formData: FormData) => Promise<{ error?: string } | undefined | void>;
  submitLabel: string;
}

export default function UmkmForm({ umkm, action, submitLabel }: UmkmFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(umkm?.foto_url || null);
  const [selectedKategori, setSelectedKategori] = useState(umkm?.kategori_usaha || "");
  const [selectedDusun, setSelectedDusun] = useState(umkm?.dusun || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    try {
      const result = await action(formData);
      if (result?.error) {
        setError(result.error);
        setLoading(false);
      }
    } catch {
      // redirect throws, which is expected behavior
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="p-3 rounded-lg bg-danger-light border border-danger/20 text-danger text-sm flex items-center gap-2 animate-fade-in">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      {/* Image Upload */}
      <div>
        <label className="form-label">
          Foto Produk/Usaha <span className="text-danger">*</span>
        </label>
        <div
          className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary hover:bg-primary-50/30 transition-all"
          onClick={() => fileInputRef.current?.click()}
        >
          {preview ? (
            <div className="relative w-full max-w-xs mx-auto aspect-[4/3] rounded-lg overflow-hidden">
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <span className="text-white text-sm font-medium">Ganti Foto</span>
              </div>
            </div>
          ) : (
            <div className="py-4">
              <svg className="w-10 h-10 mx-auto text-text-muted mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-text-secondary text-sm font-medium">
                Klik untuk upload foto
              </p>
              <p className="text-text-muted text-xs mt-1">
                JPG, PNG, atau WebP (maks. 5MB)
              </p>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            name="foto"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="foto-input"
          />
        </div>
        {umkm?.foto_url && (
          <input type="hidden" name="existing_foto_url" value={umkm.foto_url} />
        )}
      </div>

      {/* 2 Column Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Nama Usaha */}
        <div>
          <label htmlFor="nama_usaha" className="form-label">
            Nama Usaha <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            id="nama_usaha"
            name="nama_usaha"
            required
            defaultValue={umkm?.nama_usaha}
            placeholder="Contoh: Warung Bu Sari"
            className="form-input"
          />
        </div>

        {/* Nama Pemilik */}
        <div>
          <label htmlFor="nama_pemilik" className="form-label">
            Nama Pemilik <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            id="nama_pemilik"
            name="nama_pemilik"
            required
            defaultValue={umkm?.nama_pemilik}
            placeholder="Contoh: Sari Wulandari"
            className="form-input"
          />
        </div>

        {/* Kategori Usaha */}
        <div>
          <label className="form-label">
            Kategori Usaha <span className="text-danger">*</span>
          </label>
          <CustomSelect
            options={KATEGORI_USAHA.map((k) => ({ value: k, label: k }))}
            value={selectedKategori}
            onChange={setSelectedKategori}
            placeholder="Pilih kategori..."
            name="kategori_usaha"
            required
          />
        </div>

        {/* Dusun */}
        <div>
          <label className="form-label">
            Dusun <span className="text-danger">*</span>
          </label>
          <CustomSelect
            options={DAFTAR_DUSUN.map((d) => ({ value: d, label: `Dusun ${d}` }))}
            value={selectedDusun}
            onChange={setSelectedDusun}
            placeholder="Pilih dusun..."
            name="dusun"
            required
          />
        </div>

        {/* No WhatsApp */}
        <div>
          <label htmlFor="no_whatsapp" className="form-label">
            No. WhatsApp <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            id="no_whatsapp"
            name="no_whatsapp"
            required
            defaultValue={umkm?.no_whatsapp}
            placeholder="Contoh: 6281234567890"
            className="form-input"
          />
          <p className="text-text-muted text-xs mt-1">
            Format: 62xxx (tanpa + atau spasi)
          </p>
        </div>

        {/* Link Eksternal */}
        <div>
          <label htmlFor="link_eksternal" className="form-label">
            Link Eksternal
          </label>
          <input
            type="url"
            id="link_eksternal"
            name="link_eksternal"
            defaultValue={umkm?.link_eksternal || ""}
            placeholder="Google Maps, Shopee, Instagram..."
            className="form-input"
          />
        </div>
      </div>

      {/* Alamat Detail */}
      <div>
        <label htmlFor="alamat_detail" className="form-label">
          Alamat / Patokan Jalan
        </label>
        <input
          type="text"
          id="alamat_detail"
          name="alamat_detail"
          defaultValue={umkm?.alamat_detail || ""}
          placeholder="Contoh: Depan Balai Desa RT 03"
          className="form-input"
        />
      </div>

      {/* Lokasi di Peta */}
      <LocationPicker
        defaultLat={umkm?.latitude}
        defaultLng={umkm?.longitude}
        dusun={selectedDusun}
      />

      {/* Deskripsi */}
      <div>
        <label htmlFor="deskripsi" className="form-label">
          Deskripsi Produk/Jasa <span className="text-danger">*</span>
        </label>
        <textarea
          id="deskripsi"
          name="deskripsi"
          required
          rows={4}
          defaultValue={umkm?.deskripsi}
          placeholder="Jelaskan produk atau jasa yang ditawarkan..."
          className="form-input resize-none"
        />
      </div>

      {/* Submit */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary !py-3 !px-6"
          id="form-submit"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Menyimpan...
            </span>
          ) : (
            submitLabel
          )}
        </button>
      </div>
    </form>
  );
}
