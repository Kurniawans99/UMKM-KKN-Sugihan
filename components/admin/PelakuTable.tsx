"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import type { Profile, Umkm } from "@/lib/types";
import { adminUpdateProfile, adminCreateUser } from "@/lib/actions";
import Link from "next/link";
import { Search, UserCheck, MessageSquare, Store, Edit3, X, Check, UserPlus, AlertCircle, CheckCircle2, ExternalLink, Download } from "lucide-react";
import CustomSelect from "@/components/shared/CustomSelect";
import { exportToExcel } from "@/lib/export";

const ROLE_OPTIONS = [
  { value: "seller", label: "Pelaku UMKM (Seller)" },
  { value: "admin", label: "Administrator (Admin)" },
];

export interface SellerWithUmkm {
  profile: Profile;
  umkms: Umkm[];
}

export default function PelakuTable({ sellers }: { sellers: SellerWithUmkm[] }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Edit profile state
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editRole, setEditRole] = useState("seller");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create user state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createRole, setCreateRole] = useState("seller");
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState<string | null>(null);

  const filteredSellers = sellers.filter((s) => {
    const q = search.toLowerCase();
    const matchName = s.profile.nama_lengkap.toLowerCase().includes(q);
    const matchWa = (s.profile.no_whatsapp || "").includes(q);
    const matchUmkm = s.umkms.some((u) => u.nama_usaha.toLowerCase().includes(q));
    return matchName || matchWa || matchUmkm;
  });

  const editingItem = sellers.find((s) => s.profile.id === editingUserId);

  const handleExportExcel = () => {
    const formatted = filteredSellers.map((item, index) => ({
      "No": index + 1,
      "ID User": item.profile.id,
      "Nama Lengkap Pemilik": item.profile.nama_lengkap,
      "No. WhatsApp": item.profile.no_whatsapp || "-",
      "Role Akses": item.profile.role === "admin" ? "Administrator" : "Pelaku UMKM",
      "Jumlah UMKM Dikelola": item.umkms.length,
      "Daftar UMKM": item.umkms.map((u) => u.nama_usaha).join(", ") || "Belum ada",
      "Tanggal Bergabung": new Date(item.profile.created_at).toLocaleDateString("id-ID"),
    }));

    exportToExcel(formatted, `Data_Pelaku_UMKM_Sugihan_${new Date().toISOString().split("T")[0]}`, "Pelaku UMKM");
  };

  async function handleUpdateProfile(formData: FormData) {
    if (!editingUserId) return;
    setLoading(true);
    setError(null);

    const res = await adminUpdateProfile(editingUserId, formData);
    if (res?.error) {
      setError(res.error);
    } else {
      setEditingUserId(null);
      router.refresh();
    }
    setLoading(false);
  }

  async function handleCreateUser(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCreateLoading(true);
    setCreateError(null);
    setCreateSuccess(null);

    const formData = new FormData(e.currentTarget);
    const res = await adminCreateUser(formData);

    if (res?.error) {
      setCreateError(res.error);
    } else {
      setCreateSuccess("Akun berhasil dibuat!");
      setTimeout(() => {
        setIsCreateOpen(false);
        setCreateSuccess(null);
        router.refresh();
      }, 1200);
    }
    setCreateLoading(false);
  }

  return (
    <div>
      {/* Top Header: Search Bar & Create Button */}
      <div className="mb-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari pelaku usaha / UMKM..."
            className="form-input !pl-9"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2.5">
          <span className="text-xs text-text-muted font-medium">
            Total: {filteredSellers.length} Akun
          </span>

          <button
            onClick={handleExportExcel}
            className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer shrink-0"
            title="Export Data Pelaku UMKM ke File Excel (.xlsx)"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Export Excel</span>
          </button>

          <button
            onClick={() => {
              setIsCreateOpen(true);
              setCreateError(null);
              setCreateSuccess(null);
            }}
            className="btn-primary !py-2.5 !px-4 text-xs flex items-center gap-1.5 shrink-0 shadow-sm cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Tambah Akun Baru</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto custom-scrollbar-h pb-2">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-border text-slate-700 font-semibold text-xs uppercase tracking-wider">
                <th className="p-4">Pelaku Usaha</th>
                <th className="p-4">No. WhatsApp</th>
                <th className="p-4">UMKM Dikelola</th>
                <th className="p-4">Tgl Bergabung</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-text-secondary">
              {filteredSellers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-text-muted text-sm">
                    Tidak ada data pelaku UMKM yang ditemukan.
                  </td>
                </tr>
              ) : (
                filteredSellers.map(({ profile, umkms }) => {
                  const cleanWa = (profile.no_whatsapp || "").replace(/[^0-9]/g, "");
                  const waUrl = cleanWa ? `https://wa.me/${cleanWa}` : null;

                  return (
                    <tr key={profile.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Name & Role */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm shrink-0">
                            {profile.nama_lengkap.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold text-text-primary block leading-tight">
                              {profile.nama_lengkap}
                            </span>
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold mt-1 ${
                                profile.role === "admin"
                                  ? "bg-purple-100 text-purple-700"
                                  : "bg-emerald-100 text-emerald-700"
                              }`}
                            >
                              {profile.role === "admin" ? "Administrator" : "Pelaku UMKM"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* WhatsApp */}
                      <td className="p-4 whitespace-nowrap">
                        {waUrl ? (
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-emerald-700 hover:underline font-medium"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            {profile.no_whatsapp}
                          </a>
                        ) : (
                          <span className="text-text-muted italic text-xs">Belum ada WA</span>
                        )}
                      </td>

                      {/* UMKM List (Truncated to max 2 + badge for rest) */}
                      <td className="p-4">
                        {umkms.length > 0 ? (
                          <div className="flex flex-wrap items-center gap-1.5">
                            {umkms.slice(0, 2).map((u) => (
                              <Link
                                key={u.id}
                                href={`/admin/umkm/${u.id}/edit`}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-emerald-100 hover:text-emerald-800 text-xs font-medium transition-colors"
                              >
                                <Store className="w-3 h-3 text-emerald-600" />
                                <span>{u.nama_usaha}</span>
                              </Link>
                            ))}
                            {umkms.length > 2 && (
                              <button
                                onClick={() => {
                                  setEditingUserId(profile.id);
                                  setError(null);
                                }}
                                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold transition-colors cursor-pointer"
                                title="Lihat seluruh UMKM di detail profil"
                              >
                                +{umkms.length - 2} usaha lagi
                              </button>
                            )}
                          </div>
                        ) : (
                          <span className="text-text-muted text-xs italic">Belum mendaftarkan UMKM</span>
                        )}
                      </td>

                      {/* Joined Date */}
                      <td className="p-4 whitespace-nowrap text-xs text-text-muted">
                        {new Date(profile.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      {/* Action */}
                      <td className="p-4 text-right">
                        <button
                          onClick={() => {
                            setEditingUserId(profile.id);
                            setError(null);
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 font-semibold text-xs transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          Edit Profil
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal 1: Create New User Account (Rendered via Portal at document.body) */}
      {mounted && isCreateOpen && createPortal(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-surface border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl relative my-auto max-h-[85vh] flex flex-col space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-border shrink-0">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-text-primary text-base">Buat Akun Pelaku UMKM Baru</h3>
              </div>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="p-1 rounded-lg text-text-muted hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {createError && (
                <div className="p-3 rounded-lg bg-danger-light border border-danger/20 text-danger text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{createError}</span>
                </div>
              )}

              {createSuccess && (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{createSuccess}</span>
                </div>
              )}

              <form id="create-user-form" onSubmit={handleCreateUser} className="space-y-4">
                <div>
                  <label className="form-label">
                    Nama Lengkap Pemilik <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="nama_lengkap"
                    required
                    placeholder="Contoh: Ahmad Subagyo"
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="form-label">
                    Email Login <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="ahmad@gmail.com"
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="form-label">
                    Password <span className="text-danger">*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    required
                    minLength={6}
                    placeholder="Minimal 6 karakter"
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="form-label">No. WhatsApp</label>
                  <input
                    type="text"
                    name="no_whatsapp"
                    placeholder="6281234567890"
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="form-label">Role Akses</label>
                  <CustomSelect
                    options={ROLE_OPTIONS}
                    value={createRole}
                    onChange={setCreateRole}
                    name="role"
                  />
                </div>
              </form>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-border shrink-0">
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="btn-secondary !py-2 !px-4 text-xs cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                form="create-user-form"
                disabled={createLoading}
                className="btn-primary !py-2 !px-5 text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                {createLoading ? "Membuat Akun..." : "Buat Akun Baru"}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Modal 2: Edit Profile Modal (Rendered via Portal at document.body) */}
      {mounted && editingItem && createPortal(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-surface border border-border rounded-2xl p-6 w-full max-w-lg shadow-2xl relative my-auto max-h-[85vh] flex flex-col space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-border shrink-0">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-text-primary text-base">Detail & Edit Profil Pelaku UMKM</h3>
              </div>
              <button
                onClick={() => setEditingUserId(null)}
                className="p-1 rounded-lg text-text-muted hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {error && (
                <div className="p-3 rounded-lg bg-danger-light border border-danger/20 text-danger text-xs">
                  {error}
                </div>
              )}

              {/* Managed UMKMs List in Modal */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-text-primary text-xs flex items-center gap-1.5">
                    <Store className="w-4 h-4 text-emerald-600" />
                    UMKM Dikelola ({editingItem.umkms.length})
                  </h4>
                </div>

                {editingItem.umkms.length > 0 ? (
                  <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                    {editingItem.umkms.map((u) => (
                      <div
                        key={u.id}
                        className="p-2.5 rounded-xl bg-white border border-border flex items-center justify-between gap-2 shadow-2xs"
                      >
                        <div className="min-w-0">
                          <p className="font-bold text-text-primary text-xs truncate">{u.nama_usaha}</p>
                          <p className="text-[11px] text-text-muted mt-0.5">
                            {u.kategori_usaha} • Dusun {u.dusun}
                          </p>
                        </div>
                        <Link
                          href={`/admin/umkm/${u.id}/edit`}
                          onClick={() => setEditingUserId(null)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold shrink-0 transition-colors"
                        >
                          <span>Kelola</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-text-muted italic bg-white p-3 rounded-lg border border-border">
                    Belum ada UMKM yang ditautkan ke akun pelaku usaha ini.
                  </p>
                )}
              </div>

              {/* Edit Profile Form */}
              <form id="edit-profile-form" action={handleUpdateProfile} className="space-y-4 pt-1">
                <div>
                  <label className="form-label">
                    Nama Lengkap <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="nama_lengkap"
                    required
                    defaultValue={editingItem.profile.nama_lengkap}
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="form-label">No. WhatsApp</label>
                  <input
                    type="text"
                    name="no_whatsapp"
                    defaultValue={editingItem.profile.no_whatsapp || ""}
                    placeholder="6281234567890"
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="form-label">Role Akses</label>
                  <CustomSelect
                    options={ROLE_OPTIONS}
                    value={editRole}
                    onChange={setEditRole}
                    name="role"
                  />
                </div>
              </form>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-border shrink-0">
              <button
                type="button"
                onClick={() => setEditingUserId(null)}
                className="btn-secondary !py-2 !px-4 text-xs cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                form="edit-profile-form"
                disabled={loading}
                className="btn-primary !py-2 !px-5 text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                {loading ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
