import React from 'react';
import '../../styles/admin/StatCard.css';

const StatCard = ({ icon, label, value, trend, trendValue, color = '#000000' }) => {
  return (
    <div className="stat-card">
      <div className="stat-card-icon" style={{ color }}>
        {icon}
      </div>
      <div className="stat-card-content">
        <span className="stat-card-label">{label}</span>
        <span className="stat-card-value">{value}</span>
        {trend && (
          <span className={`stat-card-trend ${trend === 'up' ? 'positive' : 'negative'}`}>
            {trend === 'up' ? '↑' : '↓'} {trendValue}
          </span>
        )}
      </div>
    </div>
  );
};

export default StatCard;
