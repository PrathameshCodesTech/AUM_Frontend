// CPPropertyCard.jsx
// =====================================================
// CP Property Card Component
// Displays property info with share/download actions
// =====================================================

import React from 'react';
import { FiShare2, FiDownload, FiMapPin, FiDollarSign, FiCalendar } from 'react-icons/fi';
import '../../styles/cp/CPPropertyCard.css';

const CPPropertyCard = ({ property, onShare }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="cp-property-card">
      {/* Property Image */}
      <div className="property-image">
        {property.image ? (
          <img src={property.image} alt={property.title} />
        ) : (
          <div className="property-image-placeholder">
            <FiMapPin size={40} />
          </div>
        )}
        {property.status && (
          <span className={`status-badge-prop ${property.status}`}>
            {property.status.replace('_', ' ').toUpperCase()}
          </span>
        )}
      </div>

      {/* Property Details */}
      <div className="property-details">
        <h3 className="property-title">{property.title}</h3>
        
        {property.location && (
          <div className="property-meta">
            <FiMapPin size={16} />
            <span>{property.location}</span>
          </div>
        )}

        <div className="property-info-grid">
          {property.price && (
            <div className="info-item">
              <FiDollarSign size={18} />
              <div>
                <span className="info-label">Price per Token</span>
                <span className="info-value">{formatCurrency(property.price)}</span>
              </div>
            </div>
          )}

          {property.expected_returns && (
            <div className="info-item">
              <span className="info-icon">📈</span>
              <div>
                <span className="info-label">Expected Returns</span>
                <span className="info-value success">{property.expected_returns}%</span>
              </div>
            </div>
          )}
        </div>

        {property.authorized_at && (
          <div className="authorization-info">
            <FiCalendar size={14} />
            <span>Authorized on {formatDate(property.authorized_at)}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="property-actions">
        <button 
          className="btn-share-prop"
          onClick={() => onShare(property)}
        >
          <FiShare2 size={18} />
          Share Property
        </button>
        
        {property.brochure_url && (
          <button 
            className="btn-download-prop"
            onClick={() => window.open(property.brochure_url, '_blank')}
          >
            <FiDownload size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default CPPropertyCard;