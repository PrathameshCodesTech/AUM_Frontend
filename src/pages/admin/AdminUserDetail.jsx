import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import adminService from '../../services/adminService';
import StatusBadge from '../../components/admin/StatusBadge';
import ActionModal from '../../components/admin/ActionModal';
import '../../styles/admin/AdminUserDetail.css';

const AdminUserDetail = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [actionModal, setActionModal] = useState({
    isOpen: false,
    action: null,
    title: '',
    message: '',
    requireReason: false
  });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchUserDetail();
  }, [userId]);

  const fetchUserDetail = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await adminService.getUserDetail(userId);

      if (response.success) {
        setUser(response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch user');
      }
    } catch (error) {
      console.error('❌ Error fetching user detail:', error);
      setError(error.message || 'Failed to load user details');
      toast.error('Failed to load user details');
    } finally {
      setLoading(false);
    }
  };

  const openActionModal = (action) => {
    const modalConfig = {
      verify: {
        title: 'Verify User',
        message: `Are you sure you want to verify ${user.username}?`,
        requireReason: false
      },
      suspend: {
        title: 'Suspend User',
        message: `Are you sure you want to suspend ${user.username}? They will not be able to access their account.`,
        requireReason: true
      },
      unsuspend: {
        title: 'Unsuspend User',
        message: `Are you sure you want to unsuspend ${user.username}?`,
        requireReason: false
      },
      block: {
        title: 'Block User',
        message: `Are you sure you want to block ${user.username}? This is a serious action.`,
        requireReason: true
      },
      unblock: {
        title: 'Unblock User',
        message: `Are you sure you want to unblock ${user.username}?`,
        requireReason: false
      }
    };

    setActionModal({
      isOpen: true,
      action,
      ...modalConfig[action]
    });
  };

  const handleUserAction = async (reason) => {
    setActionLoading(true);

    try {
      const response = await adminService.userAction(
        userId,
        actionModal.action,
        reason
      );

      if (response.success) {
        toast.success(response.message);
        setUser(response.data); // Update user with latest data
        setActionModal({ ...actionModal, isOpen: false });
      }
    } catch (error) {
      toast.error(error.message || 'Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  const renderIcon = (iconName) => {
    const icons = {
      back: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      user: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" />
          <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
        </svg>
      ),
      kyc: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
          <circle cx="9" cy="11" r="2" stroke="currentColor" strokeWidth="2" />
          <path d="M6 16C6 14.5 7.5 13 9 13C10.5 13 12 14.5 12 16" stroke="currentColor" strokeWidth="2" />
        </svg>
      ),
      wallet: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M21 12V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V12Z" stroke="currentColor" strokeWidth="2" />
          <path d="M21 12H17C15.8954 12 15 12.8954 15 14C15 15.1046 15.8954 16 17 16H21" stroke="currentColor" strokeWidth="2" />
        </svg>
      ),
      investments: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M23 6L13.5 15.5L8.5 10.5L1 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
    };
    return icons[iconName] || null;
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-loading-spinner">Loading user details...</div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="admin-error">
        <h3>Failed to Load User</h3>
        <p>{error}</p>
        <button className="btn-retry" onClick={fetchUserDetail}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="admin-user-detail-page">
      {/* Header */}
      <div className="detail-header">
        <button className="btn-back" onClick={() => navigate('/admin/users')}>
          {renderIcon('back')}
          Back to Users
        </button>

        <div className="detail-actions">
          {!user.is_verified && (
            <button className="btn-action-detail btn-verify" onClick={() => openActionModal('verify')}>
              ✓ Verify User
            </button>
          )}

          {!user.is_suspended ? (
            <button className="btn-action-detail btn-suspend" onClick={() => openActionModal('suspend')}>
              ⏸ Suspend
            </button>
          ) : (
            <button className="btn-action-detail btn-unsuspend" onClick={() => openActionModal('unsuspend')}>
              ▶ Unsuspend
            </button>
          )}

          {!user.is_blocked ? (
            <button className="btn-action-detail btn-block" onClick={() => openActionModal('block')}>
              ⛔ Block
            </button>
          ) : (
            <button className="btn-action-detail btn-unblock" onClick={() => openActionModal('unblock')}>
              ✓ Unblock
            </button>
          )}
        </div>
      </div>

      {/* User Profile Card */}
      <div className="detail-card">
        <div className="card-header">
          <div className="card-header-left">
            <div className="user-avatar-large">
              {user.username?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2>{user.username}</h2>
              <p className="user-id">User ID: #{user.id}</p>
            </div>
          </div>
          <div className="card-header-right">
            <StatusBadge
              status={user.is_verified ? 'verified' : 'pending'}
              label={user.is_verified ? 'Verified' : 'Not Verified'}
            />
            <StatusBadge
              status={user.is_suspended ? 'suspended' : 'active'}
              label={user.is_suspended ? 'Suspended' : 'Active'}
            />
          </div>
        </div>

        <div className="card-content">
          <div className="info-section">
            <h3>
              <span className="section-icon">{renderIcon('user')}</span>
              Personal Information
            </h3>
            <div className="info-grid-detail">
              <div className="info-item-detail">
                <span className="info-label-detail">Full Name</span>
                <span className="info-value-detail">{user.username || 'N/A'}</span>
              </div>
              <div className="info-item-detail">
                <span className="info-label-detail">Email</span>
                <span className="info-value-detail">{user.email || 'N/A'}</span>
              </div>
              <div className="info-item-detail">
                <span className="info-label-detail">Phone</span>
                <span className="info-value-detail">{user.phone || 'N/A'}</span>
              </div>
              <div className="info-item-detail">
                <span className="info-label-detail">Date of Birth</span>
                <span className="info-value-detail">
                  {user.date_of_birth
                    ? new Date(user.date_of_birth).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })
                    : 'N/A'}
                </span>
              </div>
              <div className="info-item-detail">
                <span className="info-label-detail">Citizenship</span>
                <span className="info-value-detail">
                  {user.is_indian === true ? '🇮🇳 Indian' :
                    user.is_indian === false ? '🌍 Non-Indian' :
                      'Not Specified'}
                </span>
              </div>
              <div className="info-item-detail">
                <span className="info-label-detail">Role</span>
                <span className="info-value-detail">{user.role?.name || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="info-section">
            <h3>
              <span className="section-icon">{renderIcon('kyc')}</span>
              KYC Information
            </h3>

            {user.kyc_details ? (
              <>
                {/* Status Overview */}
                <div className="info-grid-detail">
                  <div className="info-item-detail">
                    <span className="info-label-detail">Overall Status</span>
                    <span className="info-value-detail">
                      <StatusBadge status={user.kyc_details.status} />
                    </span>
                  </div>
                  <div className="info-item-detail">
                    <span className="info-label-detail">Submission Date</span>
                    <span className="info-value-detail">
                      {new Date(user.kyc_details.created_at).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Aadhaar Details */}
                {user.kyc_details.aadhaar_verified && (
                  <>
                    <h4 className="subsection-title">Aadhaar Details</h4>
                    <div className="info-grid-detail">
                      <div className="info-item-detail">
                        <span className="info-label-detail">Aadhaar Number</span>
                        <span className="info-value-detail">{user.kyc_details.aadhaar_number || 'N/A'}</span>
                      </div>
                      <div className="info-item-detail">
                        <span className="info-label-detail">Name on Aadhaar</span>
                        <span className="info-value-detail">{user.kyc_details.aadhaar_name || 'N/A'}</span>
                      </div>
                      <div className="info-item-detail">
                        <span className="info-label-detail">DOB (Aadhaar)</span>
                        <span className="info-value-detail">
                          {user.kyc_details.aadhaar_dob
                            ? new Date(user.kyc_details.aadhaar_dob).toLocaleDateString('en-IN')
                            : 'N/A'}
                        </span>
                      </div>
                      <div className="info-item-detail">
                        <span className="info-label-detail">Gender</span>
                        <span className="info-value-detail">{user.kyc_details.aadhaar_gender || 'N/A'}</span>
                      </div>
                      <div className="info-item-detail full-width">
                        <span className="info-label-detail">Address</span>
                        <span className="info-value-detail">{user.kyc_details.aadhaar_address || 'N/A'}</span>
                      </div>
                    </div>
                  </>
                )}

                {/* PAN Details */}
                {user.kyc_details.pan_verified && (
                  <>
                    <h4 className="subsection-title">PAN Details</h4>
                    <div className="info-grid-detail">
                      <div className="info-item-detail">
                        <span className="info-label-detail">PAN Number</span>
                        <span className="info-value-detail">{user.kyc_details.pan_number || 'N/A'}</span>
                      </div>
                      <div className="info-item-detail">
                        <span className="info-label-detail">Name on PAN</span>
                        <span className="info-value-detail">{user.kyc_details.pan_name || 'N/A'}</span>
                      </div>
                      <div className="info-item-detail">
                        <span className="info-label-detail">DOB (PAN)</span>
                        <span className="info-value-detail">
                          {user.kyc_details.pan_dob
                            ? new Date(user.kyc_details.pan_dob).toLocaleDateString('en-IN')
                            : 'N/A'}
                        </span>
                      </div>
                      <div className="info-item-detail">
                        <span className="info-label-detail">PAN-Aadhaar Linked</span>
                        <span className="info-value-detail">
                          {user.kyc_details.pan_aadhaar_linked ? '✓ Yes' : '✗ No'}
                        </span>
                      </div>
                    </div>
                  </>
                )}

                {/* Bank Details */}
                {user.kyc_details.bank_verified && (
                  <>
                    <h4 className="subsection-title">Bank Details</h4>
                    <div className="info-grid-detail">
                      <div className="info-item-detail">
                        <span className="info-label-detail">Account Holder</span>
                        <span className="info-value-detail">{user.kyc_details.account_holder_name || 'N/A'}</span>
                      </div>
                      <div className="info-item-detail">
                        <span className="info-label-detail">Account Number</span>
                        <span className="info-value-detail">{user.kyc_details.account_number || 'N/A'}</span>
                      </div>
                      <div className="info-item-detail">
                        <span className="info-label-detail">IFSC Code</span>
                        <span className="info-value-detail">{user.kyc_details.ifsc_code || 'N/A'}</span>
                      </div>
                      <div className="info-item-detail">
                        <span className="info-label-detail">Bank Name</span>
                        <span className="info-value-detail">{user.kyc_details.bank_name || 'N/A'}</span>
                      </div>
                    </div>
                  </>
                )}

                {/* Verification Status */}
                <h4 className="subsection-title">Verification Status</h4>
                <div className="kyc-checklist-detail">
                  <div className={`kyc-check-item-detail ${user.kyc_details.aadhaar_verified ? 'verified' : 'pending'}`}>
                    <span className="check-icon-detail">
                      {user.kyc_details.aadhaar_verified ? '✓' : '○'}
                    </span>
                    <span className="check-label-detail">Aadhaar Verified</span>
                  </div>
                  <div className={`kyc-check-item-detail ${user.kyc_details.pan_verified ? 'verified' : 'pending'}`}>
                    <span className="check-icon-detail">
                      {user.kyc_details.pan_verified ? '✓' : '○'}
                    </span>
                    <span className="check-label-detail">PAN Verified</span>
                  </div>
                  <div className={`kyc-check-item-detail ${user.kyc_details.bank_verified ? 'verified' : 'optional'}`}>
                    <span className="check-icon-detail">
                      {user.kyc_details.bank_verified ? '✓' : '○'}
                    </span>
                    <span className="check-label-detail">Bank Verified</span>
                  </div>
                  <div className={`kyc-check-item-detail ${user.kyc_details.pan_aadhaar_linked ? 'verified' : 'warning'}`}>
                    <span className="check-icon-detail">
                      {user.kyc_details.pan_aadhaar_linked ? '✓' : '⚠'}
                    </span>
                    <span className="check-label-detail">PAN-Aadhaar Linked</span>
                  </div>
                </div>

                {/* Rejection Info */}
                {user.kyc_details.status === 'rejected' && user.kyc_details.rejection_reason && (
                  <div className="warning-section rejected">
                    <h4>⚠ KYC Rejected</h4>
                    <p><strong>Reason:</strong> {user.kyc_details.rejection_reason}</p>
                  </div>
                )}
              </>
            ) : (
              <div className="info-grid-detail">
                <div className="info-item-detail">
                  <span className="info-label-detail">KYC Status</span>
                  <span className="info-value-detail">Not Started</span>
                </div>
              </div>
            )}
          </div>

          <div className="info-section">
            <h3>Account Activity</h3>
            <div className="info-grid-detail">
              <div className="info-item-detail">
                <span className="info-label-detail">Date Joined</span>
                <span className="info-value-detail">
                  {new Date(user.date_joined).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
              </div>
              <div className="info-item-detail">
                <span className="info-label-detail">Last Login</span>
                <span className="info-value-detail">
                  {user.last_login
                    ? new Date(user.last_login).toLocaleString('en-IN')
                    : 'Never'}
                </span>
              </div>
              <div className="info-item-detail">
                <span className="info-label-detail">Email Verified</span>
                <span className="info-value-detail">
                  {user.is_verified ? '✓ Yes' : '✗ No'}
                </span>
              </div>
            </div>
          </div>

          {/* Suspension/Block Info */}
          {user.is_suspended && (
            <div className="warning-section suspended">
              <h4>⚠ User Suspended</h4>
              <p><strong>Reason:</strong> {user.suspended_reason || 'No reason provided'}</p>
              {user.suspended_at && (
                <p><strong>Suspended On:</strong> {new Date(user.suspended_at).toLocaleString('en-IN')}</p>
              )}
            </div>
          )}

          {user.is_blocked && (
            <div className="warning-section blocked">
              <h4>⛔ User Blocked</h4>
              <p><strong>Reason:</strong> {user.blocked_reason || 'No reason provided'}</p>
              {user.blocked_at && (
                <p><strong>Blocked On:</strong> {new Date(user.blocked_at).toLocaleString('en-IN')}</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="user-stats-grid">
        <div className="stat-card-detail">
          <span className="stat-icon-detail">{renderIcon('wallet')}</span>
          <div className="stat-content-detail">
            <span className="stat-label-detail">Wallet Balance</span>
            <span className="stat-value-detail">₹0</span>
          </div>
        </div>
        <div className="stat-card-detail">
          <span className="stat-icon-detail">{renderIcon('investments')}</span>
          <div className="stat-content-detail">
            <span className="stat-label-detail">Total Investments</span>
            <span className="stat-value-detail">0</span>
          </div>
        </div>
        <div className="stat-card-detail">
          <span className="stat-icon-detail">{renderIcon('investments')}</span>
          <div className="stat-content-detail">
            <span className="stat-label-detail">Total Invested</span>
            <span className="stat-value-detail">₹0</span>
          </div>
        </div>
      </div>

      {/* Action Modal */}
      <ActionModal
        isOpen={actionModal.isOpen}
        onClose={() => setActionModal({ ...actionModal, isOpen: false })}
        onConfirm={handleUserAction}
        title={actionModal.title}
        message={actionModal.message}
        requireReason={actionModal.requireReason}
        loading={actionLoading}
      />
    </div>
  );
};

export default AdminUserDetail;