import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import adminService from '../../services/adminService';
import StatusBadge from '../../components/admin/StatusBadge';
import ActionModal from '../../components/admin/ActionModal';
import PropertyImageGallery from '../../components/admin/PropertyImageGallery';
import PropertyDocuments from '../../components/admin/PropertyDocuments';
import PropertyUnits from '../../components/admin/PropertyUnits';
import '../../styles/admin/AdminProperties.css';

const AdminPropertyDetail = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [images, setImages] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [units, setUnits] = useState([]);

  // Action modal
  const [actionModal, setActionModal] = useState({
    isOpen: false,
    action: null,
    title: '',
    message: ''
  });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchPropertyDetail();
  }, [propertyId]);

  const fetchPropertyDetail = async () => {
  setLoading(true);
  setError(null);
  
  try {
    const response = await adminService.getPropertyDetail(propertyId);
    
    if (response.success) {
      setProperty(response.data);
      
      // Set nested data
      setImages(response.data.images || []);
      setDocuments(response.data.documents || []);
      setUnits(response.data.units || []);
    } else {
      throw new Error(response.message || 'Failed to fetch property');
    }
  } catch (error) {
    console.error('❌ Error fetching property detail:', error);
    setError(error.message || 'Failed to load property details');
    toast.error('Failed to load property details');
  } finally {
    setLoading(false);
  }
};

const refreshImages = async () => {
  try {
    const response = await adminService.getPropertyImages(propertyId);
    if (response.success) {
      setImages(response.results);
    }
  } catch (error) {
    console.error('❌ Error refreshing images:', error);
  }
};

const refreshDocuments = async () => {
  try {
    const response = await adminService.getPropertyDocuments(propertyId);
    if (response.success) {
      setDocuments(response.results);
    }
  } catch (error) {
    console.error('❌ Error refreshing documents:', error);
  }
};

