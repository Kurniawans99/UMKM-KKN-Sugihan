"use client";

import type { Umkm } from "@/lib/types";
import { approveUmkm, rejectUmkm } from "@/lib/actions";
import Image from "next/image";
import { useState } from "react";

export default function ApprovalTable({ data }: { data: Umkm[] }) {
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState<string | null>(null);

  async function handleApprove(id: string) {
    setLoading(id);
    await approveUmkm(id);
    setLoading(null);
  }

  async function handleReject(id: string) {
    if (!reason.trim()) { alert("Alasan penolakan wajib diisi"); return; }
    setLoading(id);
    await rejectUmkm(id, reason.trim());
    setRejectingId(null);
    setReason("");
    setLoading(null);
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-16 bg-surface border border-border rounded-xl">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success-light flex items-center justify-center">
          <svg className="w-8 h-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-text-primary mb-1">Tidak ada UMKM pending</h3>
        <p className="text-text-muted text-sm">Semua pengajuan sudah diproses</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data.map((umkm) => (
        <div key={umkm.id} className={`bg-surface border border-border rounded-xl overflow-hidden animate-fade-in ${loading === umkm.id ? "opacity-50" : ""}`}>
          <div className="flex flex-col sm:flex-row">
            {/* Image */}
            <div className="relative w-full sm:w-48 h-48 sm:h-auto shrink-0 bg-border-light">
              <Image src={umkm.foto_url} alt={umkm.nama_usaha} fill sizes="200px" className="object-cover" />
            </div>

            {/* Info */}
            <div className="flex-1 p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h3 className="font-bold text-text-primary text-lg">{umkm.nama_usaha}</h3>
                  <p className="text-text-muted text-sm">{umkm.nama_pemilik}</p>
                </div>
                <span className={`badge shrink-0 ${umkm.status === "pending" ? "badge-warning" : umkm.status === "rejected" ? "badge-danger" : "badge-success"}`}>
                  {umkm.status === "pending" ? "⏳ Pending" : umkm.status === "rejected" ? "❌ Ditolak" : "✅ Disetujui"}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                <span className="badge badge-primary">{umkm.kategori_usaha}</span>
                <span className="badge bg-border-light text-text-secondary">Dusun {umkm.dusun}</span>
              </div>

              <p className="text-text-secondary text-sm line-clamp-2 mb-4">{umkm.deskripsi}</p>

              <p className="text-text-muted text-xs mb-4">WA: {umkm.no_whatsapp}</p>

              {/* Reject Form */}
              {rejectingId === umkm.id ? (
                <div className="space-y-3 p-3 bg-danger-light rounded-lg border border-danger/20 animate-fade-in">
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Tuliskan alasan penolakan..."
                    rows={2}
                    className="form-input resize-none text-sm"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button onClick={() => handleReject(umkm.id)} disabled={loading === umkm.id} className="btn-danger text-sm !py-2">
                      Konfirmasi Tolak
                    </button>
                    <button onClick={() => { setRejectingId(null); setReason(""); }} className="btn-secondary text-sm !py-2">
                      Batal
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  {umkm.status === "pending" && (
                    <>
                      <button onClick={() => handleApprove(umkm.id)} disabled={loading === umkm.id} className="btn-primary text-sm !py-2">
                        ✅ Approve
                      </button>
                      <button onClick={() => setRejectingId(umkm.id)} className="btn-danger text-sm !py-2">
                        ❌ Reject
                      </button>
                    </>
                  )}
                  {umkm.status === "rejected" && (
                    <button onClick={() => handleApprove(umkm.id)} disabled={loading === umkm.id} className="btn-primary text-sm !py-2">
                      ✅ Approve
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
