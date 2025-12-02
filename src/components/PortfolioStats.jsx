import React from 'react';
import '../styles/PortfolioStats.css';

const PortfolioStats = ({ data }) => {
  const renderIcon = (iconName) => {
    const icons = {
      properties: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path d="M19 21V5C19 4.46957 18.7893 3.96086 18.4142 3.58579C18.0391 3.21071 17.5304 3 17 3H7C6.46957 3 5.96086 3.21071 5.58579 3.58579C5.21071 3.96086 5 4.46957 5 5V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M19 21H21M5 21H3M9 7H10M9 11H10M9 15H10M14 7H15M14 11H15M14 15H15M5 21H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      investment: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path d="M21 4H3C1.89543 4 1 4.89543 1 6V18C1 19.1046 1.89543 20 3 20H21C22.1046 20 23 19.1046 23 18V6C23 4.89543 22.1046 4 21 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M1 10H23M7 15H7.01M12 15H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      current: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path d="M20 12V22H4V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M22 7H2V12H22V7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 22V7M12 7L15 10M12 7L9 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      returns: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path d="M16 3L21 8L16 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10 18H4C3.46957 18 2.96086 17.7893 2.58579 17.4142C2.21071 17.0391 2 16.5304 2 16V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M21 8H10C8.89543 8 8 8.89543 8 10V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      gain: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path d="M18 6L6 18M18 6H10M18 6V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      irr: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      yield: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path d="M21.21 15.89C20.5738 17.3945 19.5788 18.7202 18.3119 19.7513C17.0449 20.7824 15.5447 21.4874 13.9424 21.8048C12.34 22.1221 10.6843 22.0421 9.12006 21.5718C7.55578 21.1015 6.13056 20.2551 4.96927 19.1067C3.80798 17.9582 2.94479 16.5428 2.45661 14.9839C1.96843 13.4251 1.86954 11.7705 2.16832 10.1646C2.46711 8.55878 3.15547 7.05063 4.17202 5.77203C5.18857 4.49343 6.50286 3.48332 8.00004 2.83" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M22 12C22 10.6868 21.7413 9.38642 21.2388 8.17317C20.7362 6.95991 19.9997 5.85752 19.0711 4.92893C18.1425 4.00035 17.0401 3.26375 15.8268 2.7612C14.6136 2.25866 13.3132 2 12 2V12H22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      info: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 16V12M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    };
    return icons[iconName] || null;
  };

  const stats = [
    {
      id: 'properties',
      label: 'Properties Holding',
      value: data.propertiesHolding,
      icon: 'properties',
      iconColor: '#2196F3',
      iconBg: '#E3F2FD'
    },
    {
      id: 'investment',
      label: 'Total Investment',
      value: `₹ ${data.totalInvestment}`,
      icon: 'investment',
      iconColor: '#E91E63',
      iconBg: '#FCE4EC'
    },
    {
      id: 'current',
      label: 'Current Value',
      value: `₹ ${data.currentValue}`,
      icon: 'current',
      iconColor: '#4CAF50',
      iconBg: '#E8F5E9'
    },
    {
      id: 'returns',
      label: 'Total Returns',
      value: `₹ ${data.totalReturns}`,
      icon: 'returns',
      iconColor: '#FF9800',
      iconBg: '#FFF3E0'
    },
    {
      id: 'gain',
      label: 'Average Potential Gain',
      value: `${data.averagePotentialGain}%`,
      icon: 'gain',
      iconColor: '#9C27B0',
      iconBg: '#F3E5F5'
    },
    {
      id: 'irr',
      label: 'Average IRR',
      value: `${data.averageIRR}%`,
      icon: 'irr',
      iconColor: '#00BCD4',
      iconBg: '#E0F7FA'
    },
    {
      id: 'yield',
      label: 'Average Yield',
      value: `${data.averageYield}%`,
      icon: 'yield',
      iconColor: '#FFC107',
      iconBg: '#FFF9C4'
    }
  ];

  return (
    <div className="portfolio-stats">
      {stats.map((stat) => (
        <div key={stat.id} className="stat-card">
          <div className="stat-content">
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
          <div className="stat-icon" style={{ background: stat.iconBg, color: stat.iconColor }}>
            {renderIcon(stat.icon)}
          </div>
          <button className="stat-info-btn">
            {renderIcon('info')}
          </button>
        </div>
      ))}
    </div>
  );
};

export default PortfolioStats;