// CPCommissions.jsx
// =====================================================
// CP Commissions Page
// Track earnings with status filters
// =====================================================

import React, { useState, useEffect } from 'react';
import { FiDollarSign, FiFilter } from 'react-icons/fi';
import CPHeader from '../../components/cp/CPHeader';
import CPCommissionCard from '../../components/cp/CPCommissionCard';
import cpCommissionService from '../../services/cpCommissionService';
import '../../styles/cp/CPCommissions.css';

const CPCommissions = () => {
  const [commissions, setCommissions] = useState([]);
  const [filteredCommissions, setFilteredCommissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchCommissions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [commissions, statusFilter]);

  const fetchCommissions = async () => {
    try {
      setLoading(true);
      const result = await cpCommissionService.getCommissions();
      
      if (result.success) {
        setCommissions(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to load commissions');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    if (statusFilter === 'all') {
      setFilteredCommissions(commissions);
    } else {
      setFilteredCommissions(commissions.filter(c => c.status === statusFilter));
    }
  };

  // Calculate summary
  const summary = cpCommissionService.getCommissionSummary(commissions);

  // Count by status
  const pendingCount = commissions.filter(c => c.status === 'pending').length;
  const approvedCount = commissions.filter(c => c.status === 'approved').length;
  const paidCount = commissions.filter(c => c.status === 'paid').length;

  const formatCurrency = cpCommissionService.formatCurrency;

  if (loading) {
    return (
      <div className="cp-commissions-page">
        <CPHeader />
        <div className="loading-state-dash">
          <div className="loading-spinner">Loading commissions...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="cp-commissions-page">
      <CPHeader />

      <div className="cp-commissions-container">
        {/* Header */}
        <div className="commissions-header">
          <div>
            <h1>Commission Tracking</h1>
            <p>Monitor your earnings and payment status</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="commission-summary-grid">
          <div className="summary-card-commission primary">
            <div className="summary-icon-comm">💰</div>
            <div className="summary-content-comm">
              <div className="summary-label-comm">Total Earned</div>
              <div className="summary-value-comm">{formatCurrency(summary.total)}</div>
            </div>
          </div>

          <div className="summary-card-commission warning">
            <div className="summary-icon-comm">⏳</div>
            <div className="summary-content-comm">
              <div className="summary-label-comm">Pending</div>
              <div className="summary-value-comm">{formatCurrency(summary.pending)}</div>
              <div className="summary-count-comm">{pendingCount} transactions</div>
            </div>
          </div>

          <div className="summary-card-commission info">
            <div className="summary-icon-comm">✓</div>
            <div className="summary-content-comm">
              <div className="summary-label-comm">Approved</div>
              <div className="summary-value-comm">{formatCurrency(summary.approved)}</div>
              <div className="summary-count-comm">{approvedCount} transactions</div>
            </div>
          </div>

          <div className="summary-card-commission success">
            <div className="summary-icon-comm">💵</div>
            <div className="summary-content-comm">
              <div className="summary-label-comm">Paid</div>
              <div className="summary-value-comm">{formatCurrency(summary.paid)}</div>
              <div className="summary-count-comm">{paidCount} transactions</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="commission-filters">
          <button
            className={`filter-btn-comm ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            All ({commissions.length})
          </button>
          <button
            className={`filter-btn-comm ${statusFilter === 'pending' ? 'active' : ''}`}
            onClick={() => setStatusFilter('pending')}
          >
            Pending ({pendingCount})
          </button>
          <button
            className={`filter-btn-comm ${statusFilter === 'approved' ? 'active' : ''}`}
            onClick={() => setStatusFilter('approved')}
          >
            Approved ({approvedCount})
          </button>
          <button
            className={`filter-btn-comm ${statusFilter === 'paid' ? 'active' : ''}`}
            onClick={() => setStatusFilter('paid')}
          >
            Paid ({paidCount})
          </button>
        </div>

        {/* Error State */}
        {error && (
          <div className="error-banner-comm">
            <span>{error}</span>
            <button onClick={fetchCommissions}>Retry</button>
          </div>
        )}

        {/* Empty State */}
        {filteredCommissions.length === 0 && !loading && !error && (
          <div className="empty-state-comm">
            {statusFilter !== 'all' ? (
              <>
                <FiFilter size={60} color="#cccccc" />
                <h3>No {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} Commissions</h3>
                <p>Try selecting a different filter</p>
                <button 
                  className="btn-clear-filter-comm"
                  onClick={() => setStatusFilter('all')}
                >
                  View All
                </button>
              </>
            ) : (
              <>
                <FiDollarSign size={60} color="#cccccc" />
                <h3>No Commissions Yet</h3>
                <p>You'll earn commissions when your customers invest in properties</p>
              </>
            )}
          </div>
        )}

        {/* Commissions List */}
        {filteredCommissions.length > 0 && (
          <div className="commissions-list">
            {filteredCommissions.map((commission) => (
              <CPCommissionCard
                key={commission.id}
                commission={commission}
              />
            ))}
          </div>
        )}

        {/* Info Box */}
        {commissions.length > 0 && (
          <div className="info-box-comm">
            <h4>💡 Commission Process</h4>
            <ul>
              <li><strong>Pending:</strong> Commission calculated, awaiting admin approval</li>
              <li><strong>Approved:</strong> Admin approved, payment processing</li>
              <li><strong>Paid:</strong> Payment completed to your bank account</li>
            </ul>
            <p>Contact support if you have questions about specific transactions.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CPCommissions;