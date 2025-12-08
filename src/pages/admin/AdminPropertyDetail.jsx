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

  // ========================================
  // DATA FETCHING
  // ========================================

  const fetchPropertyDetail = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await adminService.getPropertyDetail(propertyId);
      
      if (response.success) {
        setProperty(response.data);
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

  // ========================================
  // ACTIONS
  // ========================================

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
          setProperty(response.data);
          setActionModal({ ...actionModal, isOpen: false });
        }
      }
    } catch (error) {
      toast.error(error.message || 'Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  // ========================================
  // HELPER FUNCTIONS
  // ========================================

  const formatCurrency = (amount) => {
    if (!amount) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-IN');
  };

  const formatPercentage = (value) => {
    if (!value) return 'N/A';
    return `${value}%`;
  };

  const formatMonths = (value) => {
    if (!value) return 'N/A';
    return `${value} months`;
  };

  // Calculate minimum shares
  const getMinimumShares = () => {
    if (!property.minimum_investment || !property.price_per_unit) return 'N/A';
    return Math.ceil(property.minimum_investment / property.price_per_unit);
  };

  // Calculate maximum shares
  const getMaximumShares = () => {
    if (!property.maximum_investment || !property.price_per_unit) return 'No Limit';
    return Math.floor(property.maximum_investment / property.price_per_unit);
  };

  // ========================================
  // RENDER HELPERS
  // ========================================

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

  const InfoItem = ({ label, value, fullWidth = false }) => (
    <div className={`info-item-detail ${fullWidth ? 'full-width' : ''}`}>
      <span className="info-label-detail">{label}</span>
      <span className="info-value-detail">{value || 'N/A'}</span>
    </div>
  );

  const InfoSection = ({ title, icon, children }) => (
    <div className="info-section">
      <h3>
        {icon && <span className="section-icon">{renderIcon(icon)}</span>}
        {title}
      </h3>
      <div className="info-grid-detail">
        {children}
      </div>
    </div>
  );

  // ========================================
  // LOADING & ERROR STATES
  // ========================================

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

  // ========================================
  // MAIN RENDER
  // ========================================

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
              {property.is_featured && (
                <span className="featured-badge-large">⭐ Featured Property</span>
              )}
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
          <InfoSection title="Property Details" icon="home">
            <InfoItem label="Builder Name" value={property.builder_name} />
            <InfoItem 
              label="Property Type" 
              value={property.property_type?.replace('_', ' ').toUpperCase()} 
            />
            <InfoItem label="Total Shares" value={property.total_units} />
            <InfoItem 
              label="Available Shares" 
              value={property.available_units || property.units_available} 
            />
            <InfoItem label="Shares Sold" value={property.units_sold || 0} />
            <InfoItem 
              label="Total Area" 
              value={property.total_area ? `${property.total_area} sq ft` : null} 
            />
          </InfoSection>

          {/* Location Details */}
          <InfoSection title="📍 Location">
            <InfoItem label="Address" value={property.address} fullWidth />
            <InfoItem label="Locality" value={property.locality} />
            <InfoItem label="City" value={property.city} />
            <InfoItem label="State" value={property.state} />
            <InfoItem label="Pincode" value={property.pincode} />
          </InfoSection>

          {/* Shares & Pricing */}
          <InfoSection title="Shares & Pricing" icon="money">
            <InfoItem 
              label="Price Per Share" 
              value={formatCurrency(property.price_per_unit)} 
            />
            <InfoItem 
              label="Total Property Value" 
              value={formatCurrency(property.total_value || (property.price_per_unit * property.total_units))} 
            />
            <InfoItem 
              label="Minimum Investment" 
              value={formatCurrency(property.minimum_investment)} 
            />
            <InfoItem 
              label="Minimum Shares" 
              value={getMinimumShares()} 
            />
            <InfoItem 
              label="Maximum Investment" 
              value={property.maximum_investment ? formatCurrency(property.maximum_investment) : 'No Limit'} 
            />
            <InfoItem 
              label="Maximum Shares" 
              value={getMaximumShares()} 
            />
          </InfoSection>

          {/* Funding Status */}
          <InfoSection title="💰 Funding Status" icon="chart">
            <InfoItem 
              label="Target Amount" 
              value={formatCurrency(property.target_amount)} 
            />
            <InfoItem 
              label="Funded Amount" 
              value={formatCurrency(property.funded_amount)} 
            />
            <InfoItem 
              label="Funding Progress" 
              value={property.funding_percentage ? `${property.funding_percentage.toFixed(1)}%` : '0%'} 
            />
            <InfoItem 
              label="Fully Funded" 
              value={property.is_fully_funded ? '✓ Yes' : '✗ No'} 
            />
          </InfoSection>

          {/* Investment Returns */}
          <InfoSection title="Investment Returns & Tenure" icon="chart">
            <InfoItem 
              label="Expected Return %" 
              value={formatPercentage(property.expected_return_percentage)} 
            />
            <InfoItem 
              label="Gross Yield" 
              value={formatPercentage(property.gross_yield)} 
            />
            <InfoItem 
              label="Potential Gain" 
              value={formatPercentage(property.potential_gain)} 
            />
            <InfoItem 
              label="Expected Return Period" 
              value={formatMonths(property.expected_return_period)} 
            />
            <InfoItem 
              label="Lock-in Period" 
              value={formatMonths(property.lock_in_period)} 
            />
            <InfoItem 
              label="Project Duration" 
              value={formatMonths(property.project_duration)} 
            />
          </InfoSection>

          {/* Important Dates */}
          <InfoSection title="📅 Important Dates">
            <InfoItem label="Launch Date" value={formatDate(property.launch_date)} />
            <InfoItem label="Funding Start" value={formatDate(property.funding_start_date)} />
            <InfoItem label="Funding End" value={formatDate(property.funding_end_date)} />
            <InfoItem label="Possession Date" value={formatDate(property.possession_date)} />
          </InfoSection>

          {/* Developer Info */}
          {property.developer_details && (
            <InfoSection title="👤 Developer Information">
              <InfoItem label="Name" value={property.developer_details.username} />
              <InfoItem label="Email" value={property.developer_details.email} />
              <InfoItem label="Phone" value={property.developer_details.phone} />
            </InfoSection>
          )}

          {/* Investment Statistics */}
          {property.investment_stats && (
            <InfoSection title="📊 Investment Statistics">
              <InfoItem 
                label="Total Investments" 
                value={property.investment_stats.total_investments} 
              />
              <InfoItem 
                label="Unique Investors" 
                value={property.investment_stats.unique_investors} 
              />
              <InfoItem 
                label="Total Invested" 
                value={formatCurrency(property.investment_stats.total_invested)} 
              />
              <InfoItem 
                label="Average Investment" 
                value={formatCurrency(property.investment_stats.average_investment)} 
              />
              <InfoItem 
                label="Pending Approvals" 
                value={property.investment_stats.pending_investments} 
              />
              <InfoItem 
                label="Total Shares Purchased" 
                value={property.investment_stats.total_units_purchased} 
              />
            </InfoSection>
          )}

          {/* Timestamps */}
          <InfoSection title="⏰ Activity">
            <InfoItem label="Created On" value={formatDateTime(property.created_at)} />
            <InfoItem label="Last Updated" value={formatDateTime(property.updated_at)} />
            {property.approved_at && (
              <InfoItem label="Approved On" value={formatDateTime(property.approved_at)} />
            )}
          </InfoSection>
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
      {/* <PropertyUnits 
        propertyId={propertyId}
        units={units}
        onUnitsUpdate={refreshUnits}
      /> */}

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