import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { SectionWrapper } from "@/components/ui/ErrorBoundary";
import { galleryService } from "@/services/index";
import type { GalleryItem } from "@/types";

export default function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [lightboxAlt, setLightboxAlt] = useState<string>("");

  const openLightbox = (src: string, alt: string) => {
    setLightboxSrc(src);
    setLightboxAlt(alt);
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
      <div className="mb-8 text-center">
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
          <p className="text-neutral-500">No gallery images available yet.</p>
        </div>
      ) : (
        <div className="columns-1 gap-4 space-y-4 sm:columns-2 lg:columns-3 xl:columns-4">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => openLightbox(item.image_url, item.alt_text || item.caption || "")}
              className="group relative block w-full"
            >
              <img
                src={item.image_url}
                alt={item.alt_text || item.caption || ""}
                className="h-auto w-full rounded-xl object-cover transition-transform group-hover:scale-105"
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
      )}

      {lightboxOpen && lightboxSrc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
        >
          <img
            src={lightboxSrc}
            alt={lightboxAlt}
            className="max-w-[90vw] max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-neutral-300"
            aria-label="Close"
          >
            ×
          </button>
        </div>
      )}
    </SectionWrapper>
  );
}
