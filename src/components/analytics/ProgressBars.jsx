import React from 'react';
import '../../styles/ProgressBars.css';

const ProgressBars = ({ progressMetrics }) => {
  const renderIcon = (iconName) => {
    const icons = {
      funding: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M12 2V22M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      construction: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2"/>
          <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      target: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="2"/>
          <circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="2"/>
        </svg>
      )
    };
    return icons[iconName] || null;
  };

  const bars = [
    { 
      label: 'Funding Progress', 
      value: progressMetrics?.funding || 0, 
      color: '#10B981',
      icon: 'funding'
    },
    { 
      label: 'Construction Status', 
      value: progressMetrics?.construction || 0, 
      color: '#3B82F6',
      icon: 'construction'
    },
    { 
      label: 'Investor Goal', 
      value: progressMetrics?.investor_goal || 0, 
      color: '#F59E0B',
      icon: 'target'
    },
  ];

  return (
    <div className="progress-bars-container">
      {bars.map((bar, index) => (
        <div 
          key={bar.label} 
          className="progress-item"
          style={{ animationDelay: `${index * 0.15}s` }}
        >
          <div className="progress-header">
            <div className="progress-title">
              <div 
                className="progress-icon"
                style={{ background: `${bar.color}15`, color: bar.color }}
              >
                {renderIcon(bar.icon)}
              </div>
              <span className="progress-label">{bar.label}</span>
            </div>
            <span className="progress-percentage">{bar.value?.toFixed(1) || 0}%</span>
          </div>
          
          <div className="progress-bar-wrapper">
            <div 
              className="progress-bar-fill"
              style={{ 
                width: `${Math.min(100, bar.value)}%`, 
                background: bar.color
              }}
            >
              <div className="progress-bar-shine"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProgressBars;