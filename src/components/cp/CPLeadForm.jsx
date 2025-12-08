// CPLeadForm.jsx
// =====================================================
// CP Lead Form Component
// Modal form for creating/editing leads
// =====================================================

import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import cpLeadService from '../../services/cpLeadService';
import '../../styles/cp/CPLeadForm.css';

const CPLeadForm = ({ lead = null, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    property_interested: '',
    status: 'new',
    notes: '',
    last_contact_date: ''
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (lead) {
      setFormData({
        name: lead.name || '',
        email: lead.email || '',
        phone: lead.phone || '',
        property_interested: lead.property_interested || '',
        status: lead.status || 'new',
        notes: lead.notes || '',
        last_contact_date: lead.last_contact_date || ''
      });
    }
  }, [lead]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.phone.replace(/[\s-]/g, ''))) {
      newErrors.phone = 'Invalid phone number';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      await onSubmit(formData);
    } catch (err) {
      alert('Failed to save lead');
    } finally {
      setSubmitting(false);
    }
  };

  const statusOptions = cpLeadService.getStatusOptions();

  return (
    <div className="modal-overlay-lead" onClick={onClose}>
      <div className="modal-content-lead" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header-lead">
          <h2>{lead ? 'Edit Lead' : 'Add New Lead'}</h2>
          <button className="btn-close-modal-lead" onClick={onClose}>
            <FiX size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="lead-form">
          {/* Name */}
          <div className="form-group-lead">
            <label className="form-label-lead">Name *</label>
            <input
              type="text"
              className={`form-input-lead ${errors.name ? 'error' : ''}`}
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter full name"
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          {/* Phone */}
          <div className="form-group-lead">
            <label className="form-label-lead">Phone *</label>
            <input
              type="tel"
              className={`form-input-lead ${errors.phone ? 'error' : ''}`}
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="Enter phone number"
            />
            {errors.phone && <span className="error-text">{errors.phone}</span>}
          </div>

          {/* Email */}
          <div className="form-group-lead">
            <label className="form-label-lead">Email (Optional)</label>
            <input
              type="email"
              className={`form-input-lead ${errors.email ? 'error' : ''}`}
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="Enter email address"
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          {/* Property Interested */}
          <div className="form-group-lead">
            <label className="form-label-lead">Property Interested In</label>
            <input
              type="text"
              className="form-input-lead"
              value={formData.property_interested}
              onChange={(e) => handleChange('property_interested', e.target.value)}
              placeholder="Enter property name"
            />
          </div>

          {/* Status */}
          <div className="form-group-lead">
            <label className="form-label-lead">Status</label>
            <select
              className="form-select-lead"
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Last Contact Date */}
          <div className="form-group-lead">
            <label className="form-label-lead">Last Contact Date</label>
            <input
              type="date"
              className="form-input-lead"
              value={formData.last_contact_date}
              onChange={(e) => handleChange('last_contact_date', e.target.value)}
            />
          </div>

          {/* Notes */}
          <div className="form-group-lead full-width">
            <label className="form-label-lead">Notes</label>
            <textarea
              className="form-textarea-lead"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Add any additional notes about this lead..."
              rows={4}
            />
          </div>

          {/* Actions */}
          <div className="form-actions-lead">
            <button
              type="button"
              className="btn-cancel-lead"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-submit-lead"
              disabled={submitting}
            >
              {submitting ? 'Saving...' : lead ? 'Update Lead' : 'Add Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CPLeadForm;