import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/HowItWorks.css';

const HowItWorks = () => {
  const renderIcon = (iconName) => {
    const icons = {
      signup: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
          <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="8.5" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
          <path d="M20 8V14M17 11H23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      browse: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
          <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      invest: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
          <path d="M2 10H22" stroke="currentColor" strokeWidth="2"/>
          <circle cx="7" cy="15" r="1" fill="currentColor"/>
        </svg>
      ),
      earn: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
          <path d="M23 6L13.5 15.5L8.5 10.5L1 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M17 6H23V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    };
    return icons[iconName] || null;
  };

  const steps = [
    {
      number: '01',
      icon: 'signup',
      title: 'Sign Up & Complete KYC',
      description: 'Create your account in minutes and complete a simple KYC verification process to ensure secure and compliant investments.',
      color: '#667eea'
    },
    {
      number: '02',
      icon: 'browse',
      title: 'Browse Properties',
      description: 'Explore our curated selection of premium real estate properties. View detailed information, financial projections, and location insights.',
      color: '#764ba2'
    },
    {
      number: '03',
      icon: 'invest',
      title: 'Invest & Own Tokens',
      description: 'Choose your investment amount and purchase property tokens. Own a fraction of high-value real estate starting from just ₹5,000.',
      color: '#f093fb'
    },
    {
      number: '04',
      icon: 'earn',
      title: 'Earn Returns',
      description: 'Receive regular rental income and benefit from capital appreciation. Track your portfolio performance in real-time through your dashboard.',
      color: '#4facfe'
    }
  ];

  const benefits = [
    {
      title: 'Low Entry Barrier',
      description: 'Start investing in premium properties with as low as ₹5,000'
    },
    {
      title: 'Diversification',
      description: 'Spread your investments across multiple properties to minimize risk'
    },
    {
      title: 'Passive Income',
      description: 'Earn regular rental income from your fractional property ownership'
    },
    {
      title: 'Capital Appreciation',
      description: 'Benefit from long-term property value growth'
    },
    {
      title: 'Liquidity',
      description: 'Exit your investments through our secondary marketplace anytime'
    },
    {
      title: 'Transparency',
      description: 'Full access to property documents, financials, and performance metrics'
    }
  ];

  return (
    <div className="how-it-works-page">
      <Header />
      
      <main className="how-it-works-main">
        {/* Hero Section */}
        <section className="hero-section-how">
          <div className="hero-content-how">
            <h1>How AssetKart Works</h1>
            <p>Invest in fractional real estate in 4 simple steps</p>
          </div>
        </section>

        {/* Steps Section */}
        <section className="steps-section">
          <div className="steps-container">
            {steps.map((step, index) => (
              <div key={index} className="step-card">
                <div className="step-number" style={{ background: step.color }}>
                  {step.number}
                </div>
                <div className="step-icon" style={{ color: step.color }}>
                  {renderIcon(step.icon)}
                </div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="benefits-section">
          <div className="benefits-container">
            <h2>Why Choose Fractional Ownership?</h2>
            <div className="benefits-grid">
              {benefits.map((benefit, index) => (
                <div key={index} className="benefit-card">
                  <h4>{benefit.title}</h4>
                  <p>{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section-how">
          <div className="cta-content-how">
            <h2>Ready to Start Investing?</h2>
            <p>Join thousands of investors building wealth through fractional real estate</p>
            <button className="cta-button" onClick={() => window.location.href = '/properties'}>
              Explore Properties
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HowItWorks;