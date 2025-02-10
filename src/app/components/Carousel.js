import React, { useEffect, useRef, useState } from 'react';

const Carousel = ({ numberOfImages = 1000, initialLoad = 100 }) => {
  const carouselRef = useRef(null);
  const [scrollDirection, setScrollDirection] = useState(1);
  const [images, setImages] = useState(Array(numberOfImages).fill(null));
  const [loadedCount, setLoadedCount] = useState(0);

  const URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Function to fetch image URLs from the API
  const fetchImages = async () => {
    try {
      const response = await fetch(`${URL}/movie-posters/?limit=${numberOfImages}`);
      const imageUrls = await response.json();
      // Load images progressively
      imageUrls.forEach((url, index) => {
        const img = new Image();

        img.src = `${url}`;
        img.onload = () => {
          setImages((prevImages) => {
            const newImages = [...prevImages];
            newImages[index] = img.src;
            return newImages;
          });
          setLoadedCount((count) => count + 1);
        };
        img.onerror = () => {
          setImages((prevImages) => {
            const newImages = [...prevImages];
            newImages[index] = '/posters/default.jpg'; // Fallback image
            return newImages;
          });
          setLoadedCount((count) => count + 1);
        };
      });
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [numberOfImages]);

  // Auto-scrolling effect
  useEffect(() => {
    if (loadedCount < initialLoad) return; // Start scrolling after initial load

    const interval = setInterval(() => {
      if (carouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;

        if (scrollLeft + clientWidth >= scrollWidth && scrollDirection === 1) {
          setScrollDirection(-1);
        } else if (scrollLeft <= 0 && scrollDirection === -1) {
          setScrollDirection(1);
        }

        carouselRef.current.scrollBy({
          left: scrollDirection * 25,
          behavior: 'smooth',
        });
      }
    }, 16); // Adjust the interval as needed

    return () => clearInterval(interval);
  }, [scrollDirection, loadedCount, initialLoad]);

  // Prevent user interaction causing scroll
  useEffect(() => {
    const carousel = carouselRef.current;

    if (carousel) {
      const preventScroll = (e) => {
        e.preventDefault();
      };

      // Prevent touch and wheel events from scrolling the carousel
      carousel.addEventListener('wheel', preventScroll, { passive: false });
      carousel.addEventListener('touchmove', preventScroll, { passive: false });
      carousel.addEventListener('touchstart', preventScroll, { passive: false });

      return () => {
        carousel.removeEventListener('wheel', preventScroll);
        carousel.removeEventListener('touchmove', preventScroll);
        carousel.removeEventListener('touchstart', preventScroll);
      };
    }
  }, []);

  return (
    <div className="relative overflow-hidden p-4 mt-2 bg-gray-000 rounded-md shadow-md sm:mt-10 sm:ml-12 carousel">
      <h2 className="text-gray-700">List of Movies</h2>
      <div
        ref={carouselRef}
        className="flex space-x-4 mt-4 scrollbar-hide"
        style={{ overflowX: 'hidden', touchAction: 'none' }}
      >
        {images.map((imageUrl, index) => (
          <div
            key={index}
            className="flex-none w-40 h-60 bg-gray-900 rounded-md shadow-md flex items-center justify-center"
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={`Movie ${index + 1}`}
                className="w-full h-full object-cover rounded-md"
              />
            ) : (
              <div className="animate-pulse w-full h-full bg-gray-700 rounded-md flex items-center justify-center">
                <div className="text-white">Loading...</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Carousel;