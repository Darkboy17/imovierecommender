import React from 'react';

const Recommendations = ({ recommendations, posters, movieCount, loading, error }) => {
  return (
    <div className="lg:mx-3 sm:mt-5 md:mt-5 lg:mt-0 bg-gray-100 rounded-md shadow-md w-full round-md border-pink-200 recommendations">
      <h2 className="text-gray-700 text-center bg-yellow-500 shadow-md w-full p-4 rounded-md">
        Movie recommendations based on your past ratings
      </h2>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col justify-center items-center h-96">
          <div
            className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-md text-blue-500"
            role="status"
          ></div>
          <p className="ml-2">Loading recommendations...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex justify-center items-center h-96">
          <p className="text-red-500">Error: {error}</p>
        </div>
      )}

      {/* Recommendations List */}
      {!loading && !error && recommendations.length > 0 && (
        <div className="flex flex-wrap justify-center h-96 overflow-y-auto mt-4">
          {recommendations.map((movieTitle, index) => {
            const posterSrc = posters[movieTitle];

            return (
              <div
                key={index}
                className="w-40 bg-gray-300 rounded-md shadow-md m-2 overflow-hidden flex flex-col items-center"
              >
                <img
                  src={posterSrc}
                  alt={movieTitle}
                  className="w-full h-60 object-cover"
                />
                <div className="p-0 justify-center items-center text-center">
                  <span className="text-gray-700 text-sm font-bold">
                    {movieTitle}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* No Recommendations */}
      {!loading && !error && recommendations.length === 0 && (
        <div className="flex justify-center items-center h-96 mt-4">
          <p>No recommendations available.</p>
        </div>
      )}

      {/* Movie Count */}
      <div className="flex justify-start ml-5 mt-3 p-3">
        <div className="text-gray-700 font-bold">
          {!loading && movieCount > 0 && `Showing ${movieCount} Movies`}
        </div>
      </div>
    </div>
  );
};

export default Recommendations;