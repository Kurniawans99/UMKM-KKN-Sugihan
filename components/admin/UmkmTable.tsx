"use client";

import type { Umkm } from "@/lib/types";
import { deleteUmkm, toggleUmkmActive } from "@/lib/actions";
import { DAFTAR_DUSUN, KATEGORI_USAHA } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";
import CustomSelect from "@/components/shared/CustomSelect";
import { exportToExcel } from "@/lib/export";
import { Download } from "lucide-react";

export default function UmkmTable({ data }: { data: Umkm[] }) {
  const [deleting, setDeleting] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterDusun, setFilterDusun] = useState("");
  const [filterKategori, setFilterKategori] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const handleExportExcel = () => {
    const formatted = filteredData.map((u, index) => ({
      "No": index + 1,
      "ID UMKM": u.id,
      "Nama Usaha": u.nama_usaha,
      "Nama Pemilik": u.nama_pemilik,
      "Kategori Usaha": u.kategori_usaha,
      "Dusun": u.dusun,
      "Alamat Detail": u.alamat_detail || "-",
      "No. WhatsApp": u.no_whatsapp,
      "Status Approval": u.status === "approved" ? "Disetujui" : u.status === "pending" ? "Menunggu Review" : "Ditolak",
      "Status Tampil": u.is_active ? "Aktif" : "Non-Aktif",
      "Link Eksternal": u.link_eksternal || "-",
      "Deskripsi": u.deskripsi || "-",
      "Latitude": u.latitude || "-",
      "Longitude": u.longitude || "-",
      "Tanggal Terdaftar": new Date(u.created_at).toLocaleDateString("id-ID"),
    }));

    exportToExcel(formatted, `Data_UMKM_Sugihan_${new Date().toISOString().split("T")[0]}`, "Data UMKM");
  };

  const filteredData = useMemo(() => {
    return data.filter((umkm) => {
      const matchSearch =
        umkm.nama_usaha.toLowerCase().includes(search.toLowerCase()) ||
        umkm.nama_pemilik.toLowerCase().includes(search.toLowerCase());
      const matchDusun = filterDusun ? umkm.dusun === filterDusun : true;
      const matchKategori = filterKategori ? umkm.kategori_usaha === filterKategori : true;
      const matchStatus = filterStatus ? umkm.status === filterStatus : true;
      return matchSearch && matchDusun && matchKategori && matchStatus;
    });
  }, [data, search, filterDusun, filterKategori, filterStatus]);

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
    <div className="space-y-4">
      {/* Filter Toolbar Card */}
      <div className="bg-surface border border-border rounded-xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <svg
              className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Cari nama UMKM atau pemilik..."
              className="w-full bg-background border border-border rounded-lg pl-9 pr-8 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none transition-colors"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary p-0.5 rounded-full"
                title="Hapus pencarian"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Result Count, Export & Reset Button */}
          <div className="flex flex-wrap items-center gap-3 shrink-0 justify-between md:justify-end">
            <span className="text-xs text-text-muted font-medium">
              {filteredData.length} dari {data.length} UMKM
            </span>
            <button
              onClick={handleExportExcel}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer shrink-0"
              title="Export Data UMKM ke File Excel (.xlsx)"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>Export Excel</span>
            </button>
            {(search || filterDusun || filterKategori || filterStatus) && (
              <button
                onClick={() => {
                  setSearch("");
                  setFilterDusun("");
                  setFilterKategori("");
                  setFilterStatus("");
                }}
                className="text-xs text-primary hover:text-primary-light font-semibold flex items-center gap-1 bg-primary-50 px-2.5 py-1 rounded-md transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reset Filter
              </button>
            )}
          </div>
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-border/50">
          {/* Filter Dusun */}
          <CustomSelect
            options={[
              { value: "", label: "Semua Dusun" },
              ...DAFTAR_DUSUN.map((d) => ({ value: d, label: `Dusun ${d}` })),
            ]}
            value={filterDusun}
            onChange={setFilterDusun}
            placeholder="Semua Dusun"
          />

          {/* Filter Kategori */}
          <CustomSelect
            options={[
              { value: "", label: "Semua Kategori" },
              ...KATEGORI_USAHA.map((k) => ({ value: k, label: k })),
            ]}
            value={filterKategori}
            onChange={setFilterKategori}
            placeholder="Semua Kategori"
          />

          {/* Filter Status */}
          <CustomSelect
            options={[
              { value: "", label: "Semua Status" },
              { value: "approved", label: "✅ Approved" },
              { value: "pending", label: "⏳ Pending" },
              { value: "rejected", label: "❌ Rejected" },
            ]}
            value={filterStatus}
            onChange={setFilterStatus}
            placeholder="Semua Status"
          />
        </div>
      </div>

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
          {filteredData.length > 0 ? (
            filteredData.map((umkm) => (
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
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center py-8 text-text-muted">
                Tidak ada data yang sesuai dengan filter.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    </div>
  );
}
