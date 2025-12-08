// AdminCPApplications.jsx
// =====================================================
// Admin CP Applications Page
// Review and approve/reject CP applications
// =====================================================

import React, { useState, useEffect } from 'react';
import { FiFilter, FiSearch } from 'react-icons/fi';
import CPApplicationCard from '../../../components/admin/cp/CPApplicationCard';
import CPApprovalModal from '../../../components/admin/cp/CPApprovalModal';
import adminService from '../../../services/adminService';
import '../../../styles/admin/cp/AdminCPPages.css';

const AdminCPApplications = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState('pending');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, [statusFilter]); // Refetch when status filter changes

  useEffect(() => {
    applyFilters();
  }, [applications, searchQuery]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const filters = {};
      if (statusFilter !== 'all') {
        filters.status = statusFilter;
      }
      
      const response = await adminService.getCPApplications(filters);
      
      if (response.success) {
        setApplications(response.results);
      } else {
        setError('Failed to load applications');
      }
    } catch (err) {
      setError('Failed to load applications');
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...applications];

    // Search filter (local)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(app => 
        app.user_name?.toLowerCase().includes(query) ||
        app.cp_code?.toLowerCase().includes(query) ||
        app.company_name?.toLowerCase().includes(query) ||
        app.pan_number?.toLowerCase().includes(query) ||
        app.user_email?.toLowerCase().includes(query)
      );
    }

    setFilteredApplications(filtered);
  };

  const handleReview = (application) => {
    setSelectedApplication(application);
    setShowApprovalModal(true);
  };

  const handleApprovalSubmit = async (decision) => {
    // Refresh applications after approval/rejection
    await fetchApplications();
    setShowApprovalModal(false);
    setSelectedApplication(null);
  };

  // Calculate counts
  const pendingCount = applications.filter(a => a.onboarding_status === 'pending').length;
  const inProgressCount = applications.filter(a => a.onboarding_status === 'in_progress').length;
  const completedCount = applications.filter(a => a.onboarding_status === 'completed').length;
  const rejectedCount = applications.filter(a => a.onboarding_status === 'rejected').length;

  return (
    <div className="admin-cp-applications-page">
      <div className="admin-cp-applications-container">
        {/* Header */}
        <div className="admin-applications-header">
          <div>
            <h1>CP Applications</h1>
            <p>Review and approve channel partner applications</p>
          </div>
        </div>

        {/* Stats */}
        <div className="applications-stats">
          <div className="stat-card-admin pending">
            <div className="stat-value-admin">{pendingCount}</div>
            <div className="stat-label-admin">Pending Review</div>
          </div>
          <div className="stat-card-admin progress">
            <div className="stat-value-admin">{inProgressCount}</div>
            <div className="stat-label-admin">In Progress</div>
          </div>
          <div className="stat-card-admin completed">
            <div className="stat-value-admin">{completedCount}</div>
            <div className="stat-label-admin">Approved</div>
          </div>
          <div className="stat-card-admin rejected">
            <div className="stat-value-admin">{rejectedCount}</div>
            <div className="stat-label-admin">Rejected</div>
          </div>
        </div>

        {/* Filters */}
        <div className="applications-controls">
          {/* Status Tabs */}
          <div className="status-tabs-admin">
            <button
              className={`status-tab-admin ${statusFilter === 'all' ? 'active' : ''}`}
              onClick={() => setStatusFilter('all')}
            >
              All ({applications.length})
            </button>
            <button
              className={`status-tab-admin ${statusFilter === 'pending' ? 'active' : ''}`}
              onClick={() => setStatusFilter('pending')}
            >
              Pending ({pendingCount})
            </button>
            <button
              className={`status-tab-admin ${statusFilter === 'in_progress' ? 'active' : ''}`}
              onClick={() => setStatusFilter('in_progress')}
            >
              In Progress ({inProgressCount})
            </button>
            <button
              className={`status-tab-admin ${statusFilter === 'completed' ? 'active' : ''}`}
              onClick={() => setStatusFilter('completed')}
            >
              Approved ({completedCount})
            </button>
            <button
              className={`status-tab-admin ${statusFilter === 'rejected' ? 'active' : ''}`}
              onClick={() => setStatusFilter('rejected')}
            >
              Rejected ({rejectedCount})
            </button>
          </div>

          {/* Search */}
          <div className="search-bar-admin">
            <FiSearch size={20} />
            <input
              type="text"
              placeholder="Search by name, CP code, company, or PAN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="error-banner-admin">
            <span>{error}</span>
            <button onClick={fetchApplications}>Retry</button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="loading-state-admin">
            <div className="spinner-admin"></div>
            <p>Loading applications...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredApplications.length === 0 && !error && (
          <div className="empty-state-admin">
            {searchQuery || statusFilter !== 'all' ? (
              <>
                <FiSearch size={60} color="#cccccc" />
                <h3>No Applications Found</h3>
                <p>Try adjusting your filters or search query</p>
                <button 
                  className="btn-clear-filters-admin"
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('pending');
                  }}
                >
                  Clear Filters
                </button>
              </>
            ) : (
              <>
                <div className="empty-icon-admin">📋</div>
                <h3>No Applications Yet</h3>
                <p>New CP applications will appear here for review</p>
              </>
            )}
          </div>
        )}

        {/* Applications Grid */}
        {!loading && filteredApplications.length > 0 && (
          <div className="applications-grid">
            {filteredApplications.map((application) => (
              <CPApplicationCard
                key={application.id}
                application={application}
                onReview={handleReview}
              />
            ))}
          </div>
        )}
      </div>

      {/* Approval Modal */}
      {showApprovalModal && selectedApplication && (
        <CPApprovalModal
          application={selectedApplication}
          onSubmit={handleApprovalSubmit}
          onClose={() => {
            setShowApprovalModal(false);
            setSelectedApplication(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminCPApplications;