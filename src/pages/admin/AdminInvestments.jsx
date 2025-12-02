import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import adminService from '../../services/adminService';
import DataTable from '../../components/admin/DataTable';
import StatusBadge from '../../components/admin/StatusBadge';
import ActionModal from '../../components/admin/ActionModal';
import '../../styles/admin/AdminInvestments.css';

const AdminInvestments = () => {
  const navigate = useNavigate();
  const [investments, setInvestments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    property: '',
    date_from: '',
    date_to: ''
  });
  
  // Action modal
  const [actionModal, setActionModal] = useState({
    isOpen: false,
    investmentId: null,
    action: null,
    title: '',
    message: '',
    requireReason: false,
    userName: ''
  });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchInvestments();
    fetchStats();
  }, [filters]);

const fetchInvestments = async () => {
  setLoading(true);
  try {
    const response = await adminService.getInvestments(filters);
    
    console.log('📦 Investments Response:', response); // 👈 For debugging
    
    if (response.success && response.results) {
      setInvestments(response.results);
    } else {
      console.warn('⚠️ Unexpected response format:', response);
      setInvestments([]);
    }
  } catch (error) {
    console.error('❌ Error fetching investments:', error);
    toast.error('Failed to load investments');
  } finally {
    setLoading(false);
  }
};

  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const response = await adminService.getInvestmentStats();
      
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('❌ Error fetching investment stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const openActionModal = (investment, action) => {
    const modalConfig = {
      approve: {
        title: 'Approve Investment',
        message: `Are you sure you want to approve investment #${investment.investment_id} by ${investment.customer?.username}? Units will be allocated and funds deducted.`,
        requireReason: false
      },
      reject: {
        title: 'Reject Investment',
        message: `Are you sure you want to reject investment #${investment.investment_id}? Please provide a reason.`,
        requireReason: true
      },
      complete: {
        title: 'Mark as Completed',
        message: `Mark investment #${investment.investment_id} as payment completed?`,
        requireReason: false
      },
      cancel: {
        title: 'Cancel Investment',
        message: `Are you sure you want to cancel investment #${investment.investment_id}? Units will be returned to property.`,
        requireReason: true
      }
    };

    setActionModal({
      isOpen: true,
      investmentId: investment.id,
      action,
      userName: investment.customer?.username || 'User',
      ...modalConfig[action]
    });
  };

  const handleInvestmentAction = async (reason) => {
    setActionLoading(true);
    
    try {
      const response = await adminService.investmentAction(
        actionModal.investmentId,
        actionModal.action,
        reason
      );

      if (response.success) {
        toast.success(response.message);
        fetchInvestments(); // Refresh list
        fetchStats(); // Refresh stats
        setActionModal({ ...actionModal, isOpen: false });
      }
    } catch (error) {
      toast.error(error.message || 'Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const renderIcon = (iconName) => {
    const icons = {
      filter: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M22 3H2L10 12.46V19L14 21V12.46L22 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      view: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="2"/>
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      trending: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M23 6L13.5 15.5L8.5 10.5L1 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M17 6H23V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      money: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      check: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M9 11L12 14L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    };
    return icons[iconName] || null;
  };

  const columns = [
  {
    key: 'investment_id',
    label: 'Investment ID',
    sortable: true,
    render: (value) => <strong>#{value}</strong>
  },
  {
    key: 'customer_name', // ✅ Changed from 'customer' to 'customer_name'
    label: 'Customer',
    sortable: false,
    render: (value, row) => (
      <div className="user-cell">
        <div className="user-avatar-small">
          {value?.charAt(0).toUpperCase()}
        </div>
        <div className="user-info">
          <strong>{value || 'N/A'}</strong>
          <span className="user-email">{row.customer_email || ''}</span>
        </div>
      </div>
    )
  },
  {
    key: 'property_name', // ✅ Changed from 'property' to 'property_name'
    label: 'Property',
    sortable: false,
    render: (value) => value || 'N/A'
  },
  {
    key: 'amount',
    label: 'Amount',
    sortable: true,
    render: (value) => <strong>{formatCurrency(value)}</strong>
  },
  {
    key: 'units_purchased',
    label: 'Units',
    sortable: true
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    render: (value) => <StatusBadge status={value} />
  },
  {
    key: 'payment_completed',
    label: 'Payment',
    sortable: true,
    render: (value) => (
      <StatusBadge 
        status={value ? 'completed' : 'pending'} 
        label={value ? 'Completed' : 'Pending'}
      />
    )
  },
  {
    key: 'created_at',
    label: 'Date',
    sortable: true,
    render: (value) => new Date(value).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }
];

  const renderActions = (investment) => (
    <div className="table-actions">
      <button
        className="btn-action btn-view"
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/admin/investments/${investment.id}`);
        }}
        title="View Details"
      >
        {renderIcon('view')}
      </button>

      {investment.status === 'pending' && (
        <>
          <button
            className="btn-action btn-approve"
            onClick={(e) => {
              e.stopPropagation();
              openActionModal(investment, 'approve');
            }}
            title="Approve Investment"
          >
            ✓
          </button>
          <button
            className="btn-action btn-reject"
            onClick={(e) => {
              e.stopPropagation();
              openActionModal(investment, 'reject');
            }}
            title="Reject Investment"
          >
            ✗
          </button>
        </>
      )}

      {investment.status === 'approved' && !investment.payment_completed && (
        <button
          className="btn-action btn-approve"
          onClick={(e) => {
            e.stopPropagation();
            openActionModal(investment, 'complete');
          }}
          title="Mark as Completed"
        >
          ✓
        </button>
      )}
    </div>
  );

  return (
    <div className="admin-investments-page">
      <div className="page-header">
        <div>
          <h1>Investment Management</h1>
          <p className="page-subtitle">Monitor and manage all platform investments</p>
        </div>
      </div>

      {/* Stats */}
      {!statsLoading && stats && (
        <div className="investment-stats">
          <div className="stat-card-investment">
            <span className="stat-icon-invest">{renderIcon('trending')}</span>
            <div className="stat-content-invest">
              <span className="stat-label-invest">Total Investments</span>
              <span className="stat-value-invest">{stats.total_investments || 0}</span>
            </div>
          </div>
          <div className="stat-card-investment">
            <span className="stat-icon-invest">{renderIcon('money')}</span>
            <div className="stat-content-invest">
              <span className="stat-label-invest">Total Amount</span>
              <span className="stat-value-invest">{formatCurrency(stats.total_investment_amount)}</span>
            </div>
          </div>
          <div className="stat-card-investment">
            <span className="stat-icon-invest" style={{ color: '#ff9800' }}>{renderIcon('trending')}</span>
            <div className="stat-content-invest">
              <span className="stat-label-invest">Pending</span>
              <span className="stat-value-invest">{stats.pending_investments || 0}</span>
            </div>
          </div>
          <div className="stat-card-investment">
            <span className="stat-icon-invest" style={{ color: '#28a745' }}>{renderIcon('check')}</span>
            <div className="stat-content-invest">
              <span className="stat-label-invest">Approved</span>
              <span className="stat-value-invest">{stats.approved_investments || 0}</span>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="page-filters">
        <div className="filter-group">
          <input
            type="text"
            placeholder="Search by customer, phone, investment ID..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="filter-search"
          />
        </div>

        <div className="filter-group">
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="filter-select"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="filter-group">
          <input
            type="date"
            placeholder="From Date"
            value={filters.date_from}
            onChange={(e) => handleFilterChange('date_from', e.target.value)}
            className="filter-select"
          />
        </div>

        <div className="filter-group">
          <input
            type="date"
            placeholder="To Date"
            value={filters.date_to}
            onChange={(e) => handleFilterChange('date_to', e.target.value)}
            className="filter-select"
          />
        </div>

        <button 
          className="btn-filter-reset" 
          onClick={() => setFilters({ search: '', status: '', property: '', date_from: '', date_to: '' })}
        >
          {renderIcon('filter')} Reset Filters
        </button>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={investments}
        loading={loading}
        onRowClick={(investment) => navigate(`/admin/investments/${investment.id}`)}
        actions={renderActions}
        emptyMessage="No investments found"
      />

      {/* Action Modal */}
      <ActionModal
        isOpen={actionModal.isOpen}
        onClose={() => setActionModal({ ...actionModal, isOpen: false })}
        onConfirm={handleInvestmentAction}
        title={actionModal.title}
        message={actionModal.message}
        requireReason={actionModal.requireReason}
        loading={actionLoading}
        confirmText={
          actionModal.action === 'approve' ? 'Approve' :
          actionModal.action === 'reject' ? 'Reject' :
          actionModal.action === 'complete' ? 'Mark Complete' :
          'Cancel Investment'
        }
        confirmColor={
          actionModal.action === 'approve' ? '#28a745' :
          actionModal.action === 'reject' ? '#dc3545' :
          actionModal.action === 'complete' ? '#28a745' :
          '#ff9800'
        }
      />
    </div>
  );
};

export default AdminInvestments;