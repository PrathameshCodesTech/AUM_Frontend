import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/KnowMoreDropdown.css';

const KnowMoreDropdown = () => {
  const renderIcon = (iconName) => {
    const icons = {
      howItWorks: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 16V12M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      blogs: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14 2V8H20M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      faqs: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          <path d="M9.09 9C9.3251 8.33167 9.78915 7.76811 10.4 7.40913C11.0108 7.05016 11.7289 6.91894 12.4272 7.03871C13.1255 7.15849 13.7588 7.52152 14.2151 8.06353C14.6713 8.60553 14.9211 9.29152 14.92 10C14.92 12 11.92 13 11.92 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 17H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    };
    return icons[iconName] || null;
  };

  const menuItems = [
    {
      icon: 'howItWorks',
      iconColor: '#1a1a1a',
      title: 'How it works',
      description: 'Explore how fractional investments work with AssetKart. Learn through our step-by-step guide and enjoy a seamless investment experience.',
      link: '/how-it-works'
    },
    {
      icon: 'blogs',
      iconColor: '#1a1a1a',
      title: 'Blogs',
      description: 'Read our latest blogs to gain insights into market updates and a deeper understanding of fractional ownership.',
      link: '/blogs'
    },
    {
      icon: 'faqs',
      iconColor: '#1a1a1a',
      title: 'FAQs',
      description: 'Find answers about AssetKart, how it works, and getting started on your journey.',
      link: '/faqs'
    }
  ];

return (
    <div className="know-more-dropdown">
      <div className="dropdown-content">
        {menuItems.map((item, index) => (
          <Link to={item.link} key={index} className="dropdown-item">
            <div className="item-icon" style={{ color: item.iconColor }}>
              {renderIcon(item.icon)}
            </div>
            <div className="item-content">
              <h4>{item.title}</h4>
              <p>{item.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default KnowMoreDropdown;