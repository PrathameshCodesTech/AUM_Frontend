// CPProperties.jsx
// =====================================================
// CP Properties Page
// Lists authorized properties with referral links
// =====================================================

import React, { useState, useEffect } from 'react';
import { FiShare2, FiDownload, FiHome } from 'react-icons/fi';
import CPHeader from '../../components/cp/CPHeader';
import CPPropertyCard from '../../components/cp/CPPropertyCard';
import CPReferralShareModal from '../../components/cp/CPReferralShareModal';
import cpPropertyService from '../../services/cpPropertyService';
import '../../styles/cp/CPProperties.css';

const CPProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
  try {
    const result = await cpPropertyService.getAuthorizedProperties();
    
    if (result.success) {
      // Map backend data structure to frontend format
      const mappedProperties = result.data.map(item => ({
        id: item.property_details.id,
        title: item.property_details.name,
        location: item.property_details.location,
        slug: item.property_details.slug,
        price: item.property_details.price_per_unit,
        image: null,
        referralLink: item.referral_link,
        authorizationId: item.id,
        approvalStatus: item.approval_status,
        propertyDetails: item.property_details
      }));
      
      setProperties(mappedProperties);
    } else {
      setError(result.error);
    }
  } catch (err) {
    setError('Failed to load properties');
  } finally {
    setLoading(false);
  }
};

  const handleShare = (property) => {
    setSelectedProperty(property);
    setShowShareModal(true);
  };

  const handleCloseModal = () => {
    setShowShareModal(false);
    setSelectedProperty(null);
  };

  if (loading) {
    return (
      <div className="cp-properties-page">
        <CPHeader />
        <div className="loading-state-dash">
          <div className="loading-spinner">Loading properties...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="cp-properties-page">
      <CPHeader />

      <div className="cp-properties-container">
        {/* Header */}
        <div className="properties-header-cp">
          <div>
            <h1>Authorized Properties</h1>
            <p>Properties you can share with your network</p>
          </div>
          <div className="header-stats">
            <div className="stat-badge">
              <span className="stat-number">{properties.length}</span>
              <span className="stat-label">Properties</span>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="error-banner-cp">
            <span>{error}</span>
            <button onClick={fetchProperties}>Retry</button>
          </div>
        )}

        {/* Empty State */}
        {properties.length === 0 && !loading && !error && (
          <div className="empty-state-cp">
            <FiHome size={60} color="#cccccc" />
            <h3>No Properties Authorized Yet</h3>
            <p>Your admin will authorize properties for you to share with customers.</p>
          </div>
        )}

        {/* Properties Grid */}
        {properties.length > 0 && (
          <div className="properties-grid-cp">
            {properties.map((property) => (
              <CPPropertyCard
                key={property.id}
                property={property}
                onShare={handleShare}
              />
            ))}
          </div>
        )}
      </div>

      {/* Share Modal */}
      {showShareModal && selectedProperty && (
        <CPReferralShareModal
          property={selectedProperty}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default CPProperties;