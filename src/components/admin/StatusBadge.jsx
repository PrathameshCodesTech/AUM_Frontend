import React from 'react';
import '../../styles/admin/StatusBadge.css';

const StatusBadge = ({ status, label }) => {
  const getStatusClass = () => {
    switch (status?.toLowerCase()) {
      case 'verified':
      case 'approved':
      case 'active':
      case 'completed':
      case 'published':
        return 'status-success';
      
      case 'pending':
      case 'under_review':
      case 'draft':
        return 'status-warning';
      
      case 'rejected':
      case 'suspended':
      case 'blocked':
      case 'cancelled':
      case 'archived':
        return 'status-danger';
      
      default:
        return 'status-default';
    }
  };

  const getStatusIcon = () => {
    switch (status?.toLowerCase()) {
      case 'verified':
      case 'approved':
      case 'completed':
        return '✓';
      case 'pending':
      case 'under_review':
        return '⏳';
      case 'rejected':
      case 'cancelled':
        return '✗';
      case 'suspended':
      case 'blocked':
        return '⛔';
      default:
        return '○';
    }
  };

  return (
    <span className={`status-badge ${getStatusClass()}`}>
      <span className="status-icon">{getStatusIcon()}</span>
      {label || status}
    </span>
  );
};

export default StatusBadge;