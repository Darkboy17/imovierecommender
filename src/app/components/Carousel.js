import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import SwiperCore, { Autoplay, Navigation, Pagination, Scrollbar } from 'swiper';

// Install modules
SwiperCore.use([Autoplay, Navigation, Pagination, Scrollbar]);

const Carousel = ({ numberOfImages = 1000, initialLoad = 100 }) => {
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

  return (
    <div className="relative overflow-hidden p-4 mt-2 bg-gray-000 rounded-md shadow-md sm:mt-10 sm:ml-12 carousel">
      <h2 className="text-gray-700">List of Movies</h2>
      <Swiper
        spaceBetween={1}
        slidesPerView={5}
        pagination={{ clickable: true }}
        scrollbar={{ draggable: true }}
        breakpoints={{

          290: {

            slidesPerView: 1,

          },

          394: {

            slidesPerView: 2,

          },

          // When window width is >= 768px

          574: {

            slidesPerView: 3,

          },

          // When window width is >= 1024px

          895: {

            slidesPerView: 4,

          },
          1024: {

            slidesPerView: 3,

          },

          // When window width is >= 1280px

          1294: {

            slidesPerView: 4,

          },

          1520: {

            slidesPerView: 5,

          },

        }}
      >
        {images.map((imageUrl, index) => (
          <SwiperSlide key={index}>
            <div className="flex-none w-40 h-60 bg-gray-900 rounded-md shadow-md flex items-center justify-center">
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
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Carousel;