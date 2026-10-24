import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { SectionWrapper } from "@/components/ui/ErrorBoundary";
import { galleryService } from "@/services/index";
import type { GalleryItem } from "@/types";
import { ChevronLeft, ChevronRight, Play, Pause, X } from "lucide-react";

export default function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = React.useState(false);
  const [lightboxIndex, setLightboxIndex] = React.useState<number>(-1);
  const [isPlaying, setIsPlaying] = React.useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const itemsCountRef = useRef(0);
  itemsCountRef.current = items.length;

  const openLightbox = React.useCallback((index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
    setIsPlaying(true);
  }, []);

  const closeLightbox = React.useCallback(() => {
    setLightboxOpen(false);
    setLightboxIndex(-1);
    setIsPlaying(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const goToPrev = React.useCallback(() => {
    setLightboxIndex((prev) => (prev > 0 ? prev - 1 : itemsCountRef.current - 1));
  }, []);

  const goToNext = React.useCallback(() => {
    setLightboxIndex((prev) => (prev + 1) % itemsCountRef.current);
  }, []);

  const togglePlay = React.useCallback(() => setIsPlaying((prev) => !prev), []);

  useEffect(() => {
    const loadGallery = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await galleryService.list();
        setItems(res.data || []);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load gallery");
      } finally {
        setLoading(false);
      }
    };
    loadGallery();
  }, []);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (isPlaying && lightboxOpen && items.length > 1) {
      intervalRef.current = setInterval(() => {
        setLightboxIndex((prev) => (prev + 1) % items.length);
      }, 4000);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying, lightboxOpen, items.length]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") goToPrev();
      if (e.key === "ArrowRight") goToNext();
      if (e.key === " ") {
        e.preventDefault();
        togglePlay();
      }
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [lightboxOpen, closeLightbox, goToPrev, goToNext, togglePlay]);

  const currentItem = lightboxOpen && lightboxIndex >= 0 ? items[lightboxIndex] : null;

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
            {items.map((item, index) => (
              <button
                key={item.id}
                onClick={() => openLightbox(index)}
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

      {lightboxOpen && currentItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Image gallery slideshow"
        >
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 text-white text-sm">
            <span className="font-mono">
              {lightboxIndex + 1} / {items.length}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              goToPrev();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
            className="absolute top-6 right-20 z-10 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition-colors"
            aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </button>

          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 z-10 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition-colors"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>

          <div
            className="relative max-w-[90vw] max-h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentItem.image_url}
              alt={currentItem.alt_text || currentItem.caption || ""}
              className="max-w-full max-h-[70vh] object-contain"
            />
            {currentItem.caption && (
              <div className="mt-4 text-center text-sm text-white max-w-2xl">
                {currentItem.caption}
              </div>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition-colors"
            aria-label="Next image"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      )}
    </SectionWrapper>
  );
}
