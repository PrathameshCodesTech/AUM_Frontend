// CPStatsCard.jsx
// =====================================================
// Reusable Stats Card Component
// Used in: Dashboard, Profile, various pages
// =====================================================

import React from 'react';
import '../../styles/cp/CPStatsCard.css';

const CPStatsCard = ({ 
  icon, 
  label, 
  value, 
  color = '#000000',
  trend = null, // { value: '+12%', direction: 'up' | 'down' }
  onClick = null,
  loading = false
}) => {
  return (
    <div 
      className={`cp-stat-card ${onClick ? 'clickable' : ''} ${loading ? 'loading' : ''}`}
      onClick={onClick}
      style={{ borderColor: color }}
    >
      {loading ? (
        <div className="stat-loading">
          <div className="loading-spinner-small">Loading...</div>
        </div>
      ) : (
        <>
          {/* Icon */}
          <div className="stat-card-icon" style={{ color: color }}>
            {icon}
          </div>

          {/* Content */}
          <div className="stat-card-content">
            <div className="stat-card-label">{label}</div>
            <div className="stat-card-value">{value}</div>
            
            {/* Trend (optional) */}
            {trend && (
              <div className={`stat-card-trend ${trend.direction}`}>
                <span className="trend-value">{trend.value}</span>
                {trend.direction === 'up' ? '↑' : '↓'}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CPStatsCard;