const refreshUnits = async () => {
  try {
    const response = await adminService.getPropertyUnits(propertyId);
    if (response.success) {
      setUnits(response.results);
    }
  } catch (error) {
    console.error('❌ Error refreshing units:', error);
  }
};

  const openActionModal = (action) => {
    const modalConfig = {
      publish: {
        title: 'Publish Property',
        message: `Are you sure you want to publish "${property.name}"?`
      },
      unpublish: {
        title: 'Unpublish Property',
        message: `Are you sure you want to unpublish "${property.name}"?`
      },
      archive: {
        title: 'Archive Property',
        message: `Are you sure you want to archive "${property.name}"?`
      },
      feature: {
        title: 'Feature Property',
        message: `Mark "${property.name}" as featured?`
      },
      unfeature: {
        title: 'Remove Featured',
        message: `Remove featured status from "${property.name}"?`
      },
      delete: {
        title: 'Delete Property',
        message: `Are you sure you want to delete "${property.name}"? This action cannot be undone.`
      }
    };

    setActionModal({
      isOpen: true,
      action,
      ...modalConfig[action]
    });
  };

  const handlePropertyAction = async () => {
    setActionLoading(true);

    try {
      let response;

      if (actionModal.action === 'delete') {
        response = await adminService.deleteProperty(propertyId);
        if (response.success) {
          toast.success(response.message);
          navigate('/admin/properties');
          return;
        }
      } else {
        response = await adminService.propertyAction(propertyId, actionModal.action);
        if (response.success) {
          toast.success(response.message);
          setProperty(response.data); // Update with latest data
          setActionModal({ ...actionModal, isOpen: false });
        }
      }
    } catch (error) {
      toast.error(error.message || 'Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const renderIcon = (iconName) => {
    const icons = {
      back: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      edit: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M18.5 2.50023C18.8978 2.1024 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.1024 21.5 2.50023C21.8978 2.89805 22.1213 3.43762 22.1213 4.00023C22.1213 4.56284 21.8978 5.1024 21.5 5.50023L12 15.0002L8 16.0002L9 12.0002L18.5 2.50023Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      home: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" />
        </svg>
      ),
      money: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
          <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
      chart: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M18 20V10M12 20V4M6 20V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    };
    return icons[iconName] || null;
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-loading-spinner">Loading property details...</div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="admin-error">
        <h3>Failed to Load Property</h3>
        <p>{error}</p>
        <button className="btn-retry" onClick={fetchPropertyDetail}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="admin-property-detail-page">
      {/* Header */}
      <div className="detail-header">
        <button className="btn-back" onClick={() => navigate('/admin/properties')}>
          {renderIcon('back')}
          Back to Properties
        </button>

        <div className="detail-actions">
          <button
            className="btn-action-detail btn-edit-large"
            onClick={() => navigate(`/admin/properties/${propertyId}/edit`)}
          >
            {renderIcon('edit')}
            Edit Property
          </button>

          {property.status === 'draft' && (
            <button
              className="btn-action-detail btn-publish"
              onClick={() => openActionModal('publish')}
            >
              ✓ Publish
            </button>
          )}

          {property.status === 'published' && (
            <button
              className="btn-action-detail btn-unpublish"
              onClick={() => openActionModal('unpublish')}
            >
              ⏸ Unpublish
            </button>
          )}

          {!property.is_featured ? (
            <button
              className="btn-action-detail btn-feature"
              onClick={() => openActionModal('feature')}
            >
              ⭐ Feature
            </button>
          ) : (
            <button
              className="btn-action-detail btn-unfeature"
              onClick={() => openActionModal('unfeature')}
            >
              Remove Feature
            </button>
          )}

          <button
            className="btn-action-detail btn-delete"
            onClick={() => openActionModal('delete')}
          >
            🗑 Delete
          </button>
        </div>
      </div>

      {/* Property Info Card */}
      <div className="detail-card">
        <div className="card-header">
          <div className="card-header-left">
            <div>
              <h2>{property.name}</h2>
              <p className="property-location">
                📍 {property.address}, {property.city}
                {property.state && `, ${property.state}`}
              </p>
              {property.is_featured && <span className="featured-badge-large">⭐ Featured Property</span>}
            </div>
          </div>
          <div className="card-header-right">
            <StatusBadge status={property.status} />
          </div>
        </div>

        <div className="card-content">
          {/* Description */}
          {property.description && (
            <div className="info-section">
              <h3>Description</h3>
              <p className="property-description">{property.description}</p>
            </div>
          )}

          {/* Property Details */}
          <div className="info-section">
            <h3>
              <span className="section-icon">{renderIcon('home')}</span>
              Property Details
            </h3>
            <div className="info-grid-detail">
              <div className="info-item-detail">
                <span className="info-label-detail">Builder Name</span>
                <span className="info-value-detail">{property.builder_name || 'N/A'}</span>
              </div>
              <div className="info-item-detail">
                <span className="info-label-detail">Property Type</span>
                <span className="info-value-detail">
                  {property.property_type?.replace('_', ' ').toUpperCase() || 'N/A'}
                </span>
              </div>
              <div className="info-item-detail">
                <span className="info-label-detail">Total Units</span>
                <span className="info-value-detail">{property.total_units || 'N/A'}</span>
              </div>
              <div className="info-item-detail">
                <span className="info-label-detail">Available Units</span>
                <span className="info-value-detail">{property.units_available || property.available_units || 'N/A'}</span>
              </div>
              <div className="info-item-detail">
                <span className="info-label-detail">Units Sold</span>
                <span className="info-value-detail">{property.units_sold || 0}</span>
              </div>
              <div className="info-item-detail">
                <span className="info-label-detail">Total Area</span>
                <span className="info-value-detail">
                  {property.total_area ? `${property.total_area} sq ft` : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Location Details */}
          <div className="info-section">
            <h3>📍 Location</h3>
            <div className="info-grid-detail">
              <div className="info-item-detail full-width">
                <span className="info-label-detail">Address</span>
                <span className="info-value-detail">{property.address || 'N/A'}</span>
              </div>
              <div className="info-item-detail">
                <span className="info-label-detail">Locality</span>
                <span className="info-value-detail">{property.locality || 'N/A'}</span>
              </div>
              <div className="info-item-detail">
                <span className="info-label-detail">City</span>
                <span className="info-value-detail">{property.city || 'N/A'}</span>
              </div>
              <div className="info-item-detail">
                <span className="info-label-detail">State</span>
                <span className="info-value-detail">{property.state || 'N/A'}</span>
              </div>
              <div className="info-item-detail">
                <span className="info-label-detail">Pincode</span>
                <span className="info-value-detail">{property.pincode || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="info-section">
            <h3>
              <span className="section-icon">{renderIcon('money')}</span>
              Pricing & Funding
            </h3>
            <div className="info-grid-detail">
              <div className="info-item-detail">
                <span className="info-label-detail">Price Per Unit</span>
                <span className="info-value-detail">{formatCurrency(property.price_per_unit)}</span>
              </div>
              <div className="info-item-detail">
                <span className="info-label-detail">Total Value</span>
                <span className="info-value-detail">{formatCurrency(property.total_value)}</span>
              </div>
              <div className="info-item-detail">
                <span className="info-label-detail">Min Investment</span>
                <span className="info-value-detail">{formatCurrency(property.minimum_investment)}</span>
              </div>
              <div className="info-item-detail">
                <span className="info-label-detail">Max Investment</span>
                <span className="info-value-detail">
                  {property.maximum_investment ? formatCurrency(property.maximum_investment) : 'No Limit'}
                </span>
              </div>
              <div className="info-item-detail">
                <span className="info-label-detail">Target Amount</span>
                <span className="info-value-detail">{formatCurrency(property.target_amount)}</span>
              </div>
              <div className="info-item-detail">
                <span className="info-label-detail">Funded Amount</span>
                <span className="info-value-detail">{formatCurrency(property.funded_amount)}</span>
              </div>
              <div className="info-item-detail">
                <span className="info-label-detail">Funding Progress</span>
                <span className="info-value-detail">
                  {property.funding_percentage ? `${property.funding_percentage.toFixed(1)}%` : '0%'}
                </span>
              </div>
              <div className="info-item-detail">
                <span className="info-label-detail">Fully Funded</span>
                <span className="info-value-detail">
                  {property.is_fully_funded ? '✓ Yes' : '✗ No'}
                </span>
              </div>
            </div>
          </div>

          {/* Investment Returns */}
          <div className="info-section">
            <h3>
              <span className="section-icon">{renderIcon('chart')}</span>
              Investment Returns & Tenure
            </h3>
            <div className="info-grid-detail">
              <div className="info-item-detail">
                <span className="info-label-detail">Expected Return %</span>
                <span className="info-value-detail">
                  {property.expected_return_percentage ? `${property.expected_return_percentage}%` : 'N/A'}
                </span>
              </div>
              <div className="info-item-detail">
                <span className="info-label-detail">Gross Yield</span>
                <span className="info-value-detail">
                  {property.gross_yield ? `${property.gross_yield}%` : 'N/A'}
                </span>
              </div>
              <div className="info-item-detail">
                <span className="info-label-detail">Potential Gain</span>
                <span className="info-value-detail">
                  {property.potential_gain ? `${property.potential_gain}%` : 'N/A'}
                </span>
              </div>
              <div className="info-item-detail">
                <span className="info-label-detail">Expected Return Period</span>
                <span className="info-value-detail">
                  {property.expected_return_period ? `${property.expected_return_period} months` : 'N/A'}
                </span>
              </div>
              <div className="info-item-detail">
                <span className="info-label-detail">Lock-in Period</span>
                <span className="info-value-detail">
                  {property.lock_in_period ? `${property.lock_in_period} months` : 'N/A'}
                </span>
              </div>
              <div className="info-item-detail">
                <span className="info-label-detail">Project Duration</span>
                <span className="info-value-detail">
                  {property.project_duration ? `${property.project_duration} months` : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Important Dates */}
          <div className="info-section">
            <h3>📅 Important Dates</h3>
            <div className="info-grid-detail">
              <div className="info-item-detail">
                <span className="info-label-detail">Launch Date</span>
                <span className="info-value-detail">
                  {property.launch_date
                    ? new Date(property.launch_date).toLocaleDateString('en-IN')
                    : 'N/A'}
                </span>
              </div>
              <div className="info-item-detail">
                <span className="info-label-detail">Funding Start</span>
                <span className="info-value-detail">
                  {property.funding_start_date
                    ? new Date(property.funding_start_date).toLocaleDateString('en-IN')
                    : 'N/A'}
                </span>
              </div>
              <div className="info-item-detail">
                <span className="info-label-detail">Funding End</span>
                <span className="info-value-detail">
                  {property.funding_end_date
                    ? new Date(property.funding_end_date).toLocaleDateString('en-IN')
                    : 'N/A'}
                </span>
              </div>
              <div className="info-item-detail">
                <span className="info-label-detail">Possession Date</span>
                <span className="info-value-detail">
                  {property.possession_date
                    ? new Date(property.possession_date).toLocaleDateString('en-IN')
                    : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Developer Info */}
          {property.developer_details && (
            <div className="info-section">
              <h3>👤 Developer Information</h3>
              <div className="info-grid-detail">
                <div className="info-item-detail">
                  <span className="info-label-detail">Name</span>
                  <span className="info-value-detail">{property.developer_details.username}</span>
                </div>
                <div className="info-item-detail">
                  <span className="info-label-detail">Email</span>
                  <span className="info-value-detail">{property.developer_details.email}</span>
                </div>
                <div className="info-item-detail">
                  <span className="info-label-detail">Phone</span>
                  <span className="info-value-detail">{property.developer_details.phone || 'N/A'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Investment Statistics */}
          {property.investment_stats && (
            <div className="info-section">
              <h3>📊 Investment Statistics</h3>
              <div className="info-grid-detail">
                <div className="info-item-detail">
                  <span className="info-label-detail">Total Investments</span>
                  <span className="info-value-detail">{property.investment_stats.total_investments}</span>
                </div>
                <div className="info-item-detail">
                  <span className="info-label-detail">Unique Investors</span>
                  <span className="info-value-detail">{property.investment_stats.unique_investors}</span>
                </div>
                <div className="info-item-detail">
                  <span className="info-label-detail">Total Invested</span>
                  <span className="info-value-detail">
                    {formatCurrency(property.investment_stats.total_invested)}
                  </span>
                </div>
                <div className="info-item-detail">
                  <span className="info-label-detail">Average Investment</span>
                  <span className="info-value-detail">
                    {formatCurrency(property.investment_stats.average_investment)}
                  </span>
                </div>
                <div className="info-item-detail">
                  <span className="info-label-detail">Pending Approvals</span>
                  <span className="info-value-detail">{property.investment_stats.pending_investments}</span>
                </div>
              </div>
            </div>
          )}

          {/* Pricing */}
          <div className="info-section">
            <h3>
              <span className="section-icon">{renderIcon('money')}</span>
              Pricing
            </h3>
            <div className="info-grid-detail">
              <div className="info-item-detail">
                <span className="info-label-detail">Price Per Unit</span>
                <span className="info-value-detail">{formatCurrency(property.price_per_unit)}</span>
              </div>
              <div className="info-item-detail">
                <span className="info-label-detail">Total Price</span>
                <span className="info-value-detail">{formatCurrency(property.total_price)}</span>
              </div>
            </div>
          </div>

          {/* Investment Returns */}
          <div className="info-section">
            <h3>
              <span className="section-icon">{renderIcon('chart')}</span>
              Investment Returns
            </h3>
            <div className="info-grid-detail">
              <div className="info-item-detail">
                <span className="info-label-detail">Expected IRR</span>
                <span className="info-value-detail">
                  {property.expected_irr ? `${property.expected_irr}%` : 'N/A'}
                </span>
              </div>
              <div className="info-item-detail">
                <span className="info-label-detail">Target Hold Period</span>
                <span className="info-value-detail">
                  {property.target_hold_period ? `${property.target_hold_period} months` : 'N/A'}
                </span>
              </div>
              <div className="info-item-detail">
                <span className="info-label-detail">Potential Gain</span>
                <span className="info-value-detail">
                  {property.potential_gain ? `${property.potential_gain}%` : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="info-section">
            <h3>Activity</h3>
            <div className="info-grid-detail">
              <div className="info-item-detail">
                <span className="info-label-detail">Created On</span>
                <span className="info-value-detail">
                  {new Date(property.created_at).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="info-item-detail">
                <span className="info-label-detail">Last Updated</span>
                <span className="info-value-detail">
                  {new Date(property.updated_at).toLocaleString('en-IN')}
                </span>
              </div>
              {property.published_at && (
                <div className="info-item-detail">
                  <span className="info-label-detail">Published On</span>
                  <span className="info-value-detail">
                    {new Date(property.published_at).toLocaleString('en-IN')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

       {/* Image Gallery */}
      <PropertyImageGallery 
        propertyId={propertyId}
        images={images}
        onImagesUpdate={refreshImages}
      />

      {/* Documents */}
      <PropertyDocuments 
        propertyId={propertyId}
        documents={documents}
        onDocumentsUpdate={refreshDocuments}
      />

      {/* Units */}
      <PropertyUnits 
        propertyId={propertyId}
        units={units}
        onUnitsUpdate={refreshUnits}
      />


      {/* Action Modal */}
      <ActionModal
        isOpen={actionModal.isOpen}
        onClose={() => setActionModal({ ...actionModal, isOpen: false })}
        onConfirm={handlePropertyAction}
        title={actionModal.title}
        message={actionModal.message}
        loading={actionLoading}
        confirmColor={actionModal.action === 'delete' ? '#dc3545' : '#000000'}
      />
    </div>
  );
};

export default AdminPropertyDetail;