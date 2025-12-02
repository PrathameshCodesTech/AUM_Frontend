import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import adminService from '../../services/adminService';
import kycService from '../../services/kycService';
import StatusBadge from '../../components/admin/StatusBadge';
import ActionModal from '../../components/admin/ActionModal';
import '../../styles/admin/AdminKYC.css';

const AdminKYCDetail = () => {
  const { kycId } = useParams();
  const navigate = useNavigate();
  const [kyc, setKyc] = useState(null);
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
    fetchKYCDetail();
  }, [kycId]);

const fetchKYCDetail = async () => {
  setLoading(true);
  setError(null);
  
  try {
    const response = await adminService.getKYCDetail(kycId);
    
    console.log('🔍 Full API Response:', response);
    console.log('🔍 KYC Data:', response.data);
    console.log('🔍 Aadhaar Number:', response.data?.aadhaar_number);
    console.log('🔍 Account Number:', response.data?.account_number);
    
    if (response.success) {
      setKyc(response.data);
    } else {
      throw new Error(response.message || 'Failed to fetch KYC');
    }
  } catch (error) {
    console.error('❌ Error fetching KYC detail:', error);
    setError(error.message || 'Failed to load KYC details');
    toast.error('Failed to load KYC details');
  } finally {
    setLoading(false);
  }
};

  const openActionModal = (action) => {
    const modalConfig = {
      approve: {
        title: 'Approve KYC',
        message: `Are you sure you want to approve KYC for ${kyc.user?.username}? This will grant them full access to the platform.`,
        requireReason: false
      },
      reject: {
        title: 'Reject KYC',
        message: `Are you sure you want to reject KYC for ${kyc.user?.username}? Please provide a detailed reason.`,
        requireReason: true
      }
    };

    setActionModal({
      isOpen: true,
      action,
      ...modalConfig[action]
    });
  };

  const handleKYCAction = async (reason) => {
    setActionLoading(true);
    
    try {
      const response = await adminService.kycAction(
        kycId,
        actionModal.action,
        reason
      );

      if (response.success) {
        toast.success(response.message);
        setKyc(response.data); // Update with latest data
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
          <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      check: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M9 11L12 14L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      document: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      bank: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M3 21H21M3 10H21M5 6L12 3L19 6M4 10V21M8 10V21M12 10V21M16 10V21M20 10V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    };
    return icons[iconName] || null;
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-loading-spinner">Loading KYC details...</div>
      </div>
    );
  }

  if (error || !kyc) {
    return (
      <div className="admin-error">
        <h3>Failed to Load KYC</h3>
        <p>{error}</p>
        <button className="btn-retry" onClick={fetchKYCDetail}>
          Retry
        </button>
      </div>
    );
  }

  const canApprove = kyc.status === 'pending' || kyc.status === 'under_review';

  return (
    <div className="admin-kyc-detail-page">
      {/* Header */}
      <div className="detail-header">
        <button className="btn-back" onClick={() => navigate('/admin/kyc')}>
          {renderIcon('back')}
          Back to KYC List
        </button>
        
        <div className="detail-actions">
          {canApprove && (
            <>
              <button 
                className="btn-action-detail btn-approve-large" 
                onClick={() => openActionModal('approve')}
              >
                ✓ Approve KYC
              </button>
              <button 
                className="btn-action-detail btn-reject-large" 
                onClick={() => openActionModal('reject')}
              >
                ✗ Reject KYC
              </button>
            </>
          )}
        </div>
      </div>

      {/* User Info Card */}
      <div className="detail-card">
        <div className="card-header">
          <div className="card-header-left">
            <div className="user-avatar-large">
              {kyc.user?.username?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2>{kyc.user?.username || 'N/A'}</h2>
              <p className="user-id">KYC ID: #{kyc.id}</p>
              <p className="user-email">{kyc.user?.email || 'N/A'}</p>
            </div>
          </div>
          <div className="card-header-right">
            <StatusBadge status={kyc.status} />
          </div>
        </div>

        <div className="card-content">
          {/* KYC Status Overview */}
          <div className="info-section">
            <h3>
              <span className="section-icon">{renderIcon('check')}</span>
              KYC Status Overview
            </h3>
            <div className="kyc-checklist-detail">
              <div className={`kyc-check-item-detail ${kyc.aadhaar_verified ? 'verified' : 'pending'}`}>
                <span className="check-icon-detail">
                  {kyc.aadhaar_verified ? '✓' : '○'}
                </span>
                <div className="check-content">
                  <span className="check-label-detail">Aadhaar Verification</span>
                  <span className="check-status">
                    {kyc.aadhaar_verified ? 'Verified' : 'Pending'}
                  </span>
                </div>
              </div>

              <div className={`kyc-check-item-detail ${kyc.pan_verified ? 'verified' : 'pending'}`}>
                <span className="check-icon-detail">
                  {kyc.pan_verified ? '✓' : '○'}
                </span>
                <div className="check-content">
                  <span className="check-label-detail">PAN Verification</span>
                  <span className="check-status">
                    {kyc.pan_verified ? 'Verified' : 'Pending'}
                  </span>
                </div>
              </div>

              <div className={`kyc-check-item-detail ${kyc.bank_verified ? 'verified' : 'optional'}`}>
                <span className="check-icon-detail">
                  {kyc.bank_verified ? '✓' : '○'}
                </span>
                <div className="check-content">
                  <span className="check-label-detail">Bank Verification</span>
                  <span className="check-status">
                    {kyc.bank_verified ? 'Verified' : 'Optional'}
                  </span>
                </div>
              </div>

              <div className={`kyc-check-item-detail ${kyc.pan_aadhaar_linked ? 'verified' : 'warning'}`}>
                <span className="check-icon-detail">
                  {kyc.pan_aadhaar_linked ? '✓' : '⚠'}
                </span>
                <div className="check-content">
                  <span className="check-label-detail">PAN-Aadhaar Link</span>
                  <span className="check-status">
                    {kyc.pan_aadhaar_linked ? 'Linked' : 'Not Linked'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Aadhaar Details */}
{kyc.aadhaar_verified && (
  <div className="info-section">
    <h3>
      <span className="section-icon">{renderIcon('document')}</span>
      Aadhaar Details
    </h3>
    <div className="info-grid-detail">
      <div className="info-item-detail">
        <span className="info-label-detail">Aadhaar Number</span>
        <span className="info-value-detail">
          {kyc.aadhaar_number || 'N/A'}
        </span>
      </div>
      <div className="info-item-detail">
        <span className="info-label-detail">Name</span>
        <span className="info-value-detail">{kyc.aadhaar_name || 'N/A'}</span>
      </div>
      <div className="info-item-detail">
        <span className="info-label-detail">Date of Birth</span>
        <span className="info-value-detail">
          {kyc.aadhaar_dob 
            ? new Date(kyc.aadhaar_dob).toLocaleDateString('en-IN')
            : 'N/A'}
        </span>
      </div>
      <div className="info-item-detail">
        <span className="info-label-detail">Gender</span>
        <span className="info-value-detail">{kyc.aadhaar_gender || 'N/A'}</span>
      </div>
      <div className="info-item-detail full-width">
        <span className="info-label-detail">Address</span>
        <span className="info-value-detail">{kyc.aadhaar_address || 'N/A'}</span>
      </div>
    </div>
  </div>
)}

          {/* PAN Details */}
          {kyc.pan_verified && (
            <div className="info-section">
              <h3>
                <span className="section-icon">{renderIcon('document')}</span>
                PAN Details
              </h3>
              <div className="info-grid-detail">
                <div className="info-item-detail">
                  <span className="info-label-detail">PAN Number</span>
                  <span className="info-value-detail">{kyc.pan_number || 'N/A'}</span>
                </div>
                <div className="info-item-detail">
                  <span className="info-label-detail">Name</span>
                  <span className="info-value-detail">{kyc.pan_name || 'N/A'}</span>
                </div>
                <div className="info-item-detail">
                  <span className="info-label-detail">Date of Birth</span>
                  <span className="info-value-detail">
                    {kyc.pan_dob 
                      ? new Date(kyc.pan_dob).toLocaleDateString('en-IN')
                      : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Bank Details */}
{kyc.bank_verified && (
  <div className="info-section">
    <h3>
      <span className="section-icon">{renderIcon('bank')}</span>
      Bank Details
    </h3>
    <div className="info-grid-detail">
      <div className="info-item-detail">
        <span className="info-label-detail">Account Holder Name</span>
        <span className="info-value-detail">{kyc.account_holder_name || 'N/A'}</span>
      </div>
      <div className="info-item-detail">
        <span className="info-label-detail">Account Number</span>
        <span className="info-value-detail">
          {kyc.account_number || 'N/A'}
        </span>
      </div>
      <div className="info-item-detail">
        <span className="info-label-detail">IFSC Code</span>
        <span className="info-value-detail">{kyc.ifsc_code || 'N/A'}</span>
      </div>
      <div className="info-item-detail">
        <span className="info-label-detail">Bank Name</span>
        <span className="info-value-detail">{kyc.bank_name || 'N/A'}</span>
      </div>
      <div className="info-item-detail">
        <span className="info-label-detail">Account Type</span>
        <span className="info-value-detail">{kyc.account_type || 'N/A'}</span>
      </div>
    </div>
  </div>
)}

          {/* Submission Details */}
          <div className="info-section">
            <h3>Submission Details</h3>
            <div className="info-grid-detail">
              <div className="info-item-detail">
                <span className="info-label-detail">Submitted On</span>
                <span className="info-value-detail">
                  {new Date(kyc.created_at).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="info-item-detail">
                <span className="info-label-detail">Last Updated</span>
                <span className="info-value-detail">
                  {new Date(kyc.updated_at).toLocaleString('en-IN')}
                </span>
              </div>
              {kyc.verified_at && (
                <div className="info-item-detail">
                  <span className="info-label-detail">Verified On</span>
                  <span className="info-value-detail">
                    {new Date(kyc.verified_at).toLocaleString('en-IN')}
                  </span>
                </div>
              )}
              {kyc.verified_by && (
                <div className="info-item-detail">
                  <span className="info-label-detail">Verified By</span>
                  <span className="info-value-detail">
                    {kyc.verified_by.username || 'N/A'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Rejection Info */}
          {kyc.status === 'rejected' && kyc.rejection_reason && (
            <div className="warning-section rejected">
              <h4>⚠ KYC Rejected</h4>
              <p><strong>Reason:</strong> {kyc.rejection_reason}</p>
            </div>
          )}
        </div>
      </div>

      {/* Action Modal */}
      <ActionModal
        isOpen={actionModal.isOpen}
        onClose={() => setActionModal({ ...actionModal, isOpen: false })}
        onConfirm={handleKYCAction}
        title={actionModal.title}
        message={actionModal.message}
        requireReason={actionModal.requireReason}
        loading={actionLoading}
        confirmText={actionModal.action === 'approve' ? 'Approve' : 'Reject'}
        confirmColor={actionModal.action === 'approve' ? '#28a745' : '#dc3545'}
      />
    </div>
  );
};

export default AdminKYCDetail;