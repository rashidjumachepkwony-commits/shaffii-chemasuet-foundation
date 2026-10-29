import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { SectionWrapper } from "@/components/ui/ErrorBoundary";
import { galleryService } from "@/services/index";
import type { GalleryItem } from "@/types";
import { ChevronLeft, ChevronRight, Play, Pause, X, Film, Image } from "lucide-react";

const VIDEO_EXTENSIONS = [".mp4", ".webm", ".mov", ".avi", ".wmv", ".mkv", ".flv"];

function inferMediaType(url: string): "image" | "video" {
  const lower = url.toLowerCase();
  for (const ext of VIDEO_EXTENSIONS) {
    if (lower.endsWith(ext) || lower.includes(ext + "?")) {
      return "video";
    }
  }
  return "image";
}

function isVideoItem(item: GalleryItem | null): boolean {
  if (!item) return false;
  return item.media_type === "video" || inferMediaType(item.image_url) === "video";
}

function MediaItem({ item, onClick, index }: { item: GalleryItem; onClick: () => void; index: number }) {
  const isVideo = isVideoItem(item);
  return (
    <button
      key={item.id}
      onClick={onClick}
      className="group relative block overflow-hidden rounded-xl bg-neutral-100"
    >
      <div className="relative w-full aspect-video overflow-hidden">
        {isVideo ? (
          <video
            src={item.image_url}
            poster={item.thumbnail_url || undefined}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            muted
            preload="auto"
            controls
            playsInline
            onError={(e) => {
              console.error('Video failed to load:', item.image_url, e);
              e.currentTarget.style.display = 'none';
              // Show fallback
              const fallback = e.currentTarget.parentElement?.querySelector('.video-fallback');
              if (fallback) (fallback as HTMLElement).style.display = 'flex';
            }}
          />
        ) : (
          <img
            src={item.image_url}
            alt={item.alt_text || item.caption || ""}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        )}
        {isVideo && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white transition-transform group-hover:scale-110">
              <Play className="h-8 w-8 ml-1" />
            </div>
          </div>
        )}
        <div className="video-fallback absolute inset-0 flex items-center justify-center bg-neutral-200 hidden">
          <div className="text-center p-4">
            <Film className="mx-auto h-12 w-12 text-neutral-400 mb-2" />
            <p className="text-neutral-600 text-sm">Video unavailable</p>
            <p className="text-neutral-500 text-xs">{item.caption}</p>
          </div>
        </div>
      </div>
      {item.caption && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100">
          <span className="text-sm text-white">{item.caption}</span>
        </div>
      )}
      {!isVideo && (
        <div className="absolute top-3 right-3 opacity-0 transition-opacity group-hover:opacity-100">
          <span className="px-2 py-1 text-xs bg-white/90 backdrop-blur rounded-full text-neutral-700 flex items-center gap-1">
            <Image className="h-3 w-3" />
            Photo
          </span>
        </div>
      )}
      {isVideo && (
        <div className="absolute top-3 right-3 opacity-0 transition-opacity group-hover:opacity-100">
          <span className="px-2 py-1 text-xs bg-white/90 backdrop-blur rounded-full text-neutral-700 flex items-center gap-1">
            <Film className="h-3 w-3" />
            Video
          </span>
        </div>
      )}
    </button>
  );
}

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

  const currentItem = lightboxOpen && lightboxIndex >= 0 ? items[lightboxIndex] : null;
  const videos = items.filter(isVideoItem);
  const images = items.filter(item => !isVideoItem(item));

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
    if (isPlaying && lightboxOpen && items.length > 1 && !isVideoItem(currentItem)) {
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
  }, [isPlaying, lightboxOpen, items.length, currentItem]);

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

  return (
    <SectionWrapper spacing="lg">
      <div className="mb-12 text-center">
        <h1 className="font-display text-4xl font-bold text-neutral-900 sm:text-5xl">
          Gallery
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
          <p className="text-neutral-500">No gallery items available yet.</p>
        </div>
      ) : (
        <>
          {videos.length > 0 && (
            <section className="mb-16">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl font-bold text-neutral-900 flex items-center gap-2">
                  <Film className="h-6 w-6 text-[#D9A10B]" />
                  Featured Videos
                </h2>
                <span className="px-3 py-1 text-sm bg-[#D9A10B]/10 text-[#D9A10B] rounded-full">
                  {videos.length} video{videos.length > 1 ? 's' : ''}
                </span>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {videos.map((video, idx) => (
                  <MediaItem
                    key={video.id}
                    item={video}
                    onClick={() => openLightbox(items.indexOf(video))}
                    index={idx}
                  />
                ))}
              </div>
            </section>
          )}

          {images.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl font-bold text-neutral-900 flex items-center gap-2">
                  <Image className="h-6 w-6 text-[#D9A10B]" />
                  Photo Gallery
                </h2>
                <span className="px-3 py-1 text-sm bg-[#D9A10B]/10 text-[#D9A10B] rounded-full">
                  {images.length} photo{images.length > 1 ? 's' : ''}
                </span>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {images.map((image) => (
                  <MediaItem
                    key={image.id}
                    item={image}
                    onClick={() => openLightbox(items.indexOf(image))}
                    index={0}
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {lightboxOpen && currentItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Gallery slideshow"
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
            aria-label="Previous"
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
            {isVideoItem(currentItem) ? (
              <video
                src={currentItem.image_url}
                poster={currentItem.thumbnail_url || undefined}
                className="max-w-full max-h-[70vh] object-contain"
                controls
                autoPlay
                muted
                playsInline
              />
            ) : (
              <img
                src={currentItem.image_url}
                alt={currentItem.alt_text || currentItem.caption || ""}
                className="max-w-full max-h-[70vh] object-contain"
              />
            )}
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
            aria-label="Next"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      )}
    </SectionWrapper>
  );
}