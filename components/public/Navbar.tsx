import Link from "next/link";
import Image from "next/image";
import { LogIn, Store, LayoutDashboard, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { logoutAction } from "@/lib/actions";

export default async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let role: "admin" | "seller" | null = null;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    role = profile?.role || "seller";
  }

  const dashboardHref = role === "admin" ? "/admin" : "/dashboard";
  const dashboardLabel = role === "admin" ? "Dashboard Admin" : "Dashboard Saya";

  return (
    <nav className="bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9 shrink-0 drop-shadow-xs group-hover:scale-105 transition-transform">
              <Image
                src="/logo-kab-semarang.png"
                alt="Logo Kabupaten Semarang"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div>
              <span className="font-extrabold text-base sm:text-lg text-slate-900 leading-tight block group-hover:text-emerald-700 transition-colors">
                UMKM Sugihan
              </span>
              <span className="text-[0.68rem] text-emerald-700 font-bold tracking-wider uppercase leading-tight block">
                Kab. Semarang
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              className="px-3.5 py-2 text-sm font-semibold text-slate-700 hover:text-emerald-700 transition-colors rounded-xl hover:bg-emerald-50"
            >
              Beranda
            </Link>

            {user ? (
              <>
                <Link
                  href={dashboardHref}
                  className="px-3.5 py-2 text-sm font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/60 transition-colors rounded-xl flex items-center gap-1.5"
                >
                  <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                  <span>{dashboardLabel}</span>
                </Link>

                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="px-3 py-2 text-sm font-semibold text-slate-600 hover:text-red-600 transition-colors rounded-xl hover:bg-red-50 flex items-center gap-1.5 cursor-pointer"
                    title="Keluar"
                  >
                    <LogOut className="w-4 h-4 text-slate-500" />
                    <span className="hidden sm:inline">Keluar</span>
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/daftar"
                  className="px-3.5 py-2 text-sm font-semibold text-slate-700 hover:text-emerald-700 transition-colors rounded-xl hover:bg-emerald-50 hidden sm:flex items-center gap-1.5"
                >
                  <Store className="w-4 h-4 text-emerald-600" />
                  <span>Daftar UMKM</span>
                </Link>
                <Link
                  href="/login"
                  className="btn-primary text-sm !px-4 !py-2 shadow-sm hover:shadow-md rounded-xl flex items-center gap-1.5"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">Masuk</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

