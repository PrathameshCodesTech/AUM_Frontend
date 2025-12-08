// CPCommissionCard.jsx
// =====================================================
// CP Commission Card Component
// Displays commission details with status
// =====================================================

import React from 'react';
import { FiDollarSign, FiUser, FiHome, FiCalendar } from 'react-icons/fi';
import cpCommissionService from '../../services/cpCommissionService';
import '../../styles/cp/CPCommissionCard.css';

const CPCommissionCard = ({ commission }) => {
  const formatCurrency = cpCommissionService.formatCurrency;
  const formatDate = cpCommissionService.formatDate;
  const getStatusColor = cpCommissionService.getStatusColor;
  const getStatusLabel = cpCommissionService.getStatusLabel;

  const statusColor = getStatusColor(commission.status);
  const statusLabel = getStatusLabel(commission.status);

  return (
    <div className="cp-commission-card">
      {/* Header with Status */}
      <div className="commission-header">
        <div className="commission-amount-section">
          <div className="amount-label">Commission Amount</div>
          <div className="amount-value">{formatCurrency(commission.amount)}</div>
        </div>
        <span 
          className="commission-status-badge"
          style={{ background: statusColor }}
        >
          {statusLabel}
        </span>
      </div>

      {/* Details Grid */}
      <div className="commission-details-grid">
        {/* Customer Info */}
        <div className="detail-group-comm">
          <div className="detail-icon-comm">
            <FiUser size={18} />
          </div>
          <div className="detail-content-comm">
            <span className="detail-label-comm">Customer</span>
            <span className="detail-value-comm">{commission.customer_name}</span>
          </div>
        </div>

        {/* Property Info */}
        {commission.property_name && (
          <div className="detail-group-comm">
            <div className="detail-icon-comm">
              <FiHome size={18} />
            </div>
            <div className="detail-content-comm">
              <span className="detail-label-comm">Property</span>
              <span className="detail-value-comm">{commission.property_name}</span>
            </div>
          </div>
        )}

        {/* Investment Amount */}
        <div className="detail-group-comm">
          <div className="detail-icon-comm">
            <FiDollarSign size={18} />
          </div>
          <div className="detail-content-comm">
            <span className="detail-label-comm">Investment Amount</span>
            <span className="detail-value-comm">
              {formatCurrency(commission.investment_amount)}
            </span>
          </div>
        </div>

        {/* Commission Rate */}
        <div className="detail-group-comm">
          <div className="detail-icon-comm rate">%</div>
          <div className="detail-content-comm">
            <span className="detail-label-comm">Commission Rate</span>
            <span className="detail-value-comm">{commission.commission_rate}%</span>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="commission-timeline">
        <div className="timeline-item-comm">
          <FiCalendar size={14} />
          <span className="timeline-text">
            Earned: {formatDate(commission.created_at)}
          </span>
        </div>

        {commission.approved_at && (
          <div className="timeline-item-comm">
            <FiCalendar size={14} />
            <span className="timeline-text">
              Approved: {formatDate(commission.approved_at)}
            </span>
          </div>
        )}

        {commission.paid_at && (
          <div className="timeline-item-comm success">
            <FiCalendar size={14} />
            <span className="timeline-text">
              Paid: {formatDate(commission.paid_at)}
            </span>
          </div>
        )}
      </div>

      {/* Notes */}
      {commission.notes && (
        <div className="commission-notes">
          <strong>Notes:</strong> {commission.notes}
        </div>
      )}
    </div>
  );
};

export default CPCommissionCard;