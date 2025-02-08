import React from 'react';
import MovieTag from './MovieTag';

const MovieTagsContainer = ({ ratedMovies, onRemoveMovie }) => {
  return (
    <div className="mt-0 overflow-y-auto max-h-20 flex flex-wrap border border-dashed border-gray-300 p-0 rounded-md movie-tags-container w-auto max-w-full">
      {ratedMovies.length > 0 ? (
        ratedMovies.map((movie) => (
          <MovieTag
            key={movie.movieId}
            movie={movie}
            onRemove={onRemoveMovie}
          />
        ))
      ) : (
        <p className="text-gray-500 p-2">You haven't rated any movies yet.</p>
      )}
    </div>
  );
};

export default MovieTagsContainer;