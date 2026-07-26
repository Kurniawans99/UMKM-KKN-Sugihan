"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Umkm, UmkmProduct, UmkmGallery, Profile } from "@/lib/types";
import UmkmForm from "@/components/admin/UmkmForm";
import ProductManager from "@/components/seller/ProductManager";
import GalleryManager from "@/components/seller/GalleryManager";
import { adminUpdateProfile, assignUmkmOwner } from "@/lib/actions";
import { Store, Package, Image as ImageIcon, User, CheckCircle2, Link2, UserCheck, AlertCircle } from "lucide-react";

interface AdminEditUmkmTabsProps {
  umkm: Umkm;
  products: UmkmProduct[];
  gallery: UmkmGallery[];
  ownerProfile: Profile | null;
  allProfiles: Profile[];
  action: (formData: FormData) => Promise<{ error?: string } | undefined | void>;
}

export default function AdminEditUmkmTabs({
  umkm,
  products,
  gallery,
  ownerProfile,
  allProfiles,
  action,
}: AdminEditUmkmTabsProps) {
  const [activeTab, setActiveTab] = useState<"info" | "produk" | "galeri" | "pemilik">("info");
  const router = useRouter();

  // State for Assigning Owner
  const [selectedUserId, setSelectedUserId] = useState<string>(umkm.user_id || "");
  const [assignLoading, setAssignLoading] = useState(false);
  const [assignError, setAssignError] = useState<string | null>(null);
  const [assignSuccess, setAssignSuccess] = useState(false);

  // State for Owner Profile Form
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState(false);

  async function handleAssignOwner(e: React.FormEvent) {
    e.preventDefault();
    setAssignLoading(true);
    setAssignError(null);
    setAssignSuccess(false);

    const targetId = selectedUserId.trim() ? selectedUserId : null;
    const res = await assignUmkmOwner(umkm.id, targetId);

    if (res?.error) {
      setAssignError(res.error);
    } else {
      setAssignSuccess(true);
      router.refresh();
    }
    setAssignLoading(false);
  }

  async function handleOwnerProfileUpdate(formData: FormData) {
    if (!ownerProfile) return;
    setProfileLoading(true);
    setProfileError(null);
    setProfileSuccess(false);

    const res = await adminUpdateProfile(ownerProfile.id, formData);
    if (res?.error) {
      setProfileError(res.error);
    } else {
      setProfileSuccess(true);
    }
    setProfileLoading(false);
  }

  return (
    <div>
      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-border pb-3 mb-6">
        <button
          type="button"
          onClick={() => setActiveTab("info")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors cursor-pointer ${
            activeTab === "info"
              ? "bg-primary text-white shadow-sm"
              : "bg-surface text-text-secondary hover:bg-border-light hover:text-text-primary border border-border"
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Informasi UMKM</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("produk")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors cursor-pointer ${
            activeTab === "produk"
              ? "bg-primary text-white shadow-sm"
              : "bg-surface text-text-secondary hover:bg-border-light hover:text-text-primary border border-border"
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Produk & Layanan ({products.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("galeri")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors cursor-pointer ${
            activeTab === "galeri"
              ? "bg-primary text-white shadow-sm"
              : "bg-surface text-text-secondary hover:bg-border-light hover:text-text-primary border border-border"
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Galeri Foto ({gallery.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("pemilik")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors cursor-pointer ${
            activeTab === "pemilik"
              ? "bg-primary text-white shadow-sm"
              : "bg-surface text-text-secondary hover:bg-border-light hover:text-text-primary border border-border"
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profil Pemilik</span>
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === "info" && (
        <div className="bg-surface border border-border rounded-xl p-5 sm:p-7 max-w-3xl animate-fade-in">
          <UmkmForm umkm={umkm} action={action} submitLabel="Update UMKM" />
        </div>
      )}

      {activeTab === "produk" && (
        <div className="bg-surface border border-border rounded-xl p-5 sm:p-7 animate-fade-in">
          <div className="mb-4 pb-3 border-b border-border">
            <h3 className="font-bold text-text-primary text-base">Kelola Produk & Layanan</h3>
            <p className="text-text-muted text-xs">
              Tambahkan atau perbarui katalog produk milik UMKM &quot;{umkm.nama_usaha}&quot;.
            </p>
          </div>
          <ProductManager umkmId={umkm.id} products={products} />
        </div>
      )}

      {activeTab === "galeri" && (
        <div className="bg-surface border border-border rounded-xl p-5 sm:p-7 animate-fade-in">
          <div className="mb-4 pb-3 border-b border-border">
            <h3 className="font-bold text-text-primary text-base">Kelola Galeri Foto</h3>
            <p className="text-text-muted text-xs">
              Tambahkan foto-foto kegiatan atau tempat usaha UMKM &quot;{umkm.nama_usaha}&quot;.
            </p>
          </div>
          <GalleryManager umkmId={umkm.id} gallery={gallery} />
        </div>
      )}

      {activeTab === "pemilik" && (
        <div className="space-y-6 max-w-2xl animate-fade-in">
          {/* Card 1: Assign/Link Owner Account */}
          <div className="bg-surface border border-border rounded-xl p-5 sm:p-7 shadow-xs">
            <div className="mb-4 pb-3 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="font-bold text-text-primary text-base flex items-center gap-2">
                  <Link2 className="w-5 h-5 text-emerald-600" />
                  Tautkan Akun Pemilik Usaha
                </h3>
                <p className="text-text-muted text-xs mt-0.5">
                  Tentukan atau ubah akun Pelaku UMKM terdaftar yang mengelola usaha &quot;{umkm.nama_usaha}&quot;.
                </p>
              </div>
            </div>

            {assignError && (
              <div className="p-3 rounded-lg bg-danger-light border border-danger/20 text-danger text-sm mb-4">
                {assignError}
              </div>
            )}
            {assignSuccess && (
              <div className="p-3 rounded-lg bg-success-light border border-success/20 text-success text-sm flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                Tautan akun pemilik berhasil diperbarui!
              </div>
            )}

            <form onSubmit={handleAssignOwner} className="space-y-4">
              <div>
                <label htmlFor="select_owner" className="form-label">
                  Pilih Akun Pelaku UMKM (User Terdaftar)
                </label>
                <div className="relative">
                  <select
                    id="select_owner"
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    className="form-input appearance-none cursor-pointer pr-8"
                  >
                    <option value="">-- Belum Terhubung (Tanpa Akun User) --</option>
                    {allProfiles.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nama_lengkap} {p.no_whatsapp ? `(${p.no_whatsapp})` : ""} — [{p.role.toUpperCase()}]
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-text-muted text-xs mt-1.5">
                  Jika ditautkan, pelaku usaha tersebut dapat melihat & mengelola UMKM ini secara mandiri di Dashboard mereka.
                </p>
              </div>

              <div className="pt-1">
                <button
                  type="submit"
                  disabled={assignLoading}
                  className="btn-primary !py-2.5 !px-5 text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <UserCheck className="w-4 h-4" />
                  {assignLoading ? "Menyimpan..." : "Simpan Tautan Akun Pemilik"}
                </button>
              </div>
            </form>
          </div>

          {/* Card 2: Edit Linked Owner Profile */}
          <div className="bg-surface border border-border rounded-xl p-5 sm:p-7 shadow-xs">
            <div className="mb-4 pb-3 border-b border-border">
              <h3 className="font-bold text-text-primary text-base flex items-center gap-2">
                <User className="w-5 h-5 text-emerald-600" />
                Detail Profile Pemilik Terhubung
              </h3>
              <p className="text-text-muted text-xs mt-0.5">
                Perbarui data profil akun pelaku usaha yang mengelola UMKM &quot;{umkm.nama_usaha}&quot;.
              </p>
            </div>

            {ownerProfile ? (
              <form action={handleOwnerProfileUpdate} className="space-y-4">
                {profileError && (
                  <div className="p-3 rounded-lg bg-danger-light border border-danger/20 text-danger text-sm mb-4">
                    {profileError}
                  </div>
                )}
                {profileSuccess && (
                  <div className="p-3 rounded-lg bg-success-light border border-success/20 text-success text-sm flex items-center gap-2 mb-4">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    Profil pemilik berhasil diperbarui!
                  </div>
                )}

                <div>
                  <label className="form-label">ID Akun User</label>
                  <input
                    type="text"
                    disabled
                    value={ownerProfile.id}
                    className="form-input bg-slate-50 text-text-muted cursor-not-allowed text-xs font-mono"
                  />
                </div>

                <div>
                  <label htmlFor="nama_lengkap" className="form-label">
                    Nama Lengkap Pemilik <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    id="nama_lengkap"
                    name="nama_lengkap"
                    required
                    defaultValue={ownerProfile.nama_lengkap}
                    className="form-input"
                  />
                </div>

                <div>
                  <label htmlFor="no_whatsapp" className="form-label">
                    No. WhatsApp Pemilik
                  </label>
                  <input
                    type="text"
                    id="no_whatsapp"
                    name="no_whatsapp"
                    defaultValue={ownerProfile.no_whatsapp || ""}
                    placeholder="6281234567890"
                    className="form-input"
                  />
                </div>

                <div>
                  <label htmlFor="role" className="form-label">
                    Role Akses
                  </label>
                  <select
                    id="role"
                    name="role"
                    defaultValue={ownerProfile.role}
                    className="form-input appearance-none cursor-pointer"
                  >
                    <option value="seller">Pelaku UMKM (Seller)</option>
                    <option value="admin">Administrator (Admin)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={profileLoading}
                  className="btn-primary !py-2.5 !px-6"
                >
                  {profileLoading ? "Menyimpan..." : "Simpan Perubahan Profil"}
                </button>
              </form>
            ) : (
              <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 text-sm">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-amber-900 mb-0.5">Akun Pemilik Belum Terhubung</p>
                    <p className="text-xs text-amber-800 leading-relaxed">
                      UMKM ini didaftarkan secara langsung oleh Admin atau belum memiliki akun pelaku UMKM terdaftar yang tertaut. Nama pemilik usaha di data publik: <strong>{umkm.nama_pemilik}</strong>.
                      <br />
                      Gunakan dropdown di kotak atas untuk menautkan UMKM ini ke akun terdaftar.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
