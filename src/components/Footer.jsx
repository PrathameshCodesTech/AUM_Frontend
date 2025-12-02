import React from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/Footer.css';

const Footer = () => {
  const location = useLocation();

  // Don't show footer on login page and most protected pages
  // Only show on specific pages if needed
  const hideFooterPaths = [
    '/login',
    '/dashboard', 
    '/portfolio',
    '/properties',
    '/wallet',
    '/wishlist'
  ];

  if (hideFooterPaths.some(path => location.pathname.startsWith(path))) {
    return null;
  }

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <p className="footer-copyright">
            Copyright © AssetKart, 2025
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;