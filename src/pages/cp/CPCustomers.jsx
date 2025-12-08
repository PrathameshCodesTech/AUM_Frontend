// CPCustomers.jsx
// =====================================================
// CP Customers Management Page
// View linked customers with expiry tracking
// =====================================================

import React, { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiAlertCircle } from 'react-icons/fi';
import CPHeader from '../../components/cp/CPHeader';
import CPCustomerCard from '../../components/cp/CPCustomerCard';
import cpService from '../../services/cpService';
import '../../styles/cp/CPCustomers.css';

const CPCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [customers, statusFilter, searchQuery]);

  const fetchCustomers = async () => {
  try {
    setLoading(true);
    const result = await cpService.getCustomers();
    
    if (result.success) {
      // Map backend data structure to frontend format
      const mappedCustomers = result.data.map(item => ({
        id: item.id,
        name: item.customer_details?.full_name || item.customer_details?.username || 'N/A',
        email: item.customer_details?.email || '',
        phone: item.customer_details?.phone || '',
        is_active: item.is_active,
        is_expired: item.is_expired,
        days_remaining: item.days_remaining,
        referral_date: item.referral_date,
        expiry_date: item.expiry_date,
        total_invested: 0,
        pending_commission: 0,
        ...item
      }));
      
      setCustomers(mappedCustomers);
    } else {
      setError(result.error);
    }
  } catch (err) {
    setError('Failed to load customers');
  } finally {
    setLoading(false);
  }
};

  const applyFilters = () => {
    let filtered = [...customers];

    // Status filter
    if (statusFilter === 'active') {
      filtered = filtered.filter(c => c.is_active && !c.is_expired);
    } else if (statusFilter === 'expired') {
      filtered = filtered.filter(c => c.is_expired);
    } else if (statusFilter === 'expiring_soon') {
      filtered = filtered.filter(c => {
        if (!c.days_remaining) return false;
        return c.days_remaining <= 15 && c.days_remaining > 0;
      });
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(customer => 
        customer.name?.toLowerCase().includes(query) ||
        customer.email?.toLowerCase().includes(query) ||
        customer.phone?.includes(query)
      );
    }

    setFilteredCustomers(filtered);
  };

  // Calculate stats
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.is_active && !c.is_expired).length;
  const expiredCustomers = customers.filter(c => c.is_expired).length;
  const expiringSoon = customers.filter(c => {
    if (!c.days_remaining) return false;
    return c.days_remaining <= 15 && c.days_remaining > 0;
  }).length;

  const totalInvested = customers.reduce((sum, c) => sum + (c.total_invested || 0), 0);
  const pendingCommissions = customers.reduce((sum, c) => sum + (c.pending_commission || 0), 0);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="cp-customers-page">
        <CPHeader />
        <div className="loading-state-dash">
          <div className="loading-spinner">Loading customers...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="cp-customers-page">
      <CPHeader />

      <div className="cp-customers-container">
        {/* Header */}
        <div className="customers-header">
          <div>
            <h1>My Customers</h1>
            <p>Track your linked customers and their investments</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="customers-stats-grid">
          <div className="customer-stat-card">
            <div className="stat-icon-customer">👥</div>
            <div className="stat-content-customer">
              <div className="stat-value-customer">{totalCustomers}</div>
              <div className="stat-label-customer">Total Customers</div>
            </div>
          </div>

          <div className="customer-stat-card">
            <div className="stat-icon-customer success">✓</div>
            <div className="stat-content-customer">
              <div className="stat-value-customer success">{activeCustomers}</div>
              <div className="stat-label-customer">Active</div>
            </div>
          </div>

          <div className="customer-stat-card">
            <div className="stat-icon-customer warning">⚠</div>
            <div className="stat-content-customer">
              <div className="stat-value-customer warning">{expiringSoon}</div>
              <div className="stat-label-customer">Expiring Soon</div>
            </div>
          </div>

          <div className="customer-stat-card">
            <div className="stat-icon-customer danger">⏱</div>
            <div className="stat-content-customer">
              <div className="stat-value-customer danger">{expiredCustomers}</div>
              <div className="stat-label-customer">Expired</div>
            </div>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="financial-summary">
          <div className="summary-item-customer">
            <span className="summary-label-customer">Total Invested</span>
            <span className="summary-value-customer success">{formatCurrency(totalInvested)}</span>
          </div>
          <div className="summary-item-customer">
            <span className="summary-label-customer">Pending Commissions</span>
            <span className="summary-value-customer warning">{formatCurrency(pendingCommissions)}</span>
          </div>
        </div>

        {/* Filters */}
        <div className="customers-controls">
          {/* Status Filter */}
          <div className="filter-tabs-customer">
            <button
              className={`filter-tab ${statusFilter === 'all' ? 'active' : ''}`}
              onClick={() => setStatusFilter('all')}
            >
              All ({totalCustomers})
            </button>
            <button
              className={`filter-tab ${statusFilter === 'active' ? 'active' : ''}`}
              onClick={() => setStatusFilter('active')}
            >
              Active ({activeCustomers})
            </button>
            <button
              className={`filter-tab ${statusFilter === 'expiring_soon' ? 'active' : ''}`}
              onClick={() => setStatusFilter('expiring_soon')}
            >
              Expiring Soon ({expiringSoon})
            </button>
            <button
              className={`filter-tab ${statusFilter === 'expired' ? 'active' : ''}`}
              onClick={() => setStatusFilter('expired')}
            >
              Expired ({expiredCustomers})
            </button>
          </div>

          {/* Search Bar */}
          <div className="search-bar-customer">
            <FiSearch size={20} />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Expiring Soon Alert */}
        {expiringSoon > 0 && statusFilter === 'all' && (
          <div className="alert-banner-customer">
            <FiAlertCircle size={24} />
            <div>
              <strong>Action Required!</strong>
              <p>{expiringSoon} customer relationship{expiringSoon > 1 ? 's are' : ' is'} expiring within 15 days. Contact your admin to extend.</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="error-banner-customer">
            <span>{error}</span>
            <button onClick={fetchCustomers}>Retry</button>
          </div>
        )}

        {/* Empty State */}
        {filteredCustomers.length === 0 && !loading && !error && (
          <div className="empty-state-customer">
            {searchQuery || statusFilter !== 'all' ? (
              <>
                <FiSearch size={60} color="#cccccc" />
                <h3>No Customers Found</h3>
                <p>Try adjusting your filters or search query</p>
                <button 
                  className="btn-clear-filters-customer"
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                  }}
                >
                  Clear Filters
                </button>
              </>
            ) : (
              <>
                <div className="empty-icon-customer">👥</div>
                <h3>No Customers Yet</h3>
                <p>Start inviting customers or sharing property referral links to build your network</p>
              </>
            )}
          </div>
        )}

        {/* Customers Grid */}
        {filteredCustomers.length > 0 && (
          <div className="customers-grid">
            {filteredCustomers.map((customer) => (
              <CPCustomerCard
                key={customer.id}
                customer={customer}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CPCustomers;