import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Sidebar from '../components/Sidebar';
import PropertyCard from '../components/PropertyCard';
import '../styles/Wishlist.css';

const Wishlist = () => {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load wishlist from localStorage
    loadWishlist();
  }, []);

  const loadWishlist = () => {
    setLoading(true);
    try {
      const savedWishlist = localStorage.getItem('wishlist');
      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
      }
    } catch (error) {
      console.error('Error loading wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = (propertyId) => {
    const updatedWishlist = wishlist.filter(item => item.id !== propertyId);
    setWishlist(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    toast.success('Removed from wishlist');
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all items from wishlist?')) {
      setWishlist([]);
      localStorage.removeItem('wishlist');
      toast.success('Wishlist cleared');
    }
  };

  if (loading) {
    return (
      <div className="wishlist-page">
        <Sidebar />
        <main className="wishlist-main">
          <div className="loading-state">
            <div className="loading-spinner">Loading wishlist...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <Sidebar />
      
      <main className="wishlist-main">
        <div className="wishlist-header">
          <div>
            <h1>My Wishlist</h1>
            <p className="wishlist-subtitle">
              {wishlist.length} {wishlist.length === 1 ? 'property' : 'properties'} saved
            </p>
          </div>
          {wishlist.length > 0 && (
            <button className="btn-clear-all" onClick={handleClearAll}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Clear All
            </button>
          )}
        </div>

        <div className="wishlist-content">
          {wishlist.length === 0 ? (
            <div className="empty-wishlist">
              <svg className="empty-icon" width="120" height="120" viewBox="0 0 24 24" fill="none">
                <path d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.57831 8.50903 2.99871 7.05 2.99871C5.59096 2.99871 4.19169 3.57831 3.16 4.61C2.1283 5.64169 1.54871 7.04097 1.54871 8.5C1.54871 9.95903 2.1283 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.351 11.8792 21.7564 11.2728 22.0329 10.6054C22.3095 9.93789 22.4518 9.22248 22.4518 8.5C22.4518 7.77752 22.3095 7.06211 22.0329 6.39464C21.7564 5.72718 21.351 5.12075 20.84 4.61V4.61Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <h2>Your Wishlist is Empty</h2>
              <p>Save properties you like to find them easily later</p>
              <button className="btn-browse-properties" onClick={() => navigate('/properties')}>
                Browse Properties
              </button>
            </div>
          ) : (
            <div className="wishlist-grid">
              {wishlist.map((property) => (
                <div key={property.id} className="wishlist-item">
                  <button 
                    className="remove-wishlist-btn"
                    onClick={() => handleRemoveFromWishlist(property.id)}
                    title="Remove from wishlist"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <PropertyCard property={property} />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Wishlist;