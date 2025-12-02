import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                INVEST IN <span className="gradient-text">REAL ESTATE</span>
              </h1>
              <h2 className="hero-subtitle">START AS LOW AS ₹5,000</h2>
              <p className="hero-description">
                At AssetKart, we are obsessed with bringing quality investment opportunities to
                everyone. We have broken the access barrier and brought this down, so everyone
                can digitally invest in quality Real Estate.
              </p>
              <p className="hero-hashtag">#ItsPossibleNow</p>
              
              <div className="cta-button-wrapper" onClick={handleLoginClick}>
                <div className="cta-button">
                  <span className="cta-login">LOGIN</span>
                  <span className="cta-signup">SIGNUP</span>
                </div>
                <p className="cta-tagline">VALUE & VOLUME</p>
              </div>
            </div>
            
            <div className="hero-image">
              <div className="building-grid">
                <div className="grid-item">
                  <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=600&fit=crop" alt="Building 1" />
                </div>
                <div className="grid-item">
                  <img src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=600&fit=crop" alt="Building 2" />
                </div>
                <div className="grid-item">
                  <img src="https://images.unsplash.com/photo-1577495508048-b635879837f1?w=400&h=600&fit=crop" alt="Building 3" />
                </div>
                <div className="grid-item">
                  <img src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400&h=600&fit=crop" alt="Building 4" />
                </div>
                <div className="grid-item">
                  <img src="https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?w=400&h=600&fit=crop" alt="Building 5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <h2 className="section-title">Why Choose AssetKart?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Secure Investment</h3>
              <p>All investments backed by legal documentation and blockchain technology</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3>Low Entry Barrier</h3>
              <p>Start investing in premium properties with as low as ₹5,000</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <path d="M3 3V18C3 18.5304 3.21071 19.0391 3.58579 19.4142C3.96086 19.7893 4.46957 20 5 20H21" stroke="currentColor" strokeWidth="2"/>
                  <path d="M7 14L12 9L16 13L21 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3>High Returns</h3>
              <p>Earn rental income and capital appreciation from your investments</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Easy Exit</h3>
              <p>Sell your property tokens anytime through our secondary market</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;