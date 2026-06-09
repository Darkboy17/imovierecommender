"use client";

import { useEffect, useMemo, useState } from "react";

import { API_BASE_URL } from "@/app/lib/api";

type PosterBackdropProps = {
  posters: Record<string, string>;
};

export default function PosterBackdrop({ posters }: PosterBackdropProps) {
  const recommendationPosters = useMemo(
    () => Object.values(posters).filter(Boolean).slice(0, 10),
    [posters],
  );
  const [fallbackPosters, setFallbackPosters] = useState<string[]>([]);

  useEffect(() => {
    if (recommendationPosters.length > 0 || fallbackPosters.length > 0) {
      return;
    }

    let cancelled = false;

    async function loadBackdropPosters() {
      try {
        const response = await fetch(`${API_BASE_URL}/movie-posters/?limit=10&offset=36`);
        const data = (await response.json()) as string[];
        if (!cancelled) {
          setFallbackPosters(data);
        }
      } catch (error) {
        console.error("Unable to load poster backdrop:", error);
      }
    }

    loadBackdropPosters();

    return () => {
      cancelled = true;
    };
  }, [fallbackPosters.length, recommendationPosters.length]);

  const posterUrls = recommendationPosters.length > 0 ? recommendationPosters : fallbackPosters;

  if (posterUrls.length === 0) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -right-24 -top-10 grid w-[34rem] rotate-[-10deg] grid-cols-5 gap-3 opacity-[0.12] blur-[0.5px] dark:opacity-[0.16] sm:-right-16 sm:-top-14 sm:w-[44rem] sm:gap-4 lg:w-[54rem] lg:opacity-[0.14] dark:lg:opacity-[0.18]">
        {posterUrls.map((posterUrl, index) => (
          <div
            key={`${posterUrl}-${index}`}
            className={`overflow-hidden rounded-lg border border-white/20 shadow-2xl ${
              index % 2 === 0 ? "translate-y-10" : ""
            } ${index % 3 === 0 ? "scale-95" : ""}`}
          >
            <img
              src={posterUrl}
              alt=""
              className="aspect-[2/3] h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/88 to-background/48" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/35 via-transparent to-background" />
    </div>
  );
}
