// CPApplicationStatus.jsx
// =====================================================
// CP Application Status Page
// Check status of CP application
// =====================================================

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiCheck, FiClock, FiX, FiAlertCircle } from 'react-icons/fi';
import CPHeader from '../../components/cp/CPHeader';
import cpApplicationService from '../../services/cpApplicationService';
import '../../styles/cp/CPApplicationStatus.css';

const CPApplicationStatus = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState(null);
  const [error, setError] = useState(null);
  const [isNewApplication, setIsNewApplication] = useState(false);

  useEffect(() => {
    // Check if redirected from application submission
    if (location.state?.isNew) {
      setIsNewApplication(true);
      setApplication(location.state.applicationData);
      setLoading(false);
    } else {
      fetchApplicationStatus();
    }
  }, []);

  const fetchApplicationStatus = async () => {
    try {
      const result = await cpApplicationService.checkStatus();
      
      if (result.success && result.hasApplication) {
        setApplication(result.data);
      } else {
        setError('No application found');
      }
    } catch (err) {
      setError('Failed to fetch application status');
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      'pending': {
        icon: <FiClock size={40} />,
        color: '#ffc107',
        label: 'Pending Review',
        message: 'Your application is under review. We\'ll notify you once it\'s processed.'
      },
      'in_progress': {
        icon: <FiAlertCircle size={40} />,
        color: '#007bff',
        label: 'In Progress',
        message: 'Your application is being processed by our team.'
      },
      'completed': {
        icon: <FiCheck size={40} />,
        color: '#28a745',
        label: 'Approved',
        message: 'Congratulations! Your application has been approved. You can now access the CP dashboard.'
      },
      'rejected': {
        icon: <FiX size={40} />,
        color: '#dc3545',
        label: 'Rejected',
        message: 'Unfortunately, your application has been rejected. Please contact support for more information.'
      }
    };

    return statusMap[status] || statusMap['pending'];
  };

  if (loading) {
    return (
      <div className="cp-application-status-page">
        <CPHeader />
        <div className="loading-state-dash">
          <div className="loading-spinner">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cp-application-status-page">
        <CPHeader />
        <div className="status-container">
          <div className="no-application">
            <FiAlertCircle size={60} color="#6c757d" />
            <h2>No Application Found</h2>
            <p>You haven't submitted a Channel Partner application yet.</p>
            <button
              className="btn-apply"
              onClick={() => navigate('/cp/apply')}
            >
              Apply Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(application.onboarding_status);

  return (
    <div className="cp-application-status-page">
      <CPHeader />

      <div className="status-container">
        {/* Success Message (if new application) */}
        {isNewApplication && (
          <div className="success-banner">
            <FiCheck size={24} />
            <div>
              <h3>Application Submitted Successfully!</h3>
              <p>We've received your application and will review it shortly.</p>
            </div>
          </div>
        )}

        {/* Status Card */}
        <div className="status-card">
          <div 
            className="status-icon"
            style={{ color: statusInfo.color }}
          >
            {statusInfo.icon}
          </div>
          
          <h2 className="status-label">{statusInfo.label}</h2>
          <p className="status-message">{statusInfo.message}</p>

          {/* Application Details */}
          <div className="application-details">
            <div className="detail-row">
              <span className="detail-label">CP Code:</span>
              <span className="detail-value">{application.cp_code}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Application Date:</span>
              <span className="detail-value">
                {new Date(application.created_at).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Agent Type:</span>
              <span className="detail-value">
                {application.agent_type.charAt(0).toUpperCase() + application.agent_type.slice(1)}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Partner Tier:</span>
              <span className="detail-value badge-tier">
                {application.partner_tier.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="status-actions">
            {application.onboarding_status === 'completed' && application.is_verified && (
              <button
                className="btn-dashboard"
                onClick={() => navigate('/cp/dashboard')}
              >
                Go to Dashboard
              </button>
            )}
            {application.onboarding_status === 'pending' && (
              <button
                className="btn-secondary-status"
                onClick={() => navigate('/dashboard')}
              >
                Back to Home
              </button>
            )}
            {application.onboarding_status === 'rejected' && (
              <button
                className="btn-contact"
                onClick={() => navigate('/contact')}
              >
                Contact Support
              </button>
            )}
          </div>
        </div>

        {/* Timeline */}
        <div className="status-timeline">
          <h3>Application Timeline</h3>
          <div className="timeline">
            <div className={`timeline-item ${application.created_at ? 'completed' : ''}`}>
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <h4>Application Submitted</h4>
                <p>{new Date(application.created_at).toLocaleString('en-IN')}</p>
              </div>
            </div>

            <div className={`timeline-item ${application.onboarding_status !== 'pending' ? 'completed' : ''}`}>
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <h4>Under Review</h4>
                <p>{application.onboarding_status === 'pending' ? 'Waiting...' : 'Reviewed'}</p>
              </div>
            </div>

            <div className={`timeline-item ${application.is_verified ? 'completed' : ''}`}>
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <h4>Approved</h4>
                <p>
                  {application.verified_at 
                    ? new Date(application.verified_at).toLocaleString('en-IN')
                    : 'Pending approval'
                  }
                </p>
              </div>
            </div>

            <div className={`timeline-item ${application.is_active ? 'completed' : ''}`}>
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <h4>Active</h4>
                <p>{application.is_active ? 'CP account active' : 'Waiting for activation'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CPApplicationStatus;