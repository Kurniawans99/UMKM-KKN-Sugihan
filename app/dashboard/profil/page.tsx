import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";
import type { Metadata } from "next";
import ProfileForm from "@/components/seller/ProfileForm";

export const metadata: Metadata = { title: "Profil Akun" };

export default async function DashboardProfilPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single();

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">Profil Akun</h1>
        <p className="text-text-muted text-sm mt-1">Kelola informasi akun Anda</p>
      </div>

      <div className="bg-surface border border-border rounded-xl p-5 sm:p-7 max-w-lg">
        {/* Email (readonly) */}
        <div className="mb-5">
          <label className="form-label">Email</label>
          <input type="email" value={user?.email || ""} disabled className="form-input bg-border-light text-text-muted cursor-not-allowed" />
          <p className="text-text-muted text-xs mt-1">Email tidak dapat diubah</p>
        </div>

        <ProfileForm profile={profile as Profile} />
      </div>
    </div>
  );
}
