import React, { useState, useEffect, useRef } from 'react';

const Settings = ({ onClose, onSave }) => {
  const options = Array.from({ length: 50 }, (_, i) => (i + 1) * 10);

  // Initialize settings state with default values
  const [settings, setSettings] = useState({ numMovies: 10, appTour: false });

  // Store initial settings for comparison
  const initialSettingsRef = useRef(settings);

  // Load settings from localStorage on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedSettings = JSON.parse(localStorage.getItem('settings'));
      if (storedSettings) {
        setSettings(storedSettings);
        initialSettingsRef.current = storedSettings;
      }
    }
  }, []);

  // Function to check if settings have changed
  const settingsChanged = () => {
    return (
      settings.numMovies !== initialSettingsRef.current.numMovies ||
      settings.appTour !== initialSettingsRef.current.appTour
    );
  };

  // Handle saving changes
  const handleSaveChanges = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('settings', JSON.stringify(settings));
    }
    initialSettingsRef.current = settings;
    if (onSave) {
      onSave(settings);
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <div
      className="z-50 fixed top-1/2 left-1/2 transform 
            -translate-x-1/2 -translate-y-1/2 bg-gray-100 p-5 w-4/5 
            max-w-md rounded-md shadow-md settings"
    >
      <div className="p-1 flex justify-between items-center mb-4">
        {/* Header Section */}
        <div className="flex items-center justify-between p-1 bg-blue-200 rounded-t w-full">
          <h2 className="text-lg font-bold">Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-red-600 focus:outline-none"
          >
            {/* Close Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="border p-4 rounded-md">
        <div className="flex justify-between items-center mb-4">
          <label htmlFor="numMovies" className="font-bold">
            Number of Movies to recommend:
          </label>
          <select
            id="numMovies"
            className="ml-2 p-3 border rounded-md w-50"
            value={settings.numMovies}
            onChange={(e) =>
              setSettings({ ...settings, numMovies: parseInt(e.target.value) })
            }
          >
            {/* Options go here */}
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-between items-center">
          <label htmlFor="appTour" className="font-bold">
            Enable App tour:
          </label>
          <input
            type="checkbox"
            id="appTour"
            className="ml-2"
            checked={settings.appTour}
            onChange={(e) =>
              setSettings({ ...settings, appTour: e.target.checked })
            }
          />
        </div>
      </div>

      {/* Conditionally render the Save Changes button */}
      {settingsChanged() && (
        <div className="text-right mt-4">
          <button
            onClick={handleSaveChanges}
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};

export default Settings;