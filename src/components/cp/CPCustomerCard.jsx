// CPCustomerCard.jsx
// =====================================================
// CP Customer Card Component
// Displays customer info with expiry countdown
// =====================================================

import React from 'react';
import { FiPhone, FiMail, FiDollarSign, FiClock, FiAlertCircle } from 'react-icons/fi';
import '../../styles/cp/CPCustomerCard.css';

const CPCustomerCard = ({ customer }) => {
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

  const getExpiryStatus = () => {
    if (customer.is_expired) {
      return {
        className: 'expired',
        label: 'EXPIRED',
        color: '#dc3545'
      };
    }

    if (!customer.days_remaining) {
      return {
        className: 'active',
        label: 'ACTIVE',
        color: '#28a745'
      };
    }

    if (customer.days_remaining <= 7) {
      return {
        className: 'critical',
        label: `${customer.days_remaining} DAYS LEFT`,
        color: '#dc3545'
      };
    }

    if (customer.days_remaining <= 15) {
      return {
        className: 'warning',
        label: `${customer.days_remaining} DAYS LEFT`,
        color: '#ff9800'
      };
    }

    return {
      className: 'active',
      label: `${customer.days_remaining} DAYS LEFT`,
      color: '#28a745'
    };
  };

  const expiryStatus = getExpiryStatus();

  return (
    <div className={`cp-customer-card ${expiryStatus.className}`}>
      {/* Status Badge */}
      <div className="customer-status-header">
        <span 
          className={`customer-status-badge ${expiryStatus.className}`}
          style={{ background: expiryStatus.color }}
        >
          {expiryStatus.label}
        </span>
      </div>

      {/* Customer Info */}
      <div className="customer-info-section">
        <h3 className="customer-name">{customer.name}</h3>
        
        <div className="customer-contact-info">
          {customer.phone && (
            <div className="contact-item-customer">
              <FiPhone size={14} />
              <a href={`tel:${customer.phone}`}>{customer.phone}</a>
            </div>
          )}
          {customer.email && (
            <div className="contact-item-customer">
              <FiMail size={14} />
              <a href={`mailto:${customer.email}`}>{customer.email}</a>
            </div>
          )}
        </div>
      </div>

      {/* Investment Stats */}
      <div className="investment-stats">
        <div className="stat-row-customer">
          <div className="stat-item-cust">
            <FiDollarSign size={16} className="stat-icon-cust" />
            <div className="stat-details-cust">
              <span className="stat-label-cust">Total Invested</span>
              <span className="stat-value-cust success">
                {formatCurrency(customer.total_invested || 0)}
              </span>
            </div>
          </div>
        </div>

        <div className="stat-row-customer">
          <div className="stat-item-cust">
            <div className="stat-icon-cust commission">💰</div>
            <div className="stat-details-cust">
              <span className="stat-label-cust">Your Commission</span>
              <span className="stat-value-cust">
                {formatCurrency(customer.total_commission || 0)}
              </span>
            </div>
          </div>
        </div>

        {customer.pending_commission > 0 && (
          <div className="stat-row-customer">
            <div className="stat-item-cust">
              <FiClock size={16} className="stat-icon-cust" />
              <div className="stat-details-cust">
                <span className="stat-label-cust">Pending</span>
                <span className="stat-value-cust warning">
                  {formatCurrency(customer.pending_commission)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Relationship Timeline */}
      <div className="relationship-timeline">
        <div className="timeline-row-customer">
          <span className="timeline-label-customer">Linked Since:</span>
          <span className="timeline-value-customer">
            {formatDate(customer.relationship_start_date)}
          </span>
        </div>
        {customer.relationship_end_date && (
          <div className="timeline-row-customer">
            <span className="timeline-label-customer">
              {customer.is_expired ? 'Expired On:' : 'Valid Until:'}
            </span>
            <span className={`timeline-value-customer ${customer.is_expired ? 'expired' : ''}`}>
              {formatDate(customer.relationship_end_date)}
            </span>
          </div>
        )}
      </div>

      {/* Expiry Warning */}
      {!customer.is_expired && customer.days_remaining && customer.days_remaining <= 15 && (
        <div className="expiry-warning">
          <FiAlertCircle size={16} />
          <span>
            {customer.days_remaining <= 7
              ? 'Urgent: Contact admin to extend relationship'
              : 'Relationship expiring soon - plan renewal'}
          </span>
        </div>
      )}

      {/* Expired Notice */}
      {customer.is_expired && (
        <div className="expired-notice">
          <FiAlertCircle size={16} />
          <span>Relationship expired - No new commissions will be earned</span>
        </div>
      )}
    </div>
  );
};

export default CPCustomerCard;