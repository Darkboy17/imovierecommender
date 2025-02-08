import React from 'react';
import logo from '../../../public/logo/final_logo_nobg.png';
import Image from 'next/image';

const TopBar = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-12 bg-gray-800 text-white flex items-center justify-center shadow-md">
      <div className='mt-5'> {/* Adjusted margin-top to move the image down */}
        <Image
          src={logo}
          alt="Logo"
          width={100} // Adjust width as needed
          height={100} // Adjust height as needed
          style={{ objectFit: 'contain' }} // Use style prop for custom styling 
          priority
        />
      </div>
    </div>
  );
};

export default TopBar;