// AdminCPAuthorizeModal.jsx
// =====================================================
// Modal for authorizing properties to a CP
// =====================================================

import React, { useState, useEffect } from 'react';
import { FiX, FiSearch, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import adminService from '../../../services/adminService';
import '../../../styles/admin/cp/AdminCPAuthorizeModal.css';

const AdminCPAuthorizeModal = ({ 
  cpId, 
  cpCode, 
  currentlyAuthorizedPropertyIds = [],
  onClose, 
  onSuccess 
}) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPropertyIds, setSelectedPropertyIds] = useState([]);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllPropertiesForAuthorization();
      
      if (response.success) {
        setProperties(response.results);
      } else {
        toast.error('Failed to load properties');
      }
    } catch (err) {
      toast.error('Failed to load properties');
      console.error('Error fetching properties:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleProperty = (propertyId) => {
    setSelectedPropertyIds(prev => 
      prev.includes(propertyId)
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const handleSelectAll = () => {
    const availableIds = properties
      .filter(p => !currentlyAuthorizedPropertyIds.includes(p.id))
      .map(p => p.id);
    
    if (selectedPropertyIds.length === availableIds.length) {
      setSelectedPropertyIds([]);
    } else {
      setSelectedPropertyIds(availableIds);
    }
  };

  const handleSubmit = async () => {
    if (selectedPropertyIds.length === 0) {
      toast.error('Please select at least one property');
      return;
    }

    try {
      setSubmitting(true);
      const response = await adminService.authorizePropertiesToCP(cpId, selectedPropertyIds);
      
      if (response.success) {
        toast.success(response.message);
        onSuccess();
      } else {
        toast.error(response.error);
      }
    } catch (err) {
      toast.error('Failed to authorize properties');
      console.error('Error authorizing properties:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProperties = properties.filter(property => {
    const query = searchQuery.toLowerCase();
    return (
      property.name?.toLowerCase().includes(query) ||
      property.property_code?.toLowerCase().includes(query) ||
      property.location?.toLowerCase().includes(query)
    );
  });

  const availableProperties = filteredProperties.filter(
    p => !currentlyAuthorizedPropertyIds.includes(p.id)
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="admin-cp-authorize-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div>
            <h2>Authorize Properties</h2>
            <p>Select properties for CP: <strong>{cpCode}</strong></p>
          </div>
          <button className="btn-close" onClick={onClose}>
            <FiX size={24} />
          </button>
        </div>

        {/* Search */}
        <div className="modal-search">
          <FiSearch size={20} />
          <input
            type="text"
            placeholder="Search properties by name, code, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Select All */}
        {availableProperties.length > 0 && (
          <div className="select-all-section">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={selectedPropertyIds.length === availableProperties.length}
                onChange={handleSelectAll}
              />
              <span>
                Select All ({selectedPropertyIds.length} of {availableProperties.length} selected)
              </span>
            </label>
          </div>
        )}

        {/* Properties List */}
        <div className="modal-content">
          {loading ? (
            <div className="loading-state-modal">
              <div className="spinner"></div>
              <p>Loading properties...</p>
            </div>
          ) : availableProperties.length === 0 ? (
            <div className="empty-state-modal">
              {searchQuery ? (
                <>
                  <FiSearch size={48} color="#ccc" />
                  <h4>No Properties Found</h4>
                  <p>Try adjusting your search query</p>
                </>
              ) : (
                <>
                  <FiCheckCircle size={48} color="#4ade80" />
                  <h4>All Properties Authorized</h4>
                  <p>This CP already has access to all available properties</p>
                </>
              )}
            </div>
          ) : (
            <div className="properties-grid-modal">
              {availableProperties.map((property) => (
                <div 
                  key={property.id} 
                  className={`property-card-modal ${selectedPropertyIds.includes(property.id) ? 'selected' : ''}`}
                  onClick={() => handleToggleProperty(property.id)}
                >
                  <div className="property-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedPropertyIds.includes(property.id)}
                      onChange={() => handleToggleProperty(property.id)}
                    />
                  </div>
                  
                  <div className="property-info">
                    <h4>{property.name}</h4>
                    <p className="property-code">{property.property_code}</p>
                    <p className="property-location">{property.location}</p>
                    <div className="property-meta">
                      <span className="property-price">
                        ₹{Number(property.price_per_unit || 0).toLocaleString()}
                      </span>
                      <span className="property-units">
                        {property.available_units}/{property.total_units} available
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button 
            className="btn-authorize"
            onClick={handleSubmit}
            disabled={submitting || selectedPropertyIds.length === 0}
          >
            {submitting ? 'Authorizing...' : `Authorize ${selectedPropertyIds.length} ${selectedPropertyIds.length === 1 ? 'Property' : 'Properties'}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminCPAuthorizeModal;