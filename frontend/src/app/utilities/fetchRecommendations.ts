import type { RatedMovie, RecommendationPayload } from "@/app/types/movie";

type FetchRecommendationsArgs = {
  numMovies: number;
  ratedMovies: RatedMovie[];
  apiFetch: (path: string, init?: RequestInit) => Promise<Response>;
};

export async function fetchRecommendations({
  numMovies,
  ratedMovies,
  apiFetch,
}: FetchRecommendationsArgs): Promise<RecommendationPayload> {
  const watchedMovies = {
    movies: ratedMovies.reduce<Record<number, Pick<RatedMovie, "title" | "rating">>>(
      (acc, movie) => {
        acc[movie.movieId] = {
          title: movie.title,
          rating: movie.rating,
        };
        return acc;
      },
      {},
    ),
    num_movies: numMovies,
  };

  const response = await apiFetch("/recommendations/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(watchedMovies),
  });

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();

  return {
    recommendations: data.recommended_movies || [],
    posters: data.posters || {},
    recommendedMovieCount: data.recommended_movies ? data.recommended_movies.length : 0,
  };
}
