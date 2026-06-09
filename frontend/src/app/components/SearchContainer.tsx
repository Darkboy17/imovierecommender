"use client";

import { useMemo, useState } from "react";
import { FaSearch, FaStar } from "react-icons/fa";

import movies from "@/app/movies.json";
import type { Movie, RatedMovie } from "@/app/types/movie";

type SearchContainerProps = {
  onRateMovie: (movie: RatedMovie) => void;
};

const movieList = movies as Movie[];

export default function SearchContainer({ onRateMovie }: SearchContainerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [hoveredMovieId, setHoveredMovieId] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState(0);

  const filteredMovies = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (term.length < 2) {
      return [];
    }

    return movieList.filter((movie) => movie.title.toLowerCase().includes(term)).slice(0, 60);
  }, [searchTerm]);

  const handleRating = (movie: Movie, rating: number) => {
    onRateMovie({ ...movie, rating });
    setSearchTerm("");
    setHoveredMovieId(null);
    setHoverRating(0);
  };

  return (
    <section className="search-container relative z-50 min-w-0">
      <div className="relative">
        <FaSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 sm:left-4" />
        <input
          type="search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="h-12 w-full rounded-lg border border-black/10 bg-white/90 pl-10 pr-3 text-sm text-zinc-950 shadow-lg outline-none transition placeholder:text-zinc-500 focus:border-ember focus:ring-4 focus:ring-ember/20 dark:border-white/10 dark:bg-zinc-950/90 dark:text-white sm:h-14 sm:pl-11 sm:pr-4 sm:text-base"
          placeholder="Search 10,000+ movies, then rate with stars"
        />
      </div>

      {filteredMovies.length > 0 && (
        <ul className="absolute left-0 right-0 top-14 z-[90] max-h-[min(20rem,calc(100dvh-10rem))] overflow-y-auto rounded-lg border border-black/10 bg-white shadow-2xl dark:border-white/10 dark:bg-zinc-950 sm:top-16">
          {filteredMovies.map((movie) => (
            <li
              key={movie.movieId}
              className="flex flex-col items-start justify-between gap-2 border-b border-black/5 px-3 py-3 last:border-b-0 hover:bg-ember/10 dark:border-white/5 min-[520px]:flex-row min-[520px]:items-center min-[520px]:gap-3 sm:px-4"
              onMouseEnter={() => setHoveredMovieId(movie.movieId)}
              onMouseLeave={() => {
                setHoveredMovieId(null);
                setHoverRating(0);
              }}
            >
              <div className="min-w-0 self-stretch min-[520px]:self-auto">
                <div className="truncate font-medium text-zinc-950 dark:text-white">{movie.title}</div>
                <div className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                  {movie.genres.replaceAll("|", " / ")}
                </div>
              </div>

              <div className="flex shrink-0 gap-1">
                {Array.from({ length: 5 }, (_, index) => {
                  const ratingValue = index + 1;
                  const active =
                    hoveredMovieId === movie.movieId && ratingValue <= hoverRating;
                  return (
                    <button
                      type="button"
                      key={ratingValue}
                      onMouseEnter={() => setHoverRating(ratingValue)}
                      onClick={() => handleRating(movie, ratingValue)}
                      className="p-1.5 text-ember transition hover:scale-110 min-[520px]:p-1"
                      aria-label={`Rate ${movie.title} ${ratingValue} stars`}
                    >
                      <FaStar className={active ? "" : "opacity-30"} />
                    </button>
                  );
                })}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
