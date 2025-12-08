// AdminCPCreate.jsx
// =====================================================
// Admin Create CP Page - Accordion Style Form
// =====================================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiChevronDown, FiChevronUp, FiSave, FiUser, FiPackage } from 'react-icons/fi';
import toast from 'react-hot-toast';
import adminService from '../../../services/adminService';
import '../../../styles/admin/cp/AdminCPCreate.css';

const AdminCPCreate = () => {
  const navigate = useNavigate();
  
  // Accordion state
  const [expandedSections, setExpandedSections] = useState({
    identity: true,
    program: false,
    authorization: false,
    operational: false,
    targets: false,
    bank: false,
  });
  
  // Form state
  const [formData, setFormData] = useState({
    // User Details
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    
    // CP Identity
    agent_type: 'individual',
    source: 'direct',
    company_name: '',
    pan_number: '',
    gst_number: '',
    rera_number: '',
    business_address: '',
    
    // Program Enrolment
    partner_tier: 'bronze',
    program_start_date: '',
    program_end_date: '',
    
    // Operational Setup
    dedicated_support_contact: '',
    technical_setup_notes: '',
    
    // Targets
    monthly_target: 0,
    quarterly_target: 0,
    yearly_target: 0,
    
    // Bank Details
    bank_name: '',
    account_number: '',
    ifsc_code: '',
    account_holder_name: '',
    
    // Authorization
    property_ids: [],
    
    // Auto-approve
    auto_approve: true,
  });
  
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllPropertiesForAuthorization();
      if (response.success) {
        setProperties(response.results);
      }
    } catch (err) {
      console.error('Error fetching properties:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePropertyToggle = (propertyId) => {
    setFormData(prev => ({
      ...prev,
      property_ids: prev.property_ids.includes(propertyId)
        ? prev.property_ids.filter(id => id !== propertyId)
        : [...prev.property_ids, propertyId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.first_name || !formData.last_name || !formData.email || !formData.phone) {
      toast.error('Please fill all required fields');
      return;
    }
    
    // Format phone number
    let phone = formData.phone.replace(/\D/g, '');
    if (phone.length === 10) {
      phone = `+91${phone}`;
    } else if (phone.startsWith('91') && phone.length === 12) {
      phone = `+${phone}`;
    } else if (!phone.startsWith('+91')) {
      phone = `+91${phone}`;
    }
    
    try {
      setSubmitting(true);
      
      const submitData = {
        ...formData,
        phone: phone,
        // Convert string numbers to actual numbers
        monthly_target: parseFloat(formData.monthly_target) || 0,
        quarterly_target: parseFloat(formData.quarterly_target) || 0,
        yearly_target: parseFloat(formData.yearly_target) || 0,
      };
      
      const response = await adminService.createCP(submitData);
      
      if (response.success) {
        toast.success(response.message);
        
        // Show credentials modal
        setCreatedCredentials(response.credentials);
        setShowCredentials(true);
        
        // Redirect after 10 seconds or when modal is closed
        setTimeout(() => {
          navigate(`/admin/cp/${response.data.id}/detail`);
        }, 10000);
      } else {
        toast.error(response.error || 'Failed to create CP');
        if (response.errors) {
          console.error('Validation errors:', response.errors);
        }
      }
    } catch (err) {
      toast.error('Failed to create CP');
      console.error('Error creating CP:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const renderAccordionSection = (sectionKey, title, icon, content) => {
    const isExpanded = expandedSections[sectionKey];
    
    return (
      <div className={`accordion-section ${isExpanded ? 'expanded' : ''}`}>
        <div 
          className="accordion-header"
          onClick={() => toggleSection(sectionKey)}
        >
          <div className="accordion-title">
            {icon}
            <h3>{title}</h3>
          </div>
          {isExpanded ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
        </div>
        
        {isExpanded && (
          <div className="accordion-content">
            {content}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="admin-cp-create-page">
      <div className="admin-cp-create-container">
        {/* Header */}
        <div className="create-cp-header">
          <button className="btn-back" onClick={() => navigate('/admin/cp')}>
            <FiArrowLeft size={20} />
            Back to CPs
          </button>
          <h1>Create New Channel Partner</h1>
          <p>Fill in the details to manually create a CP account</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Channel Partner Identity */}
          {renderAccordionSection(
            'identity',
            'Channel Partner Identity',
            <FiUser size={20} />,
            <div className="form-grid">
              <div className="form-group full-width">
                <h4>Personal Details</h4>
              </div>
              
              <div className="form-group">
                <label>First Name <span className="required">*</span></label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  placeholder="Enter first name"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Last Name <span className="required">*</span></label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  placeholder="Enter last name"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Email <span className="required">*</span></label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="email@example.com"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Phone <span className="required">*</span></label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="9876543210"
                  required
                />
                <small>10-digit Indian mobile number</small>
              </div>
              
              <div className="form-group">
                <label>Password (Optional)</label>
                <input
                  type="text"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Auto-generated if left blank"
                />
                <small>Min 8 characters. Leave blank for auto-generation.</small>
              </div>
              
              <div className="form-group full-width">
                <h4>Business Details</h4>
              </div>
              
              <div className="form-group">
                <label>Agent Type</label>
                <select
                  name="agent_type"
                  value={formData.agent_type}
                  onChange={handleInputChange}
                >
                  <option value="individual">Individual</option>
                  <option value="company">Company</option>
                  <option value="franchise">Franchise</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Source</label>
                <select
                  name="source"
                  value={formData.source}
                  onChange={handleInputChange}
                >
                  <option value="direct">Direct</option>
                  <option value="referral">Referral</option>
                  <option value="website">Website</option>
                  <option value="advertisement">Advertisement</option>
                  <option value="event">Event</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              {formData.agent_type === 'company' && (
                <div className="form-group full-width">
                  <label>Company Name <span className="required">*</span></label>
                  <input
                    type="text"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleInputChange}
                    placeholder="Enter company name"
                    required={formData.agent_type === 'company'}
                  />
                </div>
              )}
              
              <div className="form-group">
                <label>PAN Number</label>
                <input
                  type="text"
                  name="pan_number"
                  value={formData.pan_number}
                  onChange={handleInputChange}
                  placeholder="ABCDE1234F"
                  maxLength={10}
                />
              </div>
              
              <div className="form-group">
                <label>GST Number</label>
                <input
                  type="text"
                  name="gst_number"
                  value={formData.gst_number}
                  onChange={handleInputChange}
                  placeholder="22AAAAA0000A1Z5"
                  maxLength={15}
                />
              </div>
              
              <div className="form-group">
                <label>RERA Number</label>
                <input
                  type="text"
                  name="rera_number"
                  value={formData.rera_number}
                  onChange={handleInputChange}
                  placeholder="RERA registration number"
                />
              </div>
              
              <div className="form-group full-width">
                <label>Business Address</label>
                <textarea
                  name="business_address"
                  value={formData.business_address}
                  onChange={handleInputChange}
                  placeholder="Enter business/office address"
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* Program Enrolment */}
          {renderAccordionSection(
            'program',
            'Program Enrolment',
            <FiPackage size={20} />,
            <div className="form-grid">
              <div className="form-group">
                <label>Partner Tier</label>
                <select
                  name="partner_tier"
                  value={formData.partner_tier}
                  onChange={handleInputChange}
                >
                  <option value="bronze">Bronze</option>
                  <option value="silver">Silver</option>
                  <option value="gold">Gold</option>
                  <option value="platinum">Platinum</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Auto-Approve & Activate</label>
                <div className="checkbox-wrapper">
                  <input
                    type="checkbox"
                    name="auto_approve"
                    checked={formData.auto_approve}
                    onChange={handleInputChange}
                  />
                  <span>Immediately activate CP account</span>
                </div>
              </div>
              
              <div className="form-group">
                <label>Program Start Date</label>
                <input
                  type="date"
                  name="program_start_date"
                  value={formData.program_start_date}
                  onChange={handleInputChange}
                />
                <small>Leave blank to use today's date</small>
              </div>
              
              <div className="form-group">
                <label>Program End Date (Optional)</label>
                <input
                  type="date"
                  name="program_end_date"
                  value={formData.program_end_date}
                  onChange={handleInputChange}
                />
                <small>Leave blank for ongoing program</small>
              </div>
            </div>
          )}

          {/* Product Authorization */}
          {renderAccordionSection(
            'authorization',
            'Product Authorization',
            <FiPackage size={20} />,
            <div className="form-section">
              <p className="section-description">
                Select properties this CP is authorized to sell. This can also be done later from the CP detail page.
              </p>
              
              {loading ? (
                <div className="loading-state-small">
                  <div className="spinner-small"></div>
                  <p>Loading properties...</p>
                </div>
              ) : properties.length === 0 ? (
                <div className="empty-state-small">
                  <p>No properties available</p>
                </div>
              ) : (
                <div className="properties-checkbox-grid">
                  {properties.map((property) => (
                    <div key={property.id} className="property-checkbox-item">
                      <input
                        type="checkbox"
                        id={`property-${property.id}`}
                        checked={formData.property_ids.includes(property.id)}
                        onChange={() => handlePropertyToggle(property.id)}
                      />
                      <label htmlFor={`property-${property.id}`}>
                        <strong>{property.name}</strong>
                        <span className="property-location">{property.city}</span>
                      </label>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="selected-count">
                {formData.property_ids.length} {formData.property_ids.length === 1 ? 'property' : 'properties'} selected
              </div>
            </div>
          )}

          {/* Operational Setup */}
          {renderAccordionSection(
            'operational',
            'Operational Setup',
            <FiPackage size={20} />,
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Dedicated Support Contact</label>
                <input
                  type="text"
                  name="dedicated_support_contact"
                  value={formData.dedicated_support_contact}
                  onChange={handleInputChange}
                  placeholder="Support person name/phone"
                />
              </div>
              
              <div className="form-group full-width">
                <label>Technical Setup Notes</label>
                <textarea
                  name="technical_setup_notes"
                  value={formData.technical_setup_notes}
                  onChange={handleInputChange}
                  placeholder="Any technical setup instructions or notes"
                  rows={4}
                />
              </div>
            </div>
          )}

          {/* Target & Scorecard */}
          {renderAccordionSection(
            'targets',
            'Target & Scorecard',
            <FiPackage size={20} />,
            <div className="form-grid">
              <div className="form-group">
                <label>Monthly Target (₹)</label>
                <input
                  type="number"
                  name="monthly_target"
                  value={formData.monthly_target}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  step="1000"
                />
              </div>
              
              <div className="form-group">
                <label>Quarterly Target (₹)</label>
                <input
                  type="number"
                  name="quarterly_target"
                  value={formData.quarterly_target}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  step="1000"
                />
              </div>
              
              <div className="form-group">
                <label>Yearly Target (₹)</label>
                <input
                  type="number"
                  name="yearly_target"
                  value={formData.yearly_target}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  step="1000"
                />
              </div>
            </div>
          )}

          {/* Bank Details */}
          {renderAccordionSection(
            'bank',
            'Bank Details (Optional)',
            <FiPackage size={20} />,
            <div className="form-grid">
              <div className="form-group">
                <label>Bank Name</label>
                <input
                  type="text"
                  name="bank_name"
                  value={formData.bank_name}
                  onChange={handleInputChange}
                  placeholder="e.g., HDFC Bank"
                />
              </div>
              
              <div className="form-group">
                <label>Account Holder Name</label>
                <input
                  type="text"
                  name="account_holder_name"
                  value={formData.account_holder_name}
                  onChange={handleInputChange}
                  placeholder="As per bank account"
                />
              </div>
              
              <div className="form-group">
                <label>Account Number</label>
                <input
                  type="text"
                  name="account_number"
                  value={formData.account_number}
                  onChange={handleInputChange}
                  placeholder="Enter account number"
                />
              </div>
              
              <div className="form-group">
                <label>IFSC Code</label>
                <input
                  type="text"
                  name="ifsc_code"
                  value={formData.ifsc_code}
                  onChange={handleInputChange}
                  placeholder="HDFC0001234"
                  maxLength={11}
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate('/admin/cp')}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <div className="spinner-button"></div>
                  Creating CP...
                </>
              ) : (
                <>
                  <FiSave size={18} />
                  Create Channel Partner
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Credentials Modal */}
      {showCredentials && createdCredentials && (
        <div className="modal-overlay" onClick={() => setShowCredentials(false)}>
          <div className="credentials-modal" onClick={(e) => e.stopPropagation()}>
            <h2>✅ CP Created Successfully!</h2>
            <p className="modal-subtitle">Login credentials have been generated. Please save these details:</p>
            
            <div className="credentials-box">
              <div className="credential-item">
                <label>Username (Phone):</label>
                <code>{createdCredentials.username}</code>
              </div>
              <div className="credential-item">
                <label>Password:</label>
                <code className="password">{createdCredentials.password}</code>
              </div>
              <div className="credential-item">
                <label>Email:</label>
                <code>{createdCredentials.email}</code>
              </div>
            </div>
            
            <div className="modal-warning">
              ⚠️ <strong>Important:</strong> Save these credentials now. The password will not be shown again.
            </div>
            
            <div className="modal-actions">
              <button
                className="btn-copy"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `Username: ${createdCredentials.username}\nPassword: ${createdCredentials.password}\nEmail: ${createdCredentials.email}`
                  );
                  toast.success('Credentials copied to clipboard!');
                }}
              >
                Copy Credentials
              </button>
              <button
                className="btn-close-modal"
                onClick={() => {
                  setShowCredentials(false);
                  navigate(`/admin/cp`);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCPCreate;