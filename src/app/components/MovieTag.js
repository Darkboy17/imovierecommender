import React from 'react';
import { FaStar, FaTimes } from 'react-icons/fa';

const MovieTag = ({ movie, onRemove, size = 1 }) => {
  // Base sizes
  const basePaddingX = 8; // Horizontal padding in px
  const basePaddingY = 3; // Vertical padding in px
  const baseFontSize = 14; // Font size in px
  const baseIconSize = 12; // Icon size in px
  const baseMargin = 4; // Margin in px

  // Scaled sizes
  const paddingX = basePaddingX * size;
  const paddingY = basePaddingY * size;
  const fontSize = baseFontSize * size;
  const iconSize = baseIconSize * size;
  const margin = baseMargin * size;

  return (
    <div
      className="flex items-center bg-gray-200 rounded-full"
      style={{
        padding: `${paddingY}px ${paddingX}px`,
        margin: `${margin}px`,
      }}
    >
      <span
        className="mr-1 text-gray-800 truncate"
        style={{
          fontSize: `${fontSize}px`,
          maxWidth: `${100 * size}%`, // Adjust width based on size if needed
        }}
      >
        {movie.title}
      </span>
      <div className="flex items-center">
        {[...Array(5)].map((_, index) => (
          <FaStar
            key={index}
            size={iconSize}
            className="mr-0.5"
            color={index < movie.rating ? '#ffc107' : '#e4e5e9'}
          />
        ))}
      </div>
      <button
        className="ml-1 text-gray-400 hover:text-red-600 focus:outline-none"
        onClick={() => onRemove(movie.movieId)}
        aria-label="Remove movie"
        style={{
          fontSize: `${iconSize}px`, // Ensure the button scales as well
        }}
      >
        <FaTimes size={iconSize} />
      </button>
    </div>
  );
};

export default MovieTag;