"use client";

import type { Umkm, UmkmProduct, UmkmGallery, Profile } from "@/lib/types";
import { exportMultiSheetExcel } from "@/lib/export";
import { FileSpreadsheet } from "lucide-react";

interface SellerExportButtonProps {
  profile: Profile;
  umkms: Umkm[];
  products: UmkmProduct[];
  gallery: UmkmGallery[];
}

export default function SellerExportButton({
  profile,
  umkms,
  products,
  gallery,
}: SellerExportButtonProps) {
  const handleExport = () => {
    // Sheet 1: UMKM Data
    const sheetUmkm = umkms.map((u, i) => ({
      "No": i + 1,
      "ID UMKM": u.id,
      "Nama Usaha": u.nama_usaha,
      "Kategori Usaha": u.kategori_usaha,
      "Dusun": u.dusun,
      "Alamat Detail": u.alamat_detail || "-",
      "No. WhatsApp": u.no_whatsapp,
      "Status Approval": u.status === "approved" ? "Disetujui" : u.status === "pending" ? "Menunggu Review" : "Ditolak",
      "Status Tampil": u.is_active ? "Aktif" : "Non-Aktif",
      "Deskripsi": u.deskripsi || "-",
      "Link Eksternal": u.link_eksternal || "-",
      "Tanggal Terdaftar": new Date(u.created_at).toLocaleDateString("id-ID"),
    }));

    // Sheet 2: Products Data
    const sheetProducts = products.map((p, i) => {
      const parentUmkm = umkms.find((u) => u.id === p.umkm_id);
      return {
        "No": i + 1,
        "ID Produk": p.id,
        "Nama Produk": p.nama_produk,
        "Nama UMKM": parentUmkm?.nama_usaha || "-",
        "Harga (Rp)": p.harga || "-",
        "Status Ketersediaan": p.is_available ? "Tersedia" : "Stok Habis",
        "Deskripsi Produk": p.deskripsi || "-",
        "Tanggal Dibuat": new Date(p.created_at).toLocaleDateString("id-ID"),
      };
    });

    // Sheet 3: Gallery Data
    const sheetGallery = gallery.map((g, i) => {
      const parentUmkm = umkms.find((u) => u.id === g.umkm_id);
      return {
        "No": i + 1,
        "ID Foto": g.id,
        "Nama UMKM": parentUmkm?.nama_usaha || "-",
        "Caption Foto": g.caption || "-",
        "URL Foto": g.foto_url,
        "Tanggal Upload": new Date(g.created_at).toLocaleDateString("id-ID"),
      };
    });

    const cleanName = profile.nama_lengkap.replace(/[^a-zA-Z0-9]/g, "_");
    const dateStr = new Date().toISOString().split("T")[0];

    exportMultiSheetExcel(
      [
        { sheetName: "UMKM Saya", data: sheetUmkm },
        { sheetName: "Produk Saya", data: sheetProducts },
        { sheetName: "Galeri Foto", data: sheetGallery },
      ],
      `Data_UMKM_Saya_${cleanName}_${dateStr}`
    );
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 shadow-2xs transition-all cursor-pointer"
      title="Export Seluruh Data UMKM, Produk, & Galeri ke Excel (.xlsx)"
    >
      <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
      <span>Export Data Saya (.xlsx)</span>
    </button>
  );
}
