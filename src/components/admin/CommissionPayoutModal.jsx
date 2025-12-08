// CommissionPayoutModal.jsx
import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';


const CommissionPayoutModal = ({ 
  commission, 
  bulk, 
  selectedCommissions, 
  onClose, 
  onPayout 
}) => {
  const [paymentReference, setPaymentReference] = useState('');
  const [loading, setLoading] = useState(false);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!paymentReference.trim()) {
      alert('Please enter payment reference');
      return;
    }

    setLoading(true);
    
    try {
      if (bulk) {
        await onPayout(paymentReference);
      } else {
        await onPayout(commission.id, paymentReference);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>
              <span style={{ fontSize: '1.2em', fontWeight: 'bold' }}>₹</span>
              {bulk ? 'Bulk Commission Payout' : 'Process Commission Payout'}
            </h2>
            <p className="modal-subtitle">
              {bulk 
                ? `Pay ${selectedCommissions?.length} selected commissions`
                : `Pay commission to ${commission?.cp_name}`
              }
            </p>
          </div>
          <button className="btn-close" onClick={onClose}>
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Commission Details */}
            {!bulk && commission && (
              <div className="payout-details">
                <div className="detail-row">
                  <span className="label">Commission ID:</span>
                  <span className="value"><code>{commission.commission_id}</code></span>
                </div>
                <div className="detail-row">
                  <span className="label">CP:</span>
                  <span className="value">{commission.cp_name} ({commission.cp_code})</span>
                </div>
                <div className="detail-row">
                  <span className="label">Investment:</span>
                  <span className="value"><code>{commission.investment_id}</code></span>
                </div>
                <div className="detail-row">
                  <span className="label">Commission Amount:</span>
                  <span className="value commission-amt">{formatCurrency(commission.commission_amount)}</span>
                </div>
                <div className="detail-row">
                  <span className="label">TDS (10%):</span>
                  <span className="value tds-amt">-{formatCurrency(commission.tds_amount)}</span>
                </div>
                <div className="detail-row highlight">
                  <span className="label">Net Payable:</span>
                  <span className="value net-amt">{formatCurrency(commission.net_amount)}</span>
                </div>
              </div>
            )}

            {/* Payment Reference */}
            <div className="form-group">
              <label htmlFor="payment-reference">
                Payment Reference / Transaction ID *
              </label>
              <input
                id="payment-reference"
                type="text"
                className="form-control"
                placeholder="e.g., NEFT123456, UPI789, BATCH-20251208"
                value={paymentReference}
                onChange={(e) => setPaymentReference(e.target.value)}
                required
              />
              <small className="form-hint">
                Enter bank transaction ID, UPI reference, or batch number
              </small>
            </div>

            {/* Confirmation Note */}
            <div className="payout-note">
              <strong>⚠️ Important:</strong> Make sure the payment has been completed 
              before marking this commission as paid. This action cannot be undone.
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Processing...' : `💰 Mark as Paid`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CommissionPayoutModal;