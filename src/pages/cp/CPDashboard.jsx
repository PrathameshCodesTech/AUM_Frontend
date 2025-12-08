// CPDashboard.jsx
// =====================================================
// CP Dashboard - Main Dashboard for Channel Partners
// Shows: Stats, Recent Customers, Recent Leads, Quick Actions
// =====================================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUsers, FiTrendingUp, FiClipboard, FiHome, FiMail, FiEye } from 'react-icons/fi';
import CPHeader from '../../components/cp/CPHeader';
import CPStatsCard from '../../components/cp/CPStatsCard';
import cpService from '../../services/cpService';
import '../../styles/cp/CPDashboard.css';

const CPDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const result = await cpService.getDashboardStats();
      
      if (result.success) {
        setStats(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="cp-dashboard-page">
        <CPHeader />
        <div className="loading-state-dash">
          <div className="loading-spinner">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cp-dashboard-page">
        <CPHeader />
        <div className="error-state">
          <p>{error}</p>
          <button onClick={fetchDashboardStats}>Retry</button>
        </div>
      </div>
    );
  }

  const cpInfo = stats?.cp_info || {};
  const customers = stats?.customers || {};
  const investments = stats?.investments || {};
  const commissions = stats?.commissions || {};
  const leads = stats?.leads || {};
  const targets = stats?.targets || {};

  return (
    <div className="cp-dashboard-page">
      <CPHeader />
      
      <div className="cp-dashboard-container">
        {/* Hero Section */}
        <div className="dashboard-hero-cp">
          <div className="hero-content-cp">
            <h1>Welcome Back!</h1>
            <div className="cp-info-badges">
              <span className="cp-code-badge">CP Code: {cpInfo.cp_code}</span>
              <span className={`tier-badge tier-${cpInfo.partner_tier}`}>
                {cpInfo.partner_tier?.toUpperCase()} Partner
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="quick-stats-cp">
          <CPStatsCard
            icon={<FiUsers size={32} />}
            label="Active Customers"
            value={customers.active || 0}
            color="#667eea"
            onClick={() => navigate('/cp/customers')}
          />
          <CPStatsCard
            icon={<span style={{ fontSize: '32px', fontWeight: 'bold' }}>₹</span>}
            label="Total Invested"
            value={formatCurrency(investments.total_value || 0)}
            color="#28a745"
            onClick={() => navigate('/cp/customers')}
          />
          <CPStatsCard
            icon={<FiTrendingUp size={32} />}
            label="Pending Commissions"
            value={formatCurrency(commissions.pending || 0)}
            color="#ffc107"
            onClick={() => navigate('/cp/commissions')}
          />
          <CPStatsCard
            icon={<FiClipboard size={32} />}
            label="Active Leads"
            value={leads.active || 0}
            color="#007bff"
            onClick={() => navigate('/cp/leads')}
          />
        </div>

        {/* Performance vs Target */}
        {targets.monthly_target > 0 && (
          <div className="performance-card">
            <h3>Monthly Performance</h3>
            <div className="performance-content">
              <div className="performance-stats">
                <div className="stat-item-perf">
                  <span className="stat-label-perf">Target</span>
                  <span className="stat-value-perf">{formatCurrency(targets.monthly_target)}</span>
                </div>
                <div className="stat-item-perf">
                  <span className="stat-label-perf">Achieved</span>
                  <span className="stat-value-perf success">{formatCurrency(targets.monthly_achieved)}</span>
                </div>
                <div className="stat-item-perf">
                  <span className="stat-label-perf">Progress</span>
                  <span className="stat-value-perf">{targets.achievement_percentage?.toFixed(1)}%</span>
                </div>
              </div>
              <div className="progress-bar-container">
                <div 
                  className="progress-bar-fill"
                  style={{ width: `${Math.min(targets.achievement_percentage, 100)}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="quick-actions-cp">
          <h3>Quick Actions</h3>
          <div className="actions-grid-cp">
            <button 
              className="action-card-cp"
              onClick={() => navigate('/cp/properties')}
            >
              <div className="action-icon-cp">
                <FiHome size={28} />
              </div>
              <div className="action-label-cp">View Properties</div>
              <div className="action-desc-cp">Browse authorized properties</div>
            </button>

            <button 
              className="action-card-cp"
              onClick={() => navigate('/cp/invites')}
            >
              <div className="action-icon-cp">
                <FiMail size={28} />
              </div>
              <div className="action-label-cp">Send Invite</div>
              <div className="action-desc-cp">Invite new customers</div>
            </button>

            <button 
              className="action-card-cp"
              onClick={() => navigate('/cp/leads')}
            >
              <div className="action-icon-cp">
                <FiClipboard size={28} />
              </div>
              <div className="action-label-cp">Add Lead</div>
              <div className="action-desc-cp">Track new leads</div>
            </button>

            <button 
              className="action-card-cp"
              onClick={() => navigate('/cp/commissions')}
            >
              <div className="action-icon-cp">
                <FiEye size={28} />
              </div>
              <div className="action-label-cp">View Earnings</div>
              <div className="action-desc-cp">Track your commissions</div>
            </button>
          </div>
        </div>

        {/* Recent Activity Grid */}
        <div className="recent-activity-grid">
          {/* Recent Customers */}
          <div className="activity-card">
            <div className="activity-header">
              <h3>Recent Customers</h3>
              <button 
                className="btn-view-all"
                onClick={() => navigate('/cp/customers')}
              >
                View All
              </button>
            </div>
            <div className="activity-content">
              {customers.total > 0 ? (
                <div className="customer-summary">
                  <div className="summary-row">
                    <span>Total Customers:</span>
                    <strong>{customers.total}</strong>
                  </div>
                  <div className="summary-row">
                    <span>Active:</span>
                    <strong className="success">{customers.active}</strong>
                  </div>
                  <div className="summary-row">
                    <span>New This Month:</span>
                    <strong className="info">{customers.new_this_month || 0}</strong>
                  </div>
                </div>
              ) : (
                <div className="empty-state">
                  <p>No customers yet</p>
                  <button 
                    className="btn-action-small"
                    onClick={() => navigate('/cp/invites')}
                  >
                    Send Invite
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Commission Summary */}
          <div className="activity-card">
            <div className="activity-header">
              <h3>Commission Summary</h3>
              <button 
                className="btn-view-all"
                onClick={() => navigate('/cp/commissions')}
              >
                View All
              </button>
            </div>
            <div className="activity-content">
              <div className="commission-summary">
                <div className="summary-row">
                  <span>Total Earned:</span>
                  <strong className="success">{formatCurrency(commissions.total_earned || 0)}</strong>
                </div>
                <div className="summary-row">
                  <span>Pending:</span>
                  <strong className="warning">{formatCurrency(commissions.pending || 0)}</strong>
                </div>
                <div className="summary-row">
                  <span>Paid:</span>
                  <strong className="info">{formatCurrency(commissions.paid || 0)}</strong>
                </div>
                <div className="summary-row">
                  <span>This Month:</span>
                  <strong>{formatCurrency(commissions.this_month || 0)}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Leads Summary */}
        {leads.total > 0 && (
          <div className="leads-summary-card">
            <div className="activity-header">
              <h3>Leads Summary</h3>
              <button 
                className="btn-view-all"
                onClick={() => navigate('/cp/leads')}
              >
                Manage Leads
              </button>
            </div>
            <div className="leads-stats">
              <div className="lead-stat-item">
                <span className="lead-stat-value">{leads.total}</span>
                <span className="lead-stat-label">Total Leads</span>
              </div>
              <div className="lead-stat-item">
                <span className="lead-stat-value success">{leads.converted || 0}</span>
                <span className="lead-stat-label">Converted</span>
              </div>
              <div className="lead-stat-item">
                <span className="lead-stat-value info">{leads.active || 0}</span>
                <span className="lead-stat-label">Active</span>
              </div>
              <div className="lead-stat-item">
                <span className="lead-stat-value">
                  {leads.total > 0 ? ((leads.converted / leads.total) * 100).toFixed(1) : 0}%
                </span>
                <span className="lead-stat-label">Conversion Rate</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CPDashboard;