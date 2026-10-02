import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { SectionWrapper } from "@/components/ui/ErrorBoundary";
import { galleryService } from "@/services/index";
import type { GalleryItem } from "@/types";

export default function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = React.useState(false);
  const [lightboxSrc, setLightboxSrc] = React.useState<string | null>(null);
  const [lightboxAlt, setLightboxAlt] = React.useState<string>("");
  const [lightboxCaption, setLightboxCaption] = React.useState<string>("");

  const openLightbox = (src: string, alt: string, caption: string) => {
    setLightboxSrc(src);
    setLightboxAlt(alt);
    setLightboxCaption(caption);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setLightboxSrc(null);
  };

  useEffect(() => {
    const loadGallery = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await galleryService.list();
        setItems(res.data || []);
      } catch (err: any) {
        setError(err.message || "Failed to load gallery");
      } finally {
        setLoading(false);
      }
    };
    loadGallery();
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
    };
    if (lightboxOpen) {
      document.addEventListener("keydown", handleKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [lightboxOpen]);

  return (
    <SectionWrapper spacing="lg">
      <div className="mb-12 text-center">
        <h1 className="font-display text-4xl font-bold text-neutral-900 sm:text-5xl">
          Photo Gallery
        </h1>
        <p className="mt-4 text-lg text-neutral-600">
          A visual journey through our foundation's work and community.
        </p>
      </div>

      {loading ? (
        <LoadingSpinner label="Loading gallery..." />
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600">{error}</p>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
            <span className="text-2xl">📷</span>
          </div>
          <p className="text-neutral-500">No gallery images available yet.</p>
        </div>
      ) : (
        <>
          <div className="columns-1 gap-4 space-y-4 sm:columns-2 lg:columns-3 xl:columns-4">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => openLightbox(item.image_url, item.alt_text || item.caption || "", item.caption || "")}
                className="group relative block w-full"
              >
                <img
                  src={item.image_url}
                  alt={item.alt_text || item.caption || ""}
                  className="h-auto w-full rounded-xl object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                {item.caption && (
                  <div className="absolute inset-0 flex items-end rounded-xl bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="p-4 text-sm text-white">{item.caption}</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </>
      )}

      {lightboxOpen && lightboxSrc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Image gallery"
        >
          <div className="relative max-w-[90vw] max-h-[90vh]">
            <img
              src={lightboxSrc}
              alt={lightboxAlt}
              className="max-w-full max-h-[80vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            {lightboxCaption && (
              <div className="mt-4 text-center text-white text-sm max-w-2xl mx-auto">
                {lightboxCaption}
              </div>
            )}
          </div>
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-white hover:text-gold-400 transition-colors p-2"
            aria-label="Close"
          >
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </SectionWrapper>
  );
}