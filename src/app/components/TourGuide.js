import React, { useEffect } from 'react';
import Shepherd from 'shepherd.js';
import 'shepherd.js/dist/css/shepherd.css';

const TourGuide = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;

    const tour = new Shepherd.Tour({
      defaultStepOptions: {
        scrollTo: true,
        cancelIcon: {
          enabled: true
        },
        classes: 'shadow-md bg-purple-dark',
      },
      useModalOverlay: true, // Enable modal overlay

      modalOverlayOpeningPadding: 10,
    });

    tour.addStep({
      id: 'search',
      text: 'Use this search bar to find your favorite movies to rate.',
      attachTo: {
        element: '.search-container',
        on: 'bottom'
      },
      buttons: [
        {
          text: 'Next',
          action: tour.next
        }
      ]
    });

    tour.addStep({
      id: 'left-bar',
      text: 'Use this left bar to find access to developer portfolio, social media links, and settings.',
      attachTo: {
        element: '.left-bar',
        on: 'right'
      },
      buttons: [
        {
          text: 'Back',
          action: tour.back
        },
        {
          text: 'Next',
          action: tour.next
        }
      ]
    });

    tour.addStep({
      id: 'rated-movies',
      text: 'Here are the movies you have rated.',
      attachTo: {
        element: '.movie-tags-container',
        on: 'top'
      },
      buttons: [
        {
          text: 'Back',
          action: tour.back
        },
        {
          text: 'Next',
          action: tour.next
        }
      ]
    });

    tour.addStep({
      id: 'recommendations',
      text: 'Based on your ratings, recommended movies will appear here.',
      attachTo: {
        element: '.recommendations',
        on: 'left'
      },
      buttons: [
        {
          text: 'Back',
          action: tour.back
        },
        {
          text: 'Next',
          action: tour.next
        }
      ]
    });

    tour.addStep({
      id: 'carousel',
      text: 'A carousel of movies available in the database.',
      attachTo: {
        element: '.carousel',
        on: 'top'
      },
      buttons: [
        {
          text: 'Back',
          action: tour.back
        },
        {
          text: 'Finish',
          action: tour.complete
        }
      ]
    });

    tour.start();

    // Cleanup on unmount
    return () => {
      tour.cancel();
    };
  }, [isOpen]);

  return null; // Shepherd.js handles UI rendering
};

export default TourGuide;