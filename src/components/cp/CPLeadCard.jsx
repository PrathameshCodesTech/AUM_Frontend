// CPLeadCard.jsx
// =====================================================
// CP Lead Card Component
// Displays lead info with edit/delete/convert actions
// =====================================================

import React, { useState } from 'react';
import { FiEdit2, FiTrash2, FiPhone, FiMail, FiCheckCircle, FiClock } from 'react-icons/fi';
import cpLeadService from '../../services/cpLeadService';
import '../../styles/cp/CPLeadCard.css';

const CPLeadCard = ({ lead, onEdit, onDelete, onConvert }) => {
  const [converting, setConverting] = useState(false);

  const handleConvert = async () => {
    if (!window.confirm('Convert this lead to a customer? This action cannot be undone.')) {
      return;
    }

    try {
      setConverting(true);
      const result = await cpLeadService.convertLead(lead.id);
      
      if (result.success) {
        alert('Lead converted successfully!');
        if (onConvert) {
          onConvert(lead.id);
        }
      } else {
        alert(result.error || 'Failed to convert lead');
      }
    } catch (err) {
      alert('Failed to convert lead');
    } finally {
      setConverting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = cpLeadService.getStatusColor;

  return (
    <div className="cp-lead-card">
      {/* Status Badge */}
      <div className="lead-status-header">
        <span 
          className="lead-status-badge"
          style={{ 
            background: getStatusColor(lead.lead_status),
            color: 'white'
          }}
        >
          {lead.lead_status.replace(/_/g, ' ').toUpperCase()}
        </span>
        <div className="lead-actions-menu">
          {lead.lead_status !== 'converted' && lead.lead_status !== 'lost' && (
            <>
              <button
                className="action-btn-lead edit"
                onClick={() => onEdit(lead)}
                title="Edit lead"
              >
                <FiEdit2 size={16} />
              </button>
              <button
                className="action-btn-lead delete"
                onClick={() => onDelete(lead.id)}
                title="Delete lead"
              >
                <FiTrash2 size={16} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Lead Info */}
      <div className="lead-info-section">
        <h3 className="lead-name">{lead.name}</h3>
        
        <div className="lead-contact-info">
          {lead.phone && (
            <div className="contact-item">
              <FiPhone size={14} />
              <a href={`tel:${lead.phone}`}>{lead.phone}</a>
            </div>
          )}
          {lead.email && (
            <div className="contact-item">
              <FiMail size={14} />
              <a href={`mailto:${lead.email}`}>{lead.email}</a>
            </div>
          )}
        </div>

        {lead.property_interested && (
          <div className="property-interest">
            <span className="interest-label">Interested in:</span>
            <span className="interest-value">{lead.property_interested}</span>
          </div>
        )}

        {lead.notes && (
          <div className="lead-notes">
            <p>{lead.notes}</p>
          </div>
        )}
      </div>

      {/* Timeline Info */}
      <div className="lead-timeline">
        <div className="timeline-item-lead">
          <FiClock size={14} />
          <span>Created: {formatDate(lead.created_at)}</span>
        </div>
        {lead.last_contact_date && (
          <div className="timeline-item-lead">
            <FiCheckCircle size={14} />
            <span>Last contact: {formatDate(lead.last_contact_date)}</span>
          </div>
        )}
      </div>

      {/* Convert Button */}
      {lead.lead_status !== 'converted' && lead.lead_status !== 'lost' && (
        <button
          className="btn-convert-lead"
          onClick={handleConvert}
          disabled={converting}
        >
          {converting ? 'Converting...' : 'Convert to Customer'}
        </button>
      )}

      {/* Converted Badge */}
      {lead.lead_status === 'converted' && lead.converted_at && (
        <div className="converted-badge">
          <FiCheckCircle size={16} />
          <span>Converted on {formatDate(lead.converted_at)}</span>
        </div>
      )}
    </div>
  );
};

export default CPLeadCard;