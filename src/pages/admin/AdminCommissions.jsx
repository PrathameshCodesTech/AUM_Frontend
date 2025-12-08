// AdminCommissions.jsx
import React, { useState, useEffect } from 'react';
import { FiDollarSign, FiCheck, FiSearch, FiFilter } from 'react-icons/fi';
import toast from 'react-hot-toast';
import adminService from '../../services/adminService';
import CommissionPayoutModal from '../../components/admin/CommissionPayoutModal';
import '../../styles/admin/AdminCommissions.css';

const AdminCommissions = () => {
  const [commissions, setCommissions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals
// Modal
const [payoutModal, setPayoutModal] = useState({ show: false, commission: null });
  
  // Bulk selection
  const [selectedCommissions, setSelectedCommissions] = useState([]);

  useEffect(() => {
    fetchCommissions();
    fetchStats();
  }, [filter]);

  const fetchCommissions = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllCommissions(filter !== 'all' ? filter : null);
      
      if (response.success) {
        setCommissions(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching commissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await adminService.getCommissionStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleApproveCommission = async (commissionId) => {
    try {
      const response = await adminService.approveCommission(commissionId);
      
      if (response.success) {
        toast.success('Commission approved');
        fetchCommissions();
        fetchStats();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error('Failed to approve commission');
    }
  };

  const handlePayoutCommission = async (commissionId, paymentReference) => {
    try {
      const response = await adminService.payoutCommission(commissionId, paymentReference);
      
      if (response.success) {
        toast.success('Commission paid');
        fetchCommissions();
        fetchStats();
        setPayoutModal({ show: false, commission: null });
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error('Failed to process payout');
    }
  };

  const handleBulkPayout = async (paymentReference) => {
    if (selectedCommissions.length === 0) {
      toast.error('No commissions selected');
      return;
    }

    try {
      const response = await adminService.bulkPayoutCommissions(
        selectedCommissions,
        paymentReference
      );
      
      if (response.success) {
        toast.success(`${selectedCommissions.length} commissions paid`);
        setSelectedCommissions([]);
        fetchCommissions();
        fetchStats();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error('Failed to process bulk payout');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { class: 'warning', icon: '⏳', text: 'Pending' },
      approved: { class: 'success', icon: '✓', text: 'Approved' },
      paid: { class: 'paid', icon: '💰', text: 'Paid' },
      cancelled: { class: 'danger', icon: '✗', text: 'Cancelled' }
    };
    
    const badge = badges[status] || badges.pending;
    return (
      <span className={`status-badge ${badge.class}`}>
        {badge.icon} {badge.text}
      </span>
    );
  };

  const filteredCommissions = commissions.filter(comm => {
    if (!searchTerm) return true;
    
    return (
      comm.commission_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comm.cp_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comm.cp_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comm.investment_id?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="admin-commissions-page">
      <div className="page-header">
        <div>
          <h1>Commission Management</h1>
          <p>Manage and process CP commissions</p>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="commission-stats-grid">
          <div className="stat-card pending">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <div className="stat-label">Pending ({stats.pending.count})</div>
              <div className="stat-value">{formatCurrency(stats.pending.amount)}</div>
            </div>
          </div>

          <div className="stat-card approved">
            <div className="stat-icon">✓</div>
            <div className="stat-content">
              <div className="stat-label">Approved ({stats.approved.count})</div>
              <div className="stat-value">{formatCurrency(stats.approved.amount)}</div>
            </div>
          </div>

          <div className="stat-card paid">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <div className="stat-label">Paid ({stats.paid.count})</div>
              <div className="stat-value">{formatCurrency(stats.paid.amount)}</div>
            </div>
          </div>

          <div className="stat-card total">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-label">Total Commissions</div>
              <div className="stat-value">{stats.total_commissions}</div>
            </div>
          </div>
        </div>
      )}

      {/* Filters & Search */}
      <div className="commissions-controls">
        <div className="filters">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button 
            className={`filter-btn ${filter === 'approved' ? 'active' : ''}`}
            onClick={() => setFilter('approved')}
          >
            Approved
          </button>
          <button 
            className={`filter-btn ${filter === 'paid' ? 'active' : ''}`}
            onClick={() => setFilter('paid')}
          >
            Paid
          </button>
        </div>

        <div className="search-box">
          <FiSearch />
          <input
            type="text"
            placeholder="Search by Commission ID, CP Code, Investment ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {selectedCommissions.length > 0 && (
          <button
            className="btn-bulk-payout"
            onClick={() => setPayoutModal({ show: true, bulk: true })}
          >
            Pay {selectedCommissions.length} Selected (₹
            {formatCurrency(
              selectedCommissions.reduce((sum, id) => {
                const comm = commissions.find(c => c.id === id);
                return sum + (comm?.net_amount || 0);
              }, 0)
            )})
          </button>
        )}
      </div>

      {/* Commissions Table */}
      {loading ? (
        <div className="loading-state">Loading commissions...</div>
      ) : filteredCommissions.length === 0 ? (
        <div className="empty-state">
          <FiDollarSign size={48} color="#ccc" />
          <h4>No Commissions Found</h4>
          <p>No {filter !== 'all' ? filter : ''} commissions match your search.</p>
        </div>
      ) : (
        <div className="commissions-table-container">
          <table className="commissions-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedCommissions(filteredCommissions.map(c => c.id));
                      } else {
                        setSelectedCommissions([]);
                      }
                    }}
                  />
                </th>
                <th>Commission ID</th>
                <th>CP</th>
                <th>Investment</th>
                <th>Customer</th>
                <th>Property</th>
                <th>Base Amount</th>
                <th>Commission</th>
                <th>Net Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCommissions.map((comm) => (
                <tr key={comm.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedCommissions.includes(comm.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCommissions([...selectedCommissions, comm.id]);
                        } else {
                          setSelectedCommissions(selectedCommissions.filter(id => id !== comm.id));
                        }
                      }}
                    />
                  </td>
                  <td><code>{comm.commission_id}</code></td>
                  <td>
                    <div>{comm.cp_name}</div>
                    <small>{comm.cp_code}</small>
                  </td>
                  <td><code>{comm.investment_id}</code></td>
                  <td>{comm.customer_name}</td>
                  <td className="property-name">{comm.property_name}</td>
                  <td>{formatCurrency(comm.base_amount)}</td>
                  <td className="commission-amount">
                    {formatCurrency(comm.commission_amount)}
                    <small>({comm.commission_rate}%)</small>
                  </td>
                  <td className="net-amount">
                    <strong>{formatCurrency(comm.net_amount)}</strong>
                  </td>
                  <td>{getStatusBadge(comm.status)}</td>
                  <td>
                    {comm.status === 'pending' && (
                      <button
                        className="btn-action approve"
                        onClick={() => handleApproveCommission(comm.id)}
                      >
                        <FiCheck /> Approve
                      </button>
                    )}
                    {comm.status === 'approved' && (
                      <button
                        className="btn-action payout"
                        onClick={() => setPayoutModal({ show: true, commission: comm })}
                      >
                        💰 Pay
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Payout Modal */}
      {payoutModal.show && (
        <CommissionPayoutModal
          commission={payoutModal.commission}
          bulk={payoutModal.bulk}
          selectedCommissions={selectedCommissions}
          onClose={() => setPayoutModal({ show: false, commission: null })}
          onPayout={payoutModal.bulk ? handleBulkPayout : handlePayoutCommission}
        />
      )}
    </div>
  );
};

export default AdminCommissions;