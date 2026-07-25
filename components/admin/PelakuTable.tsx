"use client";

import { useState } from "react";
import type { Profile, Umkm } from "@/lib/types";
import { adminUpdateProfile } from "@/lib/actions";
import Link from "next/link";
import { Search, UserCheck, MessageSquare, Store, Edit3, X, Check } from "lucide-react";

export interface SellerWithUmkm {
  profile: Profile;
  umkms: Umkm[];
}

export default function PelakuTable({ sellers }: { sellers: SellerWithUmkm[] }) {
  const [search, setSearch] = useState("");
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredSellers = sellers.filter((s) => {
    const q = search.toLowerCase();
    const matchName = s.profile.nama_lengkap.toLowerCase().includes(q);
    const matchWa = (s.profile.no_whatsapp || "").includes(q);
    const matchUmkm = s.umkms.some((u) => u.nama_usaha.toLowerCase().includes(q));
    return matchName || matchWa || matchUmkm;
  });

  const editingItem = sellers.find((s) => s.profile.id === editingUserId);

  async function handleUpdateProfile(formData: FormData) {
    if (!editingUserId) return;
    setLoading(true);
    setError(null);

    const res = await adminUpdateProfile(editingUserId, formData);
    if (res?.error) {
      setError(res.error);
    } else {
      setEditingUserId(null);
    }
    setLoading(false);
  }

  return (
    <div>
      {/* Search Bar */}
      <div className="mb-5 flex flex-col sm:flex-row items-center justify-between gap-4">
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

        <span className="text-xs text-text-muted font-medium self-end sm:self-auto">
          Total: {filteredSellers.length} Pelaku Usaha
        </span>
      </div>

      {/* Table */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
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

                      {/* UMKM List */}
                      <td className="p-4">
                        {umkms.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {umkms.map((u) => (
                              <Link
                                key={u.id}
                                href={`/admin/umkm/${u.id}/edit`}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-emerald-100 hover:text-emerald-800 text-xs font-medium transition-colors"
                              >
                                <Store className="w-3 h-3 text-emerald-600" />
                                <span>{u.nama_usaha}</span>
                              </Link>
                            ))}
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

      {/* Edit Profile Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-surface border border-border rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-text-primary text-base">Edit Profil Pelaku UMKM</h3>
              </div>
              <button
                onClick={() => setEditingUserId(null)}
                className="p-1 rounded-lg text-text-muted hover:bg-slate-100 text-slate-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-danger-light border border-danger/20 text-danger text-xs mb-4">
                {error}
              </div>
            )}

            <form action={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="form-label">Nama Lengkap <span className="text-danger">*</span></label>
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
                <select
                  name="role"
                  defaultValue={editingItem.profile.role}
                  className="form-input appearance-none cursor-pointer"
                >
                  <option value="seller">Pelaku UMKM (Seller)</option>
                  <option value="admin">Administrator (Admin)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingUserId(null)}
                  className="btn-secondary !py-2 !px-4 text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary !py-2 !px-5 text-xs flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  {loading ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
