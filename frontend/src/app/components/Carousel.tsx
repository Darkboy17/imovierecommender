"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

import { API_BASE_URL } from "@/app/lib/api";

type CarouselProps = {
  numberOfImages?: number;
  compact?: boolean;
  initialOffset?: number;
  title?: string;
  description?: string;
};

const PAGE_SIZE = 18;
const posterTrackClass =
  "grid h-full min-h-[13rem] grid-flow-col auto-cols-[clamp(7.25rem,58vw,10rem)] gap-3 min-[420px]:auto-cols-[clamp(8rem,42vw,11rem)] sm:min-h-[14rem] sm:auto-cols-[clamp(8.75rem,27vw,12rem)] md:auto-cols-[clamp(9.5rem,20vw,13rem)] lg:auto-cols-[clamp(10rem,15vw,13.5rem)] min-[1180px]:auto-cols-[clamp(8.5rem,10vw,12rem)]";

export default function Carousel({
  numberOfImages = 30,
  compact = false,
  initialOffset = 0,
  title = "Explore the library",
  description = "A quick look at movies available to rate.",
}: CarouselProps) {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const offsetRef = useRef(0);
  const loadingRef = useRef(false);
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const loadImages = useCallback(
    async ({ reset = false }: { reset?: boolean } = {}) => {
      if (loadingRef.current) {
        return;
      }

      const offset = reset ? initialOffset : offsetRef.current;
      const limit = reset ? numberOfImages : PAGE_SIZE;
      loadingRef.current = true;
      setLoading(reset);
      setLoadingMore(!reset);

      try {
        const response = await fetch(
          `${API_BASE_URL}/movie-posters/?limit=${limit}&offset=${offset}`,
        );
        const imageUrls = (await response.json()) as string[];

        setImages((currentImages) => {
          const nextImages = reset ? imageUrls : [...currentImages, ...imageUrls];
          return Array.from(new Set(nextImages));
        });
        offsetRef.current = offset + imageUrls.length;
        setHasMore(imageUrls.length === limit);
      } catch (error) {
        console.error("Error fetching images:", error);
      } finally {
        loadingRef.current = false;
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [initialOffset, numberOfImages],
  );

  useEffect(() => {
    offsetRef.current = initialOffset;
    setHasMore(true);
    loadImages({ reset: true });
  }, [initialOffset, loadImages]);

  const maybeLoadMore = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller || !hasMore || loadingRef.current) {
      return;
    }

    const remaining = scroller.scrollWidth - scroller.scrollLeft - scroller.clientWidth;
    if (remaining < scroller.clientWidth * 0.8) {
      loadImages();
    }
  }, [hasMore, loadImages]);

  const scrollShelf = (direction: -1 | 1) => {
    const scroller = scrollerRef.current;
    if (!scroller) {
      return;
    }

    scroller.scrollBy({
      left: direction * scroller.clientWidth * 0.85,
      behavior: "smooth",
    });
  };

  return (
    <section className="carousel flex h-full min-h-[16rem] min-w-0 flex-col sm:min-h-[18rem] min-[1180px]:min-h-0">
      <div className="mb-3 flex shrink-0 items-start justify-between gap-3 sm:mb-4 sm:items-end">
        <div className="min-w-0">
          <h2
            className={
              compact
                ? "line-clamp-2 text-lg font-bold leading-tight text-zinc-950 dark:text-white sm:truncate sm:text-2xl"
                : "text-3xl font-bold text-zinc-950 dark:text-white"
            }
          >
            {title}
          </h2>
          <p className="line-clamp-2 text-xs text-zinc-600 dark:text-zinc-400 sm:truncate sm:text-sm">
            {description}
          </p>
        </div>

        {!loading && images.length > 0 && (
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => scrollShelf(-1)}
              className="grid h-9 w-9 place-items-center rounded-md border border-black/10 bg-white/75 text-zinc-700 shadow-sm transition hover:border-ember hover:text-copper dark:border-white/10 dark:bg-white/10 dark:text-zinc-200"
              aria-label="Scroll posters left"
              title="Scroll left"
            >
              <FaChevronLeft />
            </button>
            <button
              type="button"
              onClick={() => scrollShelf(1)}
              className="grid h-9 w-9 place-items-center rounded-md border border-black/10 bg-white/75 text-zinc-700 shadow-sm transition hover:border-ember hover:text-copper dark:border-white/10 dark:bg-white/10 dark:text-zinc-200"
              aria-label="Scroll posters right"
              title="Scroll right"
            >
              <FaChevronRight />
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="poster-shelf min-h-0 flex-1 overflow-hidden">
          <div className={posterTrackClass}>
            {Array.from({ length: 10 }, (_, index) => (
              <div
                key={index}
                className="h-full overflow-hidden rounded-lg border border-black/10 bg-white/70 shadow-lg dark:border-white/10 dark:bg-white/[0.06]"
              >
                <div className="h-full animate-pulse bg-gradient-to-br from-zinc-200 via-zinc-100 to-zinc-300 dark:from-zinc-800 dark:via-zinc-900 dark:to-zinc-800" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div
          ref={scrollerRef}
          onScroll={maybeLoadMore}
          className="poster-shelf min-h-0 flex-1 overflow-x-auto overflow-y-hidden pb-3"
        >
          <div className={posterTrackClass}>
            {images.map((imageUrl, index) => (
              <article
                key={imageUrl || index}
                className="poster-card group h-full overflow-hidden rounded-lg border border-black/10 bg-white/70 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-glow dark:border-white/10 dark:bg-white/[0.06]"
              >
                <div className="h-full overflow-hidden bg-zinc-900">
                  <img
                    src={imageUrl}
                    alt={`Movie poster ${index + 1}`}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
              </article>
            ))}

            {loadingMore &&
              Array.from({ length: 4 }, (_, index) => (
                <div
                  key={`loading-more-${index}`}
                  className="h-full overflow-hidden rounded-lg border border-black/10 bg-white/70 shadow-lg dark:border-white/10 dark:bg-white/[0.06]"
                >
                  <div className="h-full animate-pulse bg-gradient-to-br from-zinc-200 via-zinc-100 to-zinc-300 dark:from-zinc-800 dark:via-zinc-900 dark:to-zinc-800" />
                </div>
              ))}
          </div>
        </div>
      )}
    </section>
  );
}
