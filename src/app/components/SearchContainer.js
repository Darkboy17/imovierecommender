import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa'; // Install react-icons if you haven't

import movies from '../../app/movies.json'; // Adjust the path as necessary

import MovieTag from './MovieTag'; // We'll create this component next


const SearchContainer = ({ onRateMovie }) => {

  const [searchTerm, setSearchTerm] = useState('');

  const [filteredMovies, setFilteredMovies] = useState([]);

  const [hoveredMovieId, setHoveredMovieId] = useState(null);

  const [hoverRating, setHoverRating] = useState(0);


  const handleSearchChange = (event) => {

    const value = event.target.value;

    setSearchTerm(value);


    if (value) {

      const filtered = movies.filter((movie) =>

        movie.title.toLowerCase().includes(value.toLowerCase())

      );

      setFilteredMovies(filtered);

    } else {

      setFilteredMovies([]);

    }

  };

  const handleMouseEnter = (movieId) => {

    setHoveredMovieId(movieId);
    setHoverRating(0); // Reset hover rating when entering a new movie
  };


  const handleMouseLeave = () => {

    setHoveredMovieId(null);
    setHoverRating(0); // Reset hover rating when leaving the movie
  };

  const handleRating = (movie, rating) => {
    // Pass the rated movie to the parent component
    onRateMovie({ ...movie, rating });

    // Clear search input and filtered list
    setSearchTerm('');
    setFilteredMovies([]);
  };



  return (
    <div className="relative z-10 top-8 p-4 sm:mt-0 sm:ml-12 search-container">
      <input

        type="search"

        id="search"

        name="search"

        value={searchTerm}

        onChange={handleSearchChange}

        className="w-full p-4 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"

        placeholder="Search from a list of 10,000+ movies to rate them..."

      />

      {filteredMovies.length > 0 && (

        <ul className="absolute left-0 right-0 bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-y-auto">

          {filteredMovies.map((movie) => (

            <li

              key={movie.movieId}

              className="p-2 hover:bg-gray-200 cursor-pointer relative"

              onMouseEnter={() => handleMouseEnter(movie.movieId)}

              onMouseLeave={handleMouseLeave}

            >

              <div className="flex justify-between items-center">

                <span>{movie.title}</span>

                {hoveredMovieId === movie.movieId && (
                  <div className="flex ml-2">
                    {[...Array(5)].map((_, index) => {
                      const ratingValue = index + 1;
                      return (
                        <FaStar
                          key={index}
                          className="cursor-pointer transition-colors"
                          size={20}
                          color={ratingValue <= hoverRating ? '#ffc107' : 'rgb(255, 248, 226)'}
                          onMouseEnter={() => setHoverRating(ratingValue)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => handleRating(movie, ratingValue)}
                        />
                      );
                    })}
                  </div>
                )}

              </div>

            </li>

          ))}

        </ul>

      )}
    </div>
  );
};

export default SearchContainer;