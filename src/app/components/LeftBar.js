import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import Settings from './Settings';

const LeftBar = ({ onSettingsClick }) => {
  // State to manage the visibility of the sidebar
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="sm:left-bar">
      {/* Burger icon for mobile */}
      <button
        className="fixed top-3 left-2 z-50 text-2xl text-gray-600 sm:hidden"
        onClick={toggleSidebar}
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar */}
      <div
        className={`left-bar rounded-md fixed top-14 left-0 w-12 h-auto bg-gray-300 shadow-md flex flex-col items-center space-y-4 py-4 transition-transform transform ${isOpen ? 'translate-x-0 z-30' : '-translate-x-full'
          } sm:translate-x-0 sm:w-12`}
      >
        <a href="https://github.com/Darkboy17" target="_blank" rel="noopener noreferrer">
          <img src="icons/github.png" className="w-8 h-8 transition-transform duration-200 ease-in-out hover:scale-125" alt="Github" />
        </a>
        <a href="https://darkboy17.github.io/portfolio/" target="_blank" rel="noopener noreferrer">
          <img src="icons/briefcase.png" className="w-8 h-8 transition-transform duration-200 ease-in-out hover:scale-125" alt="Potfolio" />
        </a>
        <a href="https://www.linkedin.com/in/kordor-pyrbot/" target="_blank" rel="noopener noreferrer">
          <img src="icons/linkedin.png" className="w-8 h-8 transition-transform duration-200 ease-in-out hover:scale-125" alt="LinkedIn" />
        </a>

        <img src="icons/settings.png" onClick={onSettingsClick} className="cursor-pointer w-8 h-8 transition-transform duration-200 ease-in-out hover:scale-125 mix-blend-multiply bg-transparent" alt="Settings" title="Change app settings" />
      </div>


    </div>
  );
};

export default LeftBar;