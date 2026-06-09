"use client";

type RecommendationsProps = {
  recommendations: string[];
  posters: Record<string, string>;
  movieCount: number;
  loading: boolean;
  error: string | null;
  variant?: "full" | "sidebar";
};

export default function Recommendations({
  recommendations,
  posters,
  movieCount,
  loading,
  error,
  variant = "full",
}: RecommendationsProps) {
  const isSidebar = variant === "sidebar";
  const gridClass = isSidebar
    ? "grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3 min-[1180px]:grid-cols-1 2xl:grid-cols-2"
    : "grid grid-cols-1 gap-4 min-[460px]:grid-cols-2 lg:grid-cols-3 min-[1180px]:grid-cols-4";
  const titleClass = isSidebar
    ? "text-lg font-bold leading-tight text-zinc-950 dark:text-white min-[520px]:text-2xl"
    : "text-2xl font-bold text-zinc-950 dark:text-white sm:text-3xl";

  return (
    <section className="recommendations flex h-full min-h-0 min-w-0 flex-col">
      <div className="sticky top-0 z-10 mb-4 shrink-0 border-b border-black/10 bg-white/85 pb-3 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/85">
        <div className="flex min-w-0 items-end justify-between gap-4">
          <div className="min-w-0">
            <h2 className={titleClass}>Recommended for you</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {movieCount > 0 ? `Showing ${movieCount} movies` : "Your results will appear here"}
            </p>
          </div>
        </div>
      </div>

      <div className="min-h-0 min-w-0 flex-1 overflow-y-auto pr-1">
        {loading && (
          <div className={gridClass}>
            {Array.from({ length: isSidebar ? 8 : 8 }, (_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-lg border border-black/10 bg-white/70 shadow-lg dark:border-white/10 dark:bg-white/[0.06]"
              >
                <div className="aspect-[2/3] animate-pulse bg-gradient-to-br from-zinc-200 via-zinc-100 to-zinc-300 dark:from-zinc-800 dark:via-zinc-900 dark:to-zinc-800" />
                <div className="space-y-2 p-4">
                  <div className="h-4 w-5/6 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="grid min-h-56 place-items-center rounded-lg border border-copper/30 bg-copper/10 p-4 text-center text-sm text-copper dark:text-ember sm:min-h-72 sm:p-6">
            {error}
          </div>
        )}

        {!loading && !error && recommendations.length > 0 && (
          <div className={gridClass}>
            {recommendations.map((movieTitle) => (
              <article
                key={movieTitle}
                className="group overflow-hidden rounded-lg border border-black/10 bg-white/75 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-glow dark:border-white/10 dark:bg-white/[0.07]"
              >
                <div className="aspect-[2/3] overflow-hidden bg-zinc-900">
                  <img
                    src={posters[movieTitle]}
                    alt={movieTitle}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className={isSidebar ? "p-2.5" : "p-4"}>
                  <h3
                    className={
                      isSidebar
                        ? "line-clamp-2 min-h-9 text-xs font-semibold leading-4 text-zinc-950 dark:text-white"
                        : "line-clamp-2 min-h-12 text-base font-semibold leading-6 text-zinc-950 dark:text-white"
                    }
                  >
                    {movieTitle}
                  </h3>
                </div>
              </article>
            ))}
          </div>
        )}

        {!loading && !error && recommendations.length === 0 && (
          <div className="grid min-h-56 place-items-center rounded-lg border border-dashed border-black/15 bg-white/50 p-4 text-center dark:border-white/15 dark:bg-white/[0.03] sm:min-h-72 sm:p-6">
            <p className="max-w-sm text-sm text-zinc-600 dark:text-zinc-400">
              Add ratings above and the recommendation engine will assemble a personalized watchlist.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
