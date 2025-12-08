// CPApprovalModal.jsx
// =====================================================
// Admin Component: CP Approval Modal
// Approve or reject CP applications
// =====================================================

import React, { useState } from 'react';
import { FiX, FiCheck, FiXCircle } from 'react-icons/fi';
import adminService from '../../../services/adminService';
import '../../../styles/admin/cp/AdminCPComponents.css';

const CPApprovalModal = ({ application, onSubmit, onClose }) => {
  const [decision, setDecision] = useState(null); // 'approve' or 'reject'
  const [notes, setNotes] = useState('');
  const [partnerTier, setPartnerTier] = useState('bronze');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!decision) return;
    
    if (decision === 'reject' && !notes.trim()) {
      setError('Please provide a reason for rejection');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await adminService.cpApplicationAction(application.id, decision, {
        notes: notes,
        partner_tier: decision === 'approve' ? partnerTier : undefined
      });
      
      if (response.success) {
        onSubmit(decision);
      } else {
        setError(response.error || 'Failed to process application');
      }
    } catch (err) {
      setError('Failed to process application');
      console.error('Error processing application:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay-approval" onClick={onClose}>
      <div className="modal-content-approval" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header-approval">
          <h2>Review Application</h2>
          <button className="btn-close-modal-approval" onClick={onClose}>
            <FiX size={24} />
          </button>
        </div>

        {error && (
          <div className="error-banner" style={{ margin: '1rem', padding: '1rem', background: '#f8d7da', color: '#721c24', borderRadius: '8px' }}>
            {error}
          </div>
        )}

        {/* Application Summary */}
        <div className="application-summary">
          <h3>{application.user_name}</h3>
          <div className="summary-details">
            <div><strong>CP Code:</strong> {application.cp_code}</div>
            <div><strong>Type:</strong> {application.agent_type}</div>
            {application.company_name && (
              <div><strong>Company:</strong> {application.company_name}</div>
            )}
            <div><strong>PAN:</strong> {application.pan_number}</div>
          </div>
        </div>

        {/* Decision Buttons */}
        <div className="decision-section">
          <h4>Decision</h4>
          <div className="decision-buttons">
            <button
              className={`decision-btn approve ${decision === 'approve' ? 'active' : ''}`}
              onClick={() => setDecision('approve')}
            >
              <FiCheck size={24} />
              Approve
            </button>
            <button
              className={`decision-btn reject ${decision === 'reject' ? 'active' : ''}`}
              onClick={() => setDecision('reject')}
            >
              <FiXCircle size={24} />
              Reject
            </button>
          </div>
        </div>

        {/* Partner Tier (if approving) */}
        {decision === 'approve' && (
          <div className="tier-selection">
            <h4>Partner Tier</h4>
            <div className="tier-buttons">
              <button
                className={`tier-btn bronze ${partnerTier === 'bronze' ? 'active' : ''}`}
                onClick={() => setPartnerTier('bronze')}
              >
                Bronze
              </button>
              <button
                className={`tier-btn silver ${partnerTier === 'silver' ? 'active' : ''}`}
                onClick={() => setPartnerTier('silver')}
              >
                Silver
              </button>
              <button
                className={`tier-btn gold ${partnerTier === 'gold' ? 'active' : ''}`}
                onClick={() => setPartnerTier('gold')}
              >
                Gold
              </button>
              <button
                className={`tier-btn platinum ${partnerTier === 'platinum' ? 'active' : ''}`}
                onClick={() => setPartnerTier('platinum')}
              >
                Platinum
              </button>
            </div>
          </div>
        )}

        {/* Notes */}
        <div className="notes-section">
          <h4>Notes {decision === 'reject' && <span className="required">*</span>}</h4>
          <textarea
            className="notes-textarea"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={decision === 'reject' ? 'Provide reason for rejection...' : 'Add any notes (optional)...'}
            rows={4}
          />
        </div>

        {/* Actions */}
        <div className="modal-actions-approval">
          <button
            className="btn-cancel-approval"
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            className="btn-submit-approval"
            onClick={handleSubmit}
            disabled={submitting || !decision || (decision === 'reject' && !notes.trim())}
          >
            {submitting ? 'Submitting...' : 'Submit Decision'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CPApprovalModal;
