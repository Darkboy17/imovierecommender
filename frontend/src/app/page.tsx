"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Carousel from "@/app/components/Carousel";
import LeftBar from "@/app/components/LeftBar";
import MovieTagsContainer from "@/app/components/MovieTagsContainer";
import PosterBackdrop from "@/app/components/PosterBackdrop";
import Recommendations from "@/app/components/Recommendations";
import SearchContainer from "@/app/components/SearchContainer";
import Settings from "@/app/components/Settings";
import TopBar from "@/app/components/TopBar";
import TourGuide from "@/app/components/TourGuide";
import { useAuth } from "@/app/contexts/auth-context";
import type { RatedMovie, SettingsState } from "@/app/types/movie";
import { fetchRecommendations } from "@/app/utilities/fetchRecommendations";

const defaultSettings: SettingsState = {
  numMovies: 20,
};

export default function Page() {
  const router = useRouter();
  const { user, loading: authLoading, apiFetch } = useAuth();
  const [ratedMovies, setRatedMovies] = useState<RatedMovie[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [tourRunId, setTourRunId] = useState(0);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [posters, setPosters] = useState<Record<string, string>>({});
  const [movieCount, setMovieCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/auth");
    }
  }, [authLoading, router, user]);

  useEffect(() => {
    const storedSettings = localStorage.getItem("settings");
    const storedRatedMovies = localStorage.getItem("ratedMovies");

    if (storedSettings) {
      try {
        const parsed = JSON.parse(storedSettings) as Partial<SettingsState>;
        setSettings({
          numMovies: parsed.numMovies || defaultSettings.numMovies,
        });
      } catch {
        localStorage.removeItem("settings");
      }
    }

    if (storedRatedMovies) {
      try {
        setRatedMovies(JSON.parse(storedRatedMovies) as RatedMovie[]);
      } catch {
        localStorage.removeItem("ratedMovies");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("ratedMovies", JSON.stringify(ratedMovies));
  }, [ratedMovies]);

  const reloadRecommendations = useCallback(async () => {
    if (!user || ratedMovies.length === 0) {
      setRecommendations([]);
      setMovieCount(0);
      setPosters({});
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const {
        recommendations: newRecommendations,
        posters: newPosters,
        recommendedMovieCount,
      } = await fetchRecommendations({
        numMovies: settings.numMovies,
        ratedMovies,
        apiFetch,
      });

      setRecommendations(newRecommendations);
      setPosters(newPosters);
      setMovieCount(recommendedMovieCount);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load recommendations");
      setRecommendations([]);
      setMovieCount(0);
      setPosters({});
    } finally {
      setLoading(false);
    }
  }, [apiFetch, ratedMovies, settings.numMovies, user]);

  useEffect(() => {
    reloadRecommendations();
  }, [reloadRecommendations]);

  const handleAddRatedMovie = (movie: RatedMovie) => {
    setRatedMovies((prev) => {
      const existing = prev.find((item) => item.movieId === movie.movieId);
      if (existing) {
        return prev.map((item) => (item.movieId === movie.movieId ? movie : item));
      }
      return [movie, ...prev];
    });
  };

  const handleSettingsSave = (newSettings: SettingsState) => {
    setSettings(newSettings);
    setIsSettingsOpen(false);
  };

  const startTour = () => {
    setTourRunId((current) => current + 1);
  };

  const handleTourClose = useCallback(() => undefined, []);

  if (authLoading || !user) {
    return (
      <main className="grid min-h-dvh place-items-center px-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-ember/30 border-t-ember" />
      </main>
    );
  }

  return (
    <main className="min-h-dvh overflow-x-hidden bg-background min-[1180px]:h-dvh min-[1180px]:overflow-hidden">
      <TopBar onSettingsClick={() => setIsSettingsOpen(true)} onTourClick={startTour} />
      <LeftBar />
      <TourGuide runId={tourRunId} onClose={handleTourClose} />

      <section className="relative flex min-h-dvh flex-col overflow-visible pt-[4.5rem] sm:pt-16 min-[1180px]:h-full min-[1180px]:min-h-0 min-[1180px]:overflow-hidden">
        <PosterBackdrop posters={posters} />
        <div className="absolute inset-0 bg-gradient-to-b from-background/55 via-background/88 to-background" />

        <div className="relative z-10 grid w-full gap-3 px-3 py-3 sm:gap-4 sm:px-4 md:pl-24 md:pr-6 min-[1180px]:min-h-0 min-[1180px]:flex-1 min-[1180px]:grid-rows-[auto_minmax(0,1fr)]">
          <section className="relative z-30 min-w-0 overflow-visible rounded-lg border border-black/10 bg-white/60 p-3 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.05] sm:p-4">
            <div className="grid min-w-0 gap-3 sm:gap-4 lg:grid-cols-[minmax(14rem,0.72fr)_minmax(0,1.28fr)]">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-copper dark:text-ember">
                  Cinema Console
                </p>
                <h1 className="mt-1 text-xl font-black leading-tight text-zinc-950 dark:text-white sm:text-2xl lg:text-3xl">
                  Everything in command.
                </h1>
                <p className="mt-1 text-xs leading-5 text-zinc-700 dark:text-zinc-300 sm:text-sm sm:leading-6">
                  Search, ratings, library, and picks arranged as one full-screen console.
                </p>
              </div>
              <div className="relative z-[70] min-w-0">
                <SearchContainer onRateMovie={handleAddRatedMovie} />
              </div>
            </div>

            <div className="mt-3 min-w-0">
              <MovieTagsContainer
                ratedMovies={ratedMovies}
                onRemoveMovie={(movieId) =>
                  setRatedMovies((prev) => prev.filter((movie) => movie.movieId !== movieId))
                }
              />
            </div>
          </section>

          <section className="relative z-10 grid min-w-0 gap-3 sm:gap-4 min-[1180px]:min-h-0 min-[1180px]:grid-cols-[minmax(0,1.38fr)_minmax(22rem,0.62fr)] min-[1180px]:grid-rows-none 2xl:grid-cols-[minmax(0,1.38fr)_minmax(27rem,0.62fr)]">
            <div className="min-h-[18rem] min-w-0 rounded-lg border border-black/10 bg-white/60 p-3 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.05] sm:min-h-[20rem] sm:p-4 min-[1180px]:h-full min-[1180px]:min-h-0">
              <Carousel
                numberOfImages={30}
                compact
                title="Explore the library"
                description="Browse posters and rate familiar movies."
              />
            </div>

            <aside className="h-[min(38rem,78dvh)] min-h-[24rem] min-w-0 overflow-hidden rounded-lg border border-black/10 bg-white/65 p-3 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06] sm:h-[32rem] sm:min-h-[26rem] sm:p-4 min-[1180px]:h-full min-[1180px]:max-h-none min-[1180px]:min-h-0">
              <Recommendations
                recommendations={recommendations}
                posters={posters}
                movieCount={movieCount}
                loading={loading}
                error={error}
                variant="sidebar"
              />
            </aside>
          </section>
        </div>
      </section>

      {isSettingsOpen && (
        <Settings
          onClose={() => setIsSettingsOpen(false)}
          onSave={handleSettingsSave}
          settings={settings}
        />
      )}
    </main>
  );
}
