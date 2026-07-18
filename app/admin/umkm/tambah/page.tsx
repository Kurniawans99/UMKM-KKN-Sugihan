import UmkmForm from "@/components/admin/UmkmForm";
import { createUmkm } from "@/lib/actions";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tambah UMKM",
};

export default function TambahUmkmPage() {
  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/umkm"
          className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-primary transition-colors mb-3"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Kembali ke Data UMKM
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
          Tambah UMKM Baru
        </h1>
        <p className="text-text-muted text-sm mt-1">
          Isi data UMKM yang akan ditambahkan ke direktori
        </p>
      </div>

      {/* Form */}
      <div className="bg-surface border border-border rounded-xl p-5 sm:p-7 max-w-3xl">
        <UmkmForm action={createUmkm} submitLabel="Simpan UMKM" />
      </div>
    </div>
  );
}
