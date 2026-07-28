import Link from "next/link";
import Image from "next/image";
import { LogIn, Store, LayoutDashboard, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { logoutAction } from "@/lib/actions";
import ThemeToggle from "@/components/shared/ThemeToggle";

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

  return (
    <nav className="bg-surface/95 backdrop-blur-md sticky top-0 z-50 border-b border-border shadow-xs transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 shrink-0 drop-shadow-xs group-hover:scale-105 transition-transform">
              <Image
                src="/logo-kab-semarang.png"
                alt="Logo Kabupaten Semarang"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="hidden sm:block min-w-0">
              <span className="font-extrabold text-sm sm:text-base md:text-lg text-text-primary leading-tight block group-hover:text-primary transition-colors truncate">
                UMKM Sugihan
              </span>
              <span className="text-[0.6rem] sm:text-[0.68rem] text-primary font-bold tracking-wider uppercase leading-tight block truncate">
                Kab. Semarang
              </span>
            </div>
          </Link>

          {/* Navigation Links & Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <Link
              href="/"
              className="px-3 py-1.5 text-xs sm:text-sm font-semibold text-text-secondary hover:text-primary transition-colors rounded-xl hover:bg-primary-50 hidden sm:block"
            >
              Beranda
            </Link>

            {/* Theme Toggle */}
            <ThemeToggle />

            {user ? (
              <>
                <Link
                  href={dashboardHref}
                  className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs sm:text-sm font-bold text-primary bg-primary-50 hover:bg-primary-100 border border-primary-200 transition-colors rounded-xl flex items-center gap-1.5 whitespace-nowrap shrink-0"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary shrink-0" />
                  <span>{role === "admin" ? "Dashboard Admin" : "Dashboard Saya"}</span>
                </Link>

                <form action={logoutAction} className="shrink-0">
                  <button
                    type="submit"
                    className="p-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm font-semibold text-text-secondary hover:text-danger transition-colors rounded-xl hover:bg-danger-light flex items-center gap-1.5 cursor-pointer"
                    title="Keluar"
                  >
                    <LogOut className="w-4 h-4 text-text-muted" />
                    <span className="hidden sm:inline">Keluar</span>
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/daftar"
                  className="px-3 py-2 text-xs sm:text-sm font-semibold text-text-secondary hover:text-primary transition-colors rounded-xl hover:bg-primary-50 hidden sm:flex items-center gap-1.5"
                >
                  <Store className="w-4 h-4 text-primary" />
                  <span>Daftar UMKM</span>
                </Link>
                <Link
                  href="/login"
                  className="btn-primary text-xs sm:text-sm !px-3 sm:!px-4 !py-1.5 sm:!py-2 shadow-sm hover:shadow-md rounded-xl flex items-center gap-1.5 whitespace-nowrap shrink-0"
                >
                  <LogIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Masuk</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
