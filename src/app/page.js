"use client";

import { useState, useEffect } from 'react';
import TopBar from './components/TopBar';
import LeftBar from './components/LeftBar';
import SearchContainer from './components/SearchContainer';
import Carousel from './components/Carousel';
import Recommendations from './components/Recommendations';
import TourGuide from './components/TourGuide';
import Settings from './components/Settings';
import MovieTagsContainer from './components/MovieTagsContainer';
import { fetchRecommendations } from './utilities/fetchRecommendations'; // Adjust the path as necessary

const Page = () => {
  const [ratedMovies, setRatedMovies] = useState([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [runTour, setRunTour] = useState(false); // Control the tour run

  const [recommendations, setRecommendations] = useState([]);
  const [posters, setPosters] = useState({});
  const [movieCount, setMovieCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize settings state with default values
  const [settings, setSettings] = useState({ numMovies: 10, appTour: false });

  // Load settings from localStorage on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedSettings = localStorage.getItem('settings');
      if (storedSettings) {
        try {
          const parsedSettings = JSON.parse(storedSettings);
          setSettings(parsedSettings);
        } catch (error) {
          console.error('Error parsing settings from localStorage:', error);
          // Fallback to default settings if parsing fails
          setSettings({ numMovies: 10, appTour: false });
        }
      }
    }
  }, []);

  // Load ratedMovies from localStorage when the component mounts

  useEffect(() => {

    if (typeof window !== 'undefined') {

      const storedRatedMovies = localStorage.getItem('ratedMovies');

      if (storedRatedMovies) {

        try {

          const parsedRatedMovies = JSON.parse(storedRatedMovies);

          setRatedMovies(parsedRatedMovies);

        } catch (error) {

          console.error('Failed to parse ratedMovies from localStorage:', error);

          // Optionally clear localStorage if data is corrupted

          localStorage.removeItem('ratedMovies');

        }

      }

    }

  }, []);

  // Update localStorage whenever ratedMovies changes

  useEffect(() => {

    if (typeof window !== 'undefined') {

      try {

        localStorage.setItem('ratedMovies', JSON.stringify(ratedMovies));

      } catch (error) {

        console.error('Failed to save ratedMovies to localStorage:', error);

      }

    }

  }, [ratedMovies]);

  // Function to handle settings save from the Settings component
  const handleSettingsSave = (newSettings) => {
    setSettings(newSettings);
    // No need to call reloadRecommendations here because useEffect will handle it
    setIsSettingsOpen(false);
  };

  // Function to reload recommendations
  const reloadRecommendations = async () => {
    if (ratedMovies.length === 0) {
      setRecommendations([]);
      setMovieCount(0);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { recommendations: newRecommendations, posters: newPosters, recommendedMovieCount } =
        await fetchRecommendations({
          numMovies: settings.numMovies,
          ratedMovies,
        });

      setRecommendations(newRecommendations);
      setPosters(newPosters);
      setMovieCount(recommendedMovieCount);
    } catch (err) {
      setError(err.message);
      setRecommendations([]);
      setMovieCount(0);
    } finally {
      // Ensure the loading spinner is shown for at least 1 second
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  // Start the tour if appTour is enabled in settings

  useEffect(() => {

    if (settings.appTour) {

      setRunTour(true);

    }

  }, [settings.appTour]);

  // Destructure numMovies from settings for clarity and to use in dependencies

  const { numMovies } = settings;

  // Reload recommendations whenever ratedMovies or settings change
  useEffect(() => {
    reloadRecommendations();
  }, [ratedMovies, numMovies]);

  const handleAddRatedMovie = (movie) => {
    setRatedMovies((prev) => {
      const existing = prev.find((m) => m.movieId === movie.movieId);
      if (existing) {
        return prev.map((m) =>
          m.movieId === movie.movieId ? { ...m, rating: movie.rating } : m
        );
      } else {
        return [...prev, movie];
      }
    });
  };

  const handleRemoveMovie = (movieId) => {
    setRatedMovies((prev) => prev.filter((movie) => movie.movieId !== movieId));
  };

  const showSettingsDialog = () => {
    setIsSettingsOpen(true);
  };

  const closeSettingsDialog = () => {
    setIsSettingsOpen(false);
  };

  return (
    <div className="flex flex-col md:flex-row">
      {/* Include Shepherd TourGuide Component */}

      {runTour && <TourGuide isOpen={runTour} onClose={() => setRunTour(false)} />}
        
      {/* TopBar */}
      <div className="z-50 w-full md:w-auto">
        <TopBar />
      </div>

      {/* LeftBar */}
      <LeftBar onSettingsClick={showSettingsDialog} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col md: p-3 lg:p-3 md:w-full">
        <SearchContainer onRateMovie={handleAddRatedMovie} />

        {/* Container for Carousel and Recommendations */}
        <div className="flex lg:flex-row flex-col mt-0 h-full sm:mx-16 mt-10">
          {/* Carousel */}
          <div className="p-4 flex-1 flex-col lg:w-2/3 mt-0 bg-gray-100 rounded-md shadow-md">
            <MovieTagsContainer
              ratedMovies={ratedMovies}
              onRemoveMovie={handleRemoveMovie}
            />
            <Carousel />
          </div>

          {/* Recommendations */}
          <div className="lg:ml-1 flex-1 border-green-300 mt-4 lg:mt-0">
            <Recommendations
              recommendations={recommendations}
              posters={posters}
              movieCount={movieCount}
              loading={loading}
              error={error}
            />
          </div>
        </div>
      </div>

      {/* Conditionally render the Overlay and Settings Modal */}
      {isSettingsOpen && (
        <>
          {/* Overlay */}
          <div
            className={`fixed inset-0 bg-black backdrop-blur-sm z-30 transition-all duration-900 ${isSettingsOpen
              ? 'bg-opacity-80 backdrop-blur-md'
              : 'bg-opacity-0 backdrop-blur-0'
              }`}
          ></div>

          {/* Settings Modal */}
          <Settings
            onClose={closeSettingsDialog}
            onSave={handleSettingsSave}
            settings={settings}
          />
        </>
      )}
    </div>
  );
};

export default Page;