"use client";

import type { Umkm } from "@/lib/types";
import { deleteUmkm, toggleUmkmActive } from "@/lib/actions";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function UmkmTable({ data }: { data: Umkm[] }) {
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(id: string, namaUsaha: string) {
    if (!confirm(`Yakin ingin menghapus "${namaUsaha}"? Data tidak bisa dikembalikan.`)) return;

    setDeleting(id);
    await deleteUmkm(id);
    setDeleting(null);
  }

  async function handleToggle(id: string, currentActive: boolean) {
    await toggleUmkmActive(id, !currentActive);
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-border-light flex items-center justify-center">
          <svg className="w-8 h-8 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-text-primary mb-1">Belum ada data UMKM</h3>
        <p className="text-text-muted text-sm mb-4">Mulai tambahkan UMKM pertama.</p>
        <Link href="/admin/umkm/tambah" className="btn-primary">
          + Tambah UMKM
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="data-table">
        <thead>
          <tr>
            <th>UMKM</th>
            <th>Kategori</th>
            <th>Dusun</th>
            <th>WhatsApp</th>
            <th>Status</th>
            <th className="text-right">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.map((umkm) => (
            <tr key={umkm.id} className={deleting === umkm.id ? "opacity-50" : ""}>
              {/* UMKM Info */}
              <td>
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-border-light shrink-0">
                    <Image
                      src={umkm.foto_url}
                      alt={umkm.nama_usaha}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-text-primary text-sm truncate max-w-[200px]">
                      {umkm.nama_usaha}
                    </p>
                    <p className="text-text-muted text-xs truncate max-w-[200px]">
                      {umkm.nama_pemilik}
                    </p>
                  </div>
                </div>
              </td>

              {/* Kategori */}
              <td>
                <span className="badge badge-primary">{umkm.kategori_usaha}</span>
              </td>

              {/* Dusun */}
              <td className="text-text-secondary text-sm">{umkm.dusun}</td>

              {/* WhatsApp */}
              <td className="text-text-secondary text-sm font-mono">{umkm.no_whatsapp}</td>

              {/* Status */}
              <td>
                <div className="flex items-center gap-2">
                  <span className={`badge text-xs ${
                    umkm.status === "approved" ? "badge-success" :
                    umkm.status === "pending" ? "badge-warning" : "badge-danger"
                  }`}>
                    {umkm.status === "approved" ? "✅" : umkm.status === "pending" ? "⏳" : "❌"} {umkm.status}
                  </span>
                  {umkm.status === "approved" && (
                    <button
                      onClick={() => handleToggle(umkm.id, umkm.is_active)}
                      className={`toggle scale-75 ${umkm.is_active ? "active" : ""}`}
                      title={umkm.is_active ? "Aktif" : "Nonaktif"}
                      id={`toggle-${umkm.id}`}
                    />
                  )}
                </div>
              </td>

              {/* Actions */}
              <td>
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/admin/umkm/${umkm.id}/edit`}
                    className="p-2 rounded-lg text-text-muted hover:text-primary hover:bg-primary-50 transition-colors"
                    title="Edit"
                    id={`edit-${umkm.id}`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </Link>
                  <button
                    onClick={() => handleDelete(umkm.id, umkm.nama_usaha)}
                    disabled={deleting === umkm.id}
                    className="p-2 rounded-lg text-text-muted hover:text-danger hover:bg-danger-light transition-colors"
                    title="Hapus"
                    id={`delete-${umkm.id}`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
