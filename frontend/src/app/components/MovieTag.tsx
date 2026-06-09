"use client";

import { FaStar, FaTimes } from "react-icons/fa";

import type { RatedMovie } from "@/app/types/movie";

type MovieTagProps = {
  movie: RatedMovie;
  onRemove: (movieId: number) => void;
};

export default function MovieTag({ movie, onRemove }: MovieTagProps) {
  return (
    <div className="flex max-w-full items-center gap-2 rounded-md border border-black/10 bg-white/80 px-2.5 py-2 text-sm shadow-sm dark:border-white/10 dark:bg-white/10 sm:px-3">
      <span className="max-w-[min(12rem,calc(100vw-9rem))] truncate font-medium text-zinc-900 dark:text-white sm:max-w-44">{movie.title}</span>
      <span className="flex shrink-0 text-ember">
        {Array.from({ length: 5 }, (_, index) => (
          <FaStar key={index} size={12} className={index < movie.rating ? "" : "opacity-25"} />
        ))}
      </span>
      <button
        type="button"
        onClick={() => onRemove(movie.movieId)}
        className="grid h-6 w-6 shrink-0 place-items-center rounded-md text-zinc-500 transition hover:bg-copper hover:text-white"
        aria-label={`Remove ${movie.title}`}
        title="Remove"
      >
        <FaTimes size={12} />
      </button>
    </div>
  );
}
