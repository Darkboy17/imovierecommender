export type Movie = {
  movieId: number;
  title: string;
  genres: string;
  poster?: string;
};

export type RatedMovie = Movie & {
  rating: number;
};

export type SettingsState = {
  numMovies: number;
};

export type RecommendationPayload = {
  recommendations: string[];
  posters: Record<string, string>;
  recommendedMovieCount: number;
};
