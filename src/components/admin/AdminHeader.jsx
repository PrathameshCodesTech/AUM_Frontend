import React, { useState } from 'react';
import '../../styles/admin/AdminHeader.css';

const AdminHeader = ({ user, onLogout }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement global search logic
    console.log('Searching for:', searchQuery);
  };

  return (
    <header className="admin-header">
      <div className="header-left">
        <form className="header-search" onSubmit={handleSearch}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
            <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search users, properties, investments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>

      <div className="header-right">
        <button className="header-notification">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="currentColor" strokeWidth="2"/>
            <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span className="notification-badge">3</span>
        </button>

        <div className="header-profile" onClick={() => setShowProfileMenu(!showProfileMenu)}>
          <div className="profile-avatar">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <span className="profile-name">{user?.username}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>

          {showProfileMenu && (
            <div className="profile-menu">
              <div className="profile-menu-item">Profile Settings</div>
              <div className="profile-menu-item" onClick={onLogout}>Logout</div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;