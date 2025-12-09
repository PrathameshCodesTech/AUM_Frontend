import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import logoImage from '../../assets/AssetKart-1.png';
import '../../styles/admin/cp/CPHeader.css';


const CPHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const cpCode = user?.cp_profile?.cp_code || 'Loading...';

  return (
    <header className="cp-header">
      <div className="cp-header-container">
        <div className="cp-header-left">
          <Link to="/cp/dashboard" className="cp-logo-container">
            <img src={logoImage} alt="AssetKart" className="cp-logo-image" />
            <span className="cp-badge">Partner Portal</span>
          </Link>
        </div>

        <nav className="cp-nav-menu">
          <Link 
            to="/cp/dashboard" 
            className={`cp-nav-link ${location.pathname === '/cp/dashboard' ? 'active' : ''}`}
          >
            Dashboard
          </Link>
          <Link 
            to="/cp/properties" 
            className={`cp-nav-link ${location.pathname === '/cp/properties' ? 'active' : ''}`}
          >
            Properties
          </Link>
          <Link 
            to="/cp/customers" 
            className={`cp-nav-link ${location.pathname === '/cp/customers' ? 'active' : ''}`}
          >
            Customers
          </Link>
          <Link 
            to="/cp/leads" 
            className={`cp-nav-link ${location.pathname === '/cp/leads' ? 'active' : ''}`}
          >
            Leads
          </Link>
          <Link 
            to="/cp/commissions" 
            className={`cp-nav-link ${location.pathname === '/cp/commissions' ? 'active' : ''}`}
          >
            Commissions
          </Link>
          <Link to="/cp/permanent-invite">Referral Link</Link>
          <Link to="/cp/invite-signups">My Signups</Link>
        </nav>

        <div className="cp-header-right">
          

          <div className="cp-user-menu-wrapper" ref={userMenuRef}>
            <div 
              className="cp-user-menu" 
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className="cp-user-avatar">
                {user?.username?.charAt(0).toUpperCase() || 'C'}
              </div>
              <span className="cp-user-name">{user?.username || 'CP'}</span>
              <span className={`cp-user-arrow ${showUserMenu ? 'open' : ''}`}>▼</span>
            </div>

            {showUserMenu && (
              <div className="cp-user-dropdown">
                <Link to="/cp/profile" className="cp-dropdown-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
                    <path d="M6 21V19C6 16.7909 7.79086 15 10 15H14C16.2091 15 18 16.7909 18 19V21" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  My Profile
                </Link>
                
                <Link to="/cp/invites" className="cp-dropdown-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
                    <path d="M3 8L12 13L21 8" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  Send Invite
                </Link>

                <div className="cp-dropdown-divider"></div>
                
                <button className="cp-dropdown-item logout" onClick={handleLogout}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M9 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H9" stroke="currentColor" strokeWidth="2"/>
                    <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2"/>
                    <path d="M21 12H9" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default CPHeader;