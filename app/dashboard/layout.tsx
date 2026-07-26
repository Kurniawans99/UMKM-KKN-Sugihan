import SellerSidebar from "@/components/seller/SellerSidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard UMKM",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-background">
      <SellerSidebar />
      <main className="flex-1 min-w-0 lg:overflow-auto">
        <div className="p-3 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
