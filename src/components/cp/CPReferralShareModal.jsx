// CPReferralShareModal.jsx
// =====================================================
// Referral Share Modal
// Social media sharing + copy link functionality
// =====================================================

import React, { useState, useEffect } from 'react';
import { FiX, FiCopy, FiCheck } from 'react-icons/fi';
import { FaWhatsapp, FaFacebook, FaTwitter, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import cpPropertyService from '../../services/cpPropertyService';
import '../../styles/cp/CPReferralShareModal.css';

const CPReferralShareModal = ({ property, onClose }) => {
  const [referralLink, setReferralLink] = useState('');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReferralLink();
  }, [property.id]);

  const fetchReferralLink = async () => {
    try {
      const result = await cpPropertyService.getReferralLink(property.id);
      
      if (result.success) {
        setReferralLink(result.data.property_referral_link);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to generate referral link');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await cpPropertyService.copyToClipboard(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert('Failed to copy link');
    }
  };

  const handleWhatsApp = () => {
    cpPropertyService.shareViaWhatsApp(referralLink, property.title);
  };

  const handleFacebook = () => {
    cpPropertyService.shareViaFacebook(referralLink);
  };

  const handleTwitter = () => {
    cpPropertyService.shareViaTwitter(referralLink, property.title);
  };

  const handleLinkedIn = () => {
    cpPropertyService.shareViaLinkedIn(referralLink, property.title);
  };

  const handleEmail = () => {
    cpPropertyService.shareViaEmail(referralLink, property.title);
  };

  return (
    <div className="modal-overlay-share" onClick={onClose}>
      <div className="modal-content-share" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header-share">
          <h2>Share Property</h2>
          <button className="btn-close-modal" onClick={onClose}>
            <FiX size={24} />
          </button>
        </div>

        {/* Property Info */}
        <div className="property-info-share">
          {property.image && (
            <img src={property.image} alt={property.title} className="property-thumbnail" />
          )}
          <div className="property-text-share">
            <h3>{property.title}</h3>
            {property.location && <p>{property.location}</p>}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="loading-link">
            <div className="loading-spinner-small">Generating link...</div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="error-message-share">
            <span>{error}</span>
            <button onClick={fetchReferralLink}>Retry</button>
          </div>
        )}

        {/* Referral Link */}
        {!loading && !error && referralLink && (
          <>
            <div className="referral-link-box">
              <input
                type="text"
                value={referralLink}
                readOnly
                className="link-input"
              />
              <button
                className={`btn-copy-link ${copied ? 'copied' : ''}`}
                onClick={handleCopy}
              >
                {copied ? (
                  <>
                    <FiCheck size={18} />
                    Copied!
                  </>
                ) : (
                  <>
                    <FiCopy size={18} />
                    Copy
                  </>
                )}
              </button>
            </div>

            {/* Social Share Buttons */}
            <div className="social-share-section">
              <h4>Share via</h4>
              <div className="social-buttons-grid">
                <button 
                  className="social-btn whatsapp"
                  onClick={handleWhatsApp}
                >
                  <FaWhatsapp size={24} />
                  <span>WhatsApp</span>
                </button>

                <button 
                  className="social-btn facebook"
                  onClick={handleFacebook}
                >
                  <FaFacebook size={24} />
                  <span>Facebook</span>
                </button>

                <button 
                  className="social-btn twitter"
                  onClick={handleTwitter}
                >
                  <FaTwitter size={24} />
                  <span>Twitter</span>
                </button>

                <button 
                  className="social-btn linkedin"
                  onClick={handleLinkedIn}
                >
                  <FaLinkedin size={24} />
                  <span>LinkedIn</span>
                </button>

                <button 
                  className="social-btn email"
                  onClick={handleEmail}
                >
                  <FaEnvelope size={24} />
                  <span>Email</span>
                </button>
              </div>
            </div>

            {/* Tips */}
            <div className="share-tips">
              <h4>💡 Tips for Better Conversions</h4>
              <ul>
                <li>Personalize your message when sharing</li>
                <li>Highlight the property's unique features</li>
                <li>Mention expected returns and location benefits</li>
                <li>Follow up with interested leads promptly</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CPReferralShareModal;