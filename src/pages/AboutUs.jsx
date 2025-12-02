import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/AboutUs.css';

const AboutUs = () => {
  const renderIcon = (iconName) => {
    const icons = {
      mission: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="2"/>
          <circle cx="12" cy="12" r="2" fill="currentColor"/>
        </svg>
      ),
      vision: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
          <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      values: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
          <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      trust: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
          <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      innovation: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      transparency: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
          <path d="M3 9H21M9 3V21" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      customer: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
          <path d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.57831 8.50903 2.99871 7.05 2.99871C5.59096 2.99871 4.19169 3.57831 3.16 4.61C2.1283 5.64169 1.54871 7.04097 1.54871 8.5C1.54871 9.95903 2.1283 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.351 11.8792 21.7564 11.2728 22.0329 10.6054C22.3095 9.93789 22.4518 9.22248 22.4518 8.5C22.4518 7.77752 22.3095 7.06211 22.0329 6.39464C21.7564 5.72718 21.351 5.12075 20.84 4.61V4.61Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    };
    return icons[iconName] || null;
  };

  const stats = [
    { value: '10K+', label: 'Active Investors' },
    { value: '₹50 Cr+', label: 'Assets Under Management' },
    { value: '500+', label: 'Properties Listed' },
    { value: '12-15%', label: 'Average Returns' }
  ];

  const values = [
    {
      icon: 'trust',
      title: 'Trust & Security',
      description: 'Every investment is backed by legal documentation and verified property ownership'
    },
    {
      icon: 'innovation',
      title: 'Innovation',
      description: 'Leveraging blockchain technology to make real estate investment accessible to all'
    },
    {
      icon: 'transparency',
      title: 'Transparency',
      description: 'Complete visibility into property details, financials, and performance metrics'
    },
    {
      icon: 'customer',
      title: 'Customer First',
      description: 'Dedicated support team to guide you through every step of your investment journey'
    }
  ];

  return (
    <div className="about-us-page">
      <Header />
      
      <main className="about-us-main">
        {/* Hero Section */}
        <section className="about-hero">
          <div className="about-hero-content">
            <h1>About AssetKart</h1>
            <p>Democratizing real estate investment for everyone</p>
          </div>
        </section>

        {/* Story Section */}
        <section className="story-section">
          <div className="story-container">
            <div className="story-content">
              <h2>Our Story</h2>
              <p>
                AssetKart was founded with a simple yet powerful vision: to make premium real estate investment 
                accessible to everyone, not just the wealthy few. We recognized that traditional real estate 
                investing required significant capital, making it impossible for most people to build wealth 
                through property ownership.
              </p>
              <p>
                By leveraging blockchain technology and fractional ownership, we've broken down these barriers. 
                Now, anyone can invest in high-value commercial and residential properties with as little as ₹5,000, 
                earning regular rental income and benefiting from capital appreciation.
              </p>
              <p>
                Today, we're proud to serve over 10,000 investors across India, managing ₹50+ crores in assets 
                and helping everyday Indians build wealth through smart real estate investments.
              </p>
            </div>
            <div className="story-image">
              <img 
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2073&auto=format&fit=crop" 
                alt="Real Estate" 
              />
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats-section">
          <div className="stats-container">
            {stats.map((stat, index) => (
              <div key={index} className="stat-box">
                <h3>{stat.value}</h3>
                <p>{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Mission, Vision, Values */}
        <section className="mvv-section">
          <div className="mvv-container">
            <div className="mvv-card">
              <div className="mvv-icon" style={{ color: '#667eea' }}>
                {renderIcon('mission')}
              </div>
              <h3>Our Mission</h3>
              <p>
                To democratize real estate investment by making premium properties accessible to everyone 
                through fractional ownership, enabling wealth creation for all.
              </p>
            </div>
            <div className="mvv-card">
              <div className="mvv-icon" style={{ color: '#764ba2' }}>
                {renderIcon('vision')}
              </div>
              <h3>Our Vision</h3>
              <p>
                To become India's most trusted fractional real estate platform, empowering millions of 
                investors to build diversified property portfolios and achieve financial freedom.
              </p>
            </div>
            <div className="mvv-card">
              <div className="mvv-icon" style={{ color: '#f093fb' }}>
                {renderIcon('values')}
              </div>
              <h3>Our Values</h3>
              <p>
                Trust, transparency, innovation, and customer-centricity guide everything we do. 
                We're committed to providing secure, accessible, and profitable investment opportunities.
              </p>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="values-section">
          <div className="values-container">
            <h2>What We Stand For</h2>
            <div className="values-grid">
              {values.map((value, index) => (
                <div key={index} className="value-card">
                  <div className="value-icon">
                    {renderIcon(value.icon)}
                  </div>
                  <h4>{value.title}</h4>
                  <p>{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="about-cta-section">
          <div className="about-cta-content">
            <h2>Join the AssetKart Community</h2>
            <p>Start your real estate investment journey with India's leading fractional ownership platform</p>
            <button className="about-cta-btn" onClick={() => window.location.href = '/properties'}>
              Start Investing Today
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutUs;