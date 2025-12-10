import React from "react";
import {
  FiShare2,
  FiDownload,
  FiMapPin,
  FiDollarSign,
  FiCalendar,
} from "react-icons/fi";
import "../../styles/cp/CPPropertyCard.css";
import { FaRupeeSign } from "react-icons/fa";


const CPPropertyCard = ({ property, onShare }) => {
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="cp-property-card">
      <div className="property-content">
        <h3 className="property-title">{property.title}</h3>

        {property.location && (
          <div className="property-location">
            <FiMapPin size={16} />
            <span>{property.location}</span>
          </div>
        )}

        <div className="info-block">
          <div className="info-row">
           <FaRupeeSign className="info-icon" size={16}/>
            <div>
              <p className="info-label">Price Per Share</p>
              <p className="info-value">{formatCurrency(property.price)}</p>
            </div>
          </div>

          {property.expected_returns && (
            <div className="info-row">
              <span className="info-icon">📈</span>
              <div>
                <p className="info-label">Expected Returns</p>
                <p className="info-value green">
                  {property.expected_returns}%
                </p>
              </div>
            </div>
          )}

          {property.propertyDetails?.total_units && (
            <div className="info-row">
              <span className="info-icon">🏘️</span>
              <div>
                <p className="info-label">Available Units</p>
                <p className="info-value">
                  {property.propertyDetails.available_units} / {property.propertyDetails.total_units}
                </p>
              </div>
            </div>
          )}
        </div>

        {property.authorized_at && (
          <div className="auth-date">
            <FiCalendar size={14} />
            <span>Authorized on {formatDate(property.authorized_at)}</span>
          </div>
        )}
      </div>

      <div className="property-actions">
        <button className="btn-share" onClick={() => onShare(property)}>
          <FiShare2 /> Share Property
        </button>

        {property.brochure_url && (
          <button
            className="btn-download"
            onClick={() => window.open(property.brochure_url, "_blank")}
            title="Download Brochure"
          >
            <FiDownload />
          </button>
        )}
      </div>
    </div>
  );
};

export default CPPropertyCard;