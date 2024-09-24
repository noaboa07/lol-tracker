import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SlideMenu.css'; // Import the CSS file for styling

const SlideMenu = () => {
  const [isOpen, setIsOpen] = useState(false); // State to control menu visibility
  const navigate = useNavigate(); // React Router hook to navigate

  const toggleMenu = () => {
    setIsOpen(!isOpen); // Toggle menu open/closed
  };

  return (
    <div className={`slide-menu ${isOpen ? 'open' : ''}`} onMouseEnter={toggleMenu} onMouseLeave={toggleMenu}>
      <div className="menu-content">
        <button onClick={() => navigate('/')}>Home</button>
        {/* Add more buttons for different pages here */}
        <button onClick={() => navigate('/profile')}>Profile</button>
        <button onClick={() => navigate('/about')}>About</button>
      </div>
    </div>
  );
};

export default SlideMenu;