import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Umkm, UmkmProduct, UmkmGallery } from "@/lib/types";
import { formatRupiah } from "@/lib/utils";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import SingleUmkmMapWrapper from "@/components/public/SingleUmkmMapWrapper";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("umkm")
    .select("nama_usaha, deskripsi, foto_url, kategori_usaha, dusun")
    .eq("slug", slug)
    .eq("status", "approved")
    .eq("is_active", true)
    .single();

  if (!data) return { title: "UMKM Tidak Ditemukan" };

  return {
    title: data.nama_usaha,
    description: `${data.deskripsi.substring(0, 155)}...`,
    openGraph: {
      title: `${data.nama_usaha} — UMKM Desa Sugihan`,
      description: data.deskripsi.substring(0, 155),
      images: [data.foto_url],
    },
  };
}

export default async function UmkmProfilePage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  // Fetch UMKM
  const { data: umkm, error } = await supabase
    .from("umkm")
    .select("*")
    .eq("slug", slug)
    .eq("status", "approved")
    .eq("is_active", true)
    .single();

  if (error || !umkm) notFound();

  const u = umkm as Umkm;

  // Fetch products
  const { data: products } = await supabase
    .from("umkm_products")
    .select("*")
    .eq("umkm_id", u.id)
    .order("urutan", { ascending: true });

  // Fetch gallery
  const { data: gallery } = await supabase
    .from("umkm_gallery")
    .select("*")
    .eq("umkm_id", u.id)
    .order("urutan", { ascending: true });

  const productList = (products || []) as UmkmProduct[];
  const galleryList = (gallery || []) as UmkmGallery[];
  const waLink = `https://wa.me/${u.no_whatsapp.replace(/[^0-9]/g, "")}`;

  return (
    <>
      <Navbar />

      {/* Banner */}
      <section className="relative h-48 sm:h-64 lg:h-80 bg-gradient-to-br from-primary-dark to-primary overflow-hidden">
        {u.banner_url ? (
          <Image
            src={u.banner_url}
            alt={`Banner ${u.nama_usaha}`}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 hero-gradient" />
        )}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-white/70 text-sm mb-3">
              <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
              <span>/</span>
              <span className="text-white font-medium truncate">{u.nama_usaha}</span>
            </nav>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-2 animate-fade-in">
              {u.nama_usaha}
            </h1>
            {u.tagline && (
              <p className="text-white/80 text-sm sm:text-base animate-fade-in delay-100 opacity-0">
                {u.tagline}
              </p>
            )}
          </div>
        </div>
      </section>

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          {/* Info Section */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-10 animate-fade-in-up">
            {/* Photo */}
            <div className="relative aspect-square rounded-xl overflow-hidden bg-border-light shadow-lg">
              <Image
                src={u.foto_url}
                alt={u.nama_usaha}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 33vw"
                priority
              />
              <div className="absolute top-3 left-3">
                <span className="badge badge-primary glass !border-0">{u.kategori_usaha}</span>
              </div>
            </div>

            {/* Details */}
            <div className="lg:col-span-2">
              <div className="bg-surface border border-border rounded-xl p-5 sm:p-7 h-full">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="badge badge-primary">{u.kategori_usaha}</span>
                  <span className="badge bg-border-light text-text-secondary">Dusun {u.dusun}</span>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-text-primary mb-1">{u.nama_usaha}</h2>

                <p className="text-text-muted text-sm flex items-center gap-1.5 mb-4">
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {u.nama_pemilik}
                </p>

                <p className="text-text-secondary leading-relaxed mb-6 whitespace-pre-line">{u.deskripsi}</p>

                {/* Location */}
                <div className="flex items-start gap-2 text-sm text-text-secondary mb-6">
                  <svg className="w-4 h-4 shrink-0 text-primary mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>
                    Dusun {u.dusun}
                    {u.alamat_detail && ` — ${u.alamat_detail}`}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp py-3 px-6 rounded-lg text-center font-semibold flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Hubungi via WhatsApp
                  </a>
                  {u.link_eksternal && (
                    <a
                      href={u.link_eksternal}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary py-3 px-6 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Link Eksternal
                    </a>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Map Location Section */}
          <SingleUmkmMapWrapper umkm={u} />

          {/* Products Section */}
          {productList.length > 0 && (
            <section className="mb-10 animate-fade-in-up delay-200 opacity-0">
              <h2 className="text-xl sm:text-2xl font-bold text-text-primary mb-5 flex items-center gap-2">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                Produk & Layanan
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {productList.map((product) => (
                  <div key={product.id} className="bg-surface border border-border rounded-xl overflow-hidden card-hover group">
                    <div className="relative aspect-square overflow-hidden bg-border-light">
                      <Image
                        src={product.foto_url}
                        alt={product.nama_produk}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {!product.is_available && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="badge badge-danger text-xs">Habis</span>
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-text-primary text-sm mb-1 truncate">{product.nama_produk}</h3>
                      {product.deskripsi && (
                        <p className="text-text-muted text-xs line-clamp-2 mb-2">{product.deskripsi}</p>
                      )}
                      <p className="text-primary font-bold text-sm">
                        {product.harga ? formatRupiah(product.harga) : "Hubungi untuk harga"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Gallery Section */}
          {galleryList.length > 0 && (
            <section className="mb-10 animate-fade-in-up delay-300 opacity-0">
              <h2 className="text-xl sm:text-2xl font-bold text-text-primary mb-5 flex items-center gap-2">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Galeri Foto
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {galleryList.map((photo) => (
                  <div key={photo.id} className="relative aspect-square rounded-xl overflow-hidden bg-border-light group card-hover">
                    <Image
                      src={photo.foto_url}
                      alt={photo.caption || `Foto ${u.nama_usaha}`}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {photo.caption && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                        <p className="text-white text-xs">{photo.caption}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Floating WhatsApp Button (Mobile) */}
      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full btn-whatsapp flex items-center justify-center shadow-xl lg:hidden"
        aria-label="Hubungi via WhatsApp"
      >
        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>

      <Footer />
    </>
  );
}
