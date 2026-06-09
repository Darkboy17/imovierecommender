"use client";

import MovieTag from "./MovieTag";
import type { RatedMovie } from "@/app/types/movie";

type MovieTagsContainerProps = {
  ratedMovies: RatedMovie[];
  onRemoveMovie: (movieId: number) => void;
};

export default function MovieTagsContainer({ ratedMovies, onRemoveMovie }: MovieTagsContainerProps) {
  return (
    <section className="movie-tags-container min-w-0">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-300">
          Your ratings
        </h2>
        <span className="rounded-md bg-ember/20 px-2 py-1 text-xs font-semibold text-copper dark:text-ember">
          {ratedMovies.length}
        </span>
      </div>
      <div className="flex max-h-32 min-w-0 flex-wrap gap-2 overflow-y-auto pr-1 sm:max-h-24">
        {ratedMovies.length > 0 ? (
          ratedMovies.map((movie) => (
            <MovieTag key={movie.movieId} movie={movie} onRemove={onRemoveMovie} />
          ))
        ) : (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Rate a few movies to tune the recommendations.</p>
        )}
      </div>
    </section>
  );
}
