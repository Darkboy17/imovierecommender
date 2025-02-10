
export const fetchRecommendations = async ({ numMovies, ratedMovies }) => {
    
    // backend api url
    const URL = process.env.NEXT_PUBLIC_API_BASE_URL;

    console.log('API Base URL:', URL);
    
    // Assemble the watched_movies object
    const watchedMovies = {
        movies: {},
        num_movies: numMovies,
    };

    ratedMovies.forEach((movie) => {
        watchedMovies.movies[movie.movieId] = {
            movieId: movie.movieId,
            title: movie.title,
            genres: movie.genres,
            poster: 'True',
            rating: movie.rating,
        };
    });

    try {
        const response = await fetch(`${URL}/recommendations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
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
            recommendedMovieCount: data.recommended_movies
                ? data.recommended_movies.length
                : 0,
        };
    } catch (err) {
        // Re-throw the error to be handled by the calling function
        throw err;
    }
};