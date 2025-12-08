import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import propertyService from '../services/propertyService';
import walletService from '../services/walletService';  // ← ADD THIS
import investmentService from '../services/investmentService';  // ← ADD THIS
import '../styles/PropertyDetail.css';

const PropertyDetail = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [unitsCount, setUnitsCount] = useState(1);  // ← ADD THIS
  const [walletBalance, setWalletBalance] = useState(0);  // ← ADD THIS
  const [showInterestModal, setShowInterestModal] = useState(false);
  const [showInvestModal, setShowInvestModal] = useState(false);  // ← ADD THIS
  const [investing, setInvesting] = useState(false);  // ← ADD THIS
  const [expectedEarnings, setExpectedEarnings] = useState(null);
  const [earningsAmount, setEarningsAmount] = useState(500000);
  const [loadingEarnings, setLoadingEarnings] = useState(false);

  const [referralCode, setReferralCode] = useState('');
  const [validatingCode, setValidatingCode] = useState(false);
  const [codeValidation, setCodeValidation] = useState(null); // { valid: true/false, message: '', cp_name: '' }

  useEffect(() => {
    fetchPropertyDetail();
  }, [propertyId]);

  useEffect(() => {
    if (activeTab === 'earnings' && !expectedEarnings) {
      fetchExpectedEarnings(earningsAmount);
    }
  }, [activeTab]);

  const fetchPropertyDetail = async () => {
    setLoading(true);
    try {
      const response = await propertyService.getPropertyDetail(propertyId);
      if (response.success) {
        setProperty(response.data);
        const pricePerUnit = parseFloat(response.data.price_per_unit);
        setInvestmentAmount(pricePerUnit * 1);
        setUnitsCount(1);
      }

      // Fetch wallet balance if authenticated
      if (isAuthenticated) {
        try {
          const balanceResponse = await walletService.getBalance();
          if (balanceResponse.success) {
            setWalletBalance(balanceResponse.data.balance);
          }
        } catch (error) {
          // Wallet doesn't exist yet
          setWalletBalance(0);
        }
      }
    } catch (error) {
      toast.error('Failed to load property details');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExpressInterest = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to express interest');
      navigate('/login');
      return;
    }

    try {
      const response = await propertyService.expressInterest(propertyId, 1);
      if (response.success) {
        toast.success(response.message);
        setShowInterestModal(false);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to express interest');
    }
  };

  const handleInvestNow = () => {
    if (!isAuthenticated) {
      toast.error('Please login to invest');
      navigate('/login');
      return;
    }
    setShowInvestModal(true);
  };

  const handleInvestmentSubmit = async () => {
    if (!investmentAmount || parseFloat(investmentAmount) < parseFloat(property.minimum_investment)) {
      toast.error(`Minimum investment is ${formatCurrency(property.minimum_investment)}`);
      return;
    }

    if (parseFloat(investmentAmount) > walletBalance) {
      toast.error('Insufficient wallet balance. Please add funds first.');
      navigate('/wallet');
      return;
    }

    setInvesting(true);
    try {
      const referralCodeToSend = referralCode.trim() || null;

      console.log('🔍 Sending to backend:', {
        property_id: property.id,
        amount: investmentAmount,
        units_count: unitsCount,
        referral_code: referralCodeToSend
      });

      const response = await investmentService.createInvestment(
        property.id,
        investmentAmount,
        unitsCount,
        referralCode.trim() || null  // Always send if entered, backend validates
      );
      if (response.success) {
        toast.success(response.message);
        setShowInvestModal(false);

        // Refresh wallet balance
        const balanceResponse = await walletService.getBalance();
        if (balanceResponse.success) {
          setWalletBalance(balanceResponse.data.balance);
        }
      }
    } catch (error) {
      toast.error(error.message || 'Failed to create investment');
    } finally {
      setInvesting(false);
    }
  };

  const handleUnitsChange = (newUnits) => {
    if (newUnits < 1) return;
    if (newUnits > property.available_units) {
      toast.error(`Only ${property.available_units} units available`);
      return;
    }
    setUnitsCount(newUnits);
    setInvestmentAmount(newUnits * parseFloat(property.price_per_unit));
  };

  const handleAmountChange = (newAmount) => {
    const amount = parseFloat(newAmount);
    if (isNaN(amount) || amount < parseFloat(property.minimum_investment)) return;

    // Calculate units based on amount, but ensure it's a valid multiple
    const calculatedUnits = Math.floor(amount / parseFloat(property.price_per_unit));
    if (calculatedUnits < 1) return;

    setUnitsCount(calculatedUnits);
    setInvestmentAmount(calculatedUnits * parseFloat(property.price_per_unit));
  };


  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="property-detail-loading">
        <div className="loading-spinner">Loading property details...</div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="property-detail-error">
        <h2>Property not found</h2>
        <button onClick={() => navigate('/properties')}>Back to Properties</button>
      </div>
    );
  }

  // Use all_images if available (from deep=true), otherwise fallback
  const allImages = property.all_images?.map(img => img.url) || [
    property.primary_image || property.featured_image,
    ...(property.images?.map(img => img.image_url) || [])
  ].filter(Boolean);

  const fetchExpectedEarnings = async (amount) => {
    if (!property?.slug) return;

    setLoadingEarnings(true);
    try {
      const response = await propertyService.getPropertyAnalytics(property.slug, amount);
      if (response.success) {
        setExpectedEarnings(response.data.analytics.expected_earnings);
      }
    } catch (error) {
      console.error('Error fetching expected earnings:', error);
      toast.error('Failed to load expected earnings');
    } finally {
      setLoadingEarnings(false);
    }
  };

  const validateReferralCode = async (code) => {
    if (!code.trim()) {
      setCodeValidation(null);
      return;
    }

    setValidatingCode(true);
    try {
      const response = await investmentService.validateCPCode(code); // or cpService.validateCode(code)
      if (response.success) {
        setCodeValidation({
          valid: true,
          message: response.message,
          cp_name: response.data.cp_name, // Channel Partner name
          cp_id: response.data.cp_id
        });
      }
    } catch (error) {
      setCodeValidation({
        valid: false,
        message: error.message || 'Invalid referral code'
      });
    } finally {
      setValidatingCode(false);
    }
  };

  return (
    <div className="property-detail-page">
      <div className="property-detail-container">
        {/* Back Button */}
        <button className="back-button" onClick={() => navigate('/properties')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Properties
        </button>

        {/* Main Content Grid */}
        <div className="property-detail-grid">
          {/* Left Column - Images & Info */}
          <div className="property-left">
            {/* Image Gallery */}
            <div className="image-gallery">
              <div className="main-image">
                <img
                  src={allImages[selectedImageIndex] || 'https://via.placeholder.com/800x600?text=No+Image'}
                  alt={property.name}
                />
                {property.is_featured && <span className="featured-badge">Featured</span>}

                <div className="property-badges">
                  <span className={`badge-property-type ${property.property_type}`}>
                    {property.property_type === 'equity' ? 'Equity' :
                      property.property_type === 'debt_income' ? 'Debt Income' :
                        property.property_type === 'hybrid' ? 'Hybrid' :
                          property.property_type}
                  </span>
                  <span className={`badge-status status-${property.status}`}>
                    {property.status === 'live' ? 'Live' :
                      property.status === 'funding' ? 'Funding' :
                        property.status === 'funded' ? 'Fully Funded' :
                          property.status === 'under_construction' ? 'Under Construction' :
                            property.status === 'completed' ? 'Completed' :
                              property.status}
                  </span>
                </div>
              </div>

              {allImages.length > 1 && (
                <div className="image-thumbnails">
                  {allImages.map((img, index) => (
                    <div
                      key={index}
                      className={`thumbnail ${selectedImageIndex === index ? 'active' : ''}`}
                      onClick={() => setSelectedImageIndex(index)}
                    >
                      <img src={img} alt={`View ${index + 1}`} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Property Header */}
            <div className="property-header">
              <div className="property-title-section">
                <h1>{property.name}</h1>
                <p className="property-location">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2" />
                    <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  {property.locality && `${property.locality}, `}{property.city}, {property.state}
                </p>
                <div className="property-meta">
                  <span className="meta-item">
                    <strong>Builder:</strong> {property.builder_name}
                  </span>
                  <span className="meta-item">
                    <strong>Type:</strong> {property.property_type}
                  </span>
                  <span className="meta-item">
                    <strong>Status:</strong> {property.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="property-tabs">
              <button
                className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button
                className={`tab ${activeTab === 'financials' ? 'active' : ''}`}
                onClick={() => setActiveTab('financials')}
              >
                Financials
              </button>
              <button
                className={`tab ${activeTab === 'documents' ? 'active' : ''}`}
                onClick={() => setActiveTab('documents')}
              >
                Documents
              </button>
              <button
                className={`tab ${activeTab === 'location' ? 'active' : ''}`}
                onClick={() => setActiveTab('location')}
              >
                Location
              </button>
              <button
                className={`tab ${activeTab === 'earnings' ? 'active' : ''}`}
                onClick={() => setActiveTab('earnings')}
              >
                Expected Earnings
              </button>
            </div>

            {/* Tab Content */}
            <div className="tab-content">
              {activeTab === 'overview' && (
                <div className="overview-section">
                  <h3>About This Property</h3>
                  <p>{property.description}</p>

                  {property.highlights?.length > 0 && (
                    <div className="highlights">
                      <h4>Highlights</h4>
                      <ul>
                        {property.highlights.map((highlight, index) => (
                          <li key={index}>{highlight}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {property.amenities?.length > 0 && (
                    <div className="amenities">
                      <h4>Amenities</h4>
                      <div className="amenities-grid">
                        {property.amenities.map((amenity, index) => (
                          <div key={index} className="amenity-item">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                              <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            {amenity}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="specifications">
                    <h4>Specifications</h4>
                    <div className="spec-grid">
                      <div className="spec-item">
                        <span className="spec-label">Total Area</span>
                        <span className="spec-value">{property.total_area} sq ft</span>
                      </div>
                      <div className="spec-item">
                        <span className="spec-label">Total Units</span>
                        <span className="spec-value">{property.total_units}</span>
                      </div>
                      <div className="spec-item">
                        <span className="spec-label">Available Units</span>
                        <span className="spec-value">{property.available_units}</span>
                      </div>
                      <div className="spec-item">
                        <span className="spec-label">Project Duration</span>
                        <span className="spec-value">{property.project_duration} months</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'financials' && (
                <div className="financials-section">
                  <h3>Financial Details</h3>

                  <div className="financial-grid">
                    <div className="financial-card">
                      <h4>Investment Range</h4>
                      <p className="financial-value">
                        {formatCurrency(property.minimum_investment)} - {' '}
                        {property.maximum_investment ? formatCurrency(property.maximum_investment) : 'No Limit'}
                      </p>
                    </div>

                    <div className="financial-card">
                      <h4>Target Amount</h4>
                      <p className="financial-value">{formatCurrency(property.target_amount)}</p>
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${property.stats?.funding_percentage || 0}%` }}
                        />
                      </div>
                      <p className="progress-text">
                        {formatCurrency(property.funded_amount)} funded ({property.stats?.funding_percentage || 0}%)
                      </p>
                    </div>

                    <div className="financial-card">
                      <h4>Expected Returns</h4>
                      <div className="returns-grid">
                        <div>
                          <span className="return-label">Target IRR</span>
                          <span className="return-value">{property.expected_return_percentage}%</span>
                        </div>
                        <div>
                          <span className="return-label">Gross Yield</span>
                          <span className="return-value">{property.gross_yield}%</span>
                        </div>
                        <div>
                          <span className="return-label">Potential Gain</span>
                          <span className="return-value positive">
                            +{property.potential_gain}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="financial-card">
                      <h4>Important Dates</h4>
                      <div className="dates-list">
                        <div className="date-item">
                          <span>Launch Date:</span>
                          <strong>{formatDate(property.launch_date)}</strong>
                        </div>
                        <div className="date-item">
                          <span>Funding End:</span>
                          <strong>{formatDate(property.funding_end_date)}</strong>
                        </div>
                        <div className="date-item">
                          <span>Possession:</span>
                          <strong>{formatDate(property.possession_date)}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'documents' && (
                <div className="documents-section">
                  <h3>Documents</h3>
                  {(property.all_documents || property.documents)?.length > 0 ? (
                    <div className="documents-list">
                      {(property.all_documents || property.documents).map((doc) => (
                        <div key={doc.id} className="document-item">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <div className="document-info">
                            <h4>{doc.title}</h4>
                            <span className="document-type">{doc.document_type}</span>
                          </div>
                          {doc.is_public && (
                            <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="download-btn">
                              Download
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-data">No documents available</p>
                  )}
                </div>
              )}

              {activeTab === 'location' && (
                <div className="location-section">
                  <h3>Location</h3>
                  <div className="address-box">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2" />
                      <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    <div>
                      <p><strong>{property.name}</strong></p>
                      <p>{property.address}</p>
                      <p>{property.city}, {property.state} - {property.pincode}</p>
                      <p>{property.country}</p>
                    </div>
                  </div>

                  {property.latitude && property.longitude && (
                    <div className="map-placeholder">
                      <p>Map integration coming soon</p>
                      <p className="coordinates">
                        Coordinates: {property.latitude}, {property.longitude}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'earnings' && (
                <div className="earnings-section">
                  <h3>Expected Earnings</h3>
                  <p className="earnings-subtitle">Estimate your return on investment</p>

                  {/* Calculator Input */}
                  <div className="earnings-calculator">
                    <label>Investment Amount</label>
                    <div className="amount-input-wrapper">
                      <span className="currency-symbol">₹</span>
                      <input
                        type="number"
                        value={earningsAmount}
                        onChange={(e) => setEarningsAmount(e.target.value)}
                        min={property.minimum_investment}
                        step="50000"
                        placeholder="Enter amount"
                      />
                      <button
                        className="calculate-btn"
                        onClick={() => fetchExpectedEarnings(earningsAmount)}
                        disabled={loadingEarnings}
                      >
                        {loadingEarnings ? 'Calculating...' : 'Calculate'}
                      </button>
                    </div>
                    <p className="input-hint">
                      Minimum: {formatCurrency(property.minimum_investment)}
                    </p>
                  </div>



                  {/* Quick Amount Buttons */}
                  <div className="quick-amounts">
                    {[500000, 1000000, 2000000, 5000000].map(amount => (
                      <button
                        key={amount}
                        className={`quick-amount-btn ${earningsAmount == amount ? 'active' : ''}`}
                        onClick={() => {
                          setEarningsAmount(amount);
                          fetchExpectedEarnings(amount);
                        }}
                      >
                        ₹{(amount / 100000).toFixed(1)}L
                      </button>
                    ))}
                  </div>

                  {/* Expected Earnings Table */}
                  {loadingEarnings ? (
                    <div className="loading-earnings">
                      <div className="spinner"></div>
                      <p>Calculating returns...</p>
                    </div>
                  ) : expectedEarnings ? (
                    <>
                      <div className="earnings-summary">
                        <div className="summary-card">
                          <span className="summary-label">Investment Amount</span>
                          <span className="summary-value">{expectedEarnings.investment_amount_display}</span>
                        </div>
                        <div className="summary-card">
                          <span className="summary-label">Total Tenure</span>
                          <span className="summary-value">{expectedEarnings.total_tenure_years} Years</span>
                        </div>
                        <div className="summary-card">
                          <span className="summary-label">Annual Return Rate</span>
                          <span className="summary-value">{expectedEarnings.annual_return_rate}%</span>
                        </div>
                        <div className="summary-card highlight">
                          <span className="summary-label">Total Net Returns</span>
                          <span className="summary-value">
                            ₹{(expectedEarnings.total_net / 100000).toFixed(2)}L
                          </span>
                        </div>
                      </div>

                      <div className="earnings-note">
                        <p>Below are sample investment results calculated using the values entered in the Returns Calculator</p>
                        <button className="download-report-btn">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <polyline points="7 10 12 15 17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          Download Report
                        </button>
                      </div>

                      <div className="earnings-table-wrapper">
                        <table className="earnings-table">
                          <thead>
                            <tr>
                              <th>Date Period</th>
                              <th>PayOut Date</th>
                              <th>Gross Amount</th>
                              <th>Tax Amount</th>
                              <th>Net Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            {expectedEarnings.breakdown.map((row, index) => (
                              <tr key={index}>
                                <td>{row.date_period}</td>
                                <td>{row.payout_date}</td>
                                <td>{row.gross_amount_display}</td>
                                <td>{row.tax_amount_display}</td>
                                <td className="net-amount">{row.net_amount_display}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <p className="disclaimer">
                        * Returns are indicative and subject to market conditions. Tax calculations are based on current rates.
                      </p>
                    </>
                  ) : (
                    <div className="no-earnings-data">
                      <p>Enter an amount and click Calculate to see expected earnings</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Investment Card */}
          <div className="property-right">
            <div className="investment-card">
              <div className="investment-header">
                <h3>Investment Details</h3>
                <span className="investor-count">
                  {property.investor_count || 0} Investors
                </span>
              </div>

              <div className="price-section">
                <div className="price-item">
                  <span className="price-label">Min Investment</span>
                  <span className="price-value">{formatCurrency(property.minimum_investment)}</span>
                </div>
                <div className="price-item">
                  <span className="price-label">Property Value</span>
                  <span className="price-value">{formatCurrency(property.target_amount)}</span>
                </div>
              </div>

              <div className="metrics-section">
                <div className="metric-row">
                  <span className="metric-label">Total Units</span>
                  <span className="metric-value">{property.total_units}</span>
                </div>
                <div className="metric-row">
                  <span className="metric-label">Available Units</span>
                  <span className="metric-value">{property.available_units}</span>
                </div>
                <div className="metric-row">
                  <span className="metric-label">Target IRR</span>
                  <span className="metric-value highlight">{property.expected_return_percentage}%</span>
                </div>
                <div className="metric-row">
                  <span className="metric-label">Gross Yield</span>
                  <span className="metric-value highlight">{property.gross_yield}%</span>
                </div>
                <div className="metric-row">
                  <span className="metric-label">Lock-in Period</span>
                  <span className="metric-value">{property.lock_in_period} months</span>
                </div>
              </div>

              <button
                className="express-interest-btn secondary"
                onClick={() => setShowInterestModal(true)}
              >
                Express Interest
              </button>

              <button
                className="express-interest-btn primary"
                onClick={handleInvestNow}
              >
                Invest Now
              </button>

              <button
                className="view-analytics-btn"
                onClick={() => navigate(`/analytics/${property.slug}`)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M3 3V18C3 18.5304 3.21071 19.0391 3.58579 19.4142C3.96086 19.7893 4.46957 20 5 20H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M18 9L13 14L9 10L3 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                View Property Analytics
              </button>

              <p className="disclaimer">
                * Returns are indicative and subject to market conditions
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Interest Modal */}
      {showInterestModal && (
        <div className="modal-overlay" onClick={() => setShowInterestModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowInterestModal(false)}>
              ×
            </button>
            <h2>Express Interest</h2>
            <p>Our team will contact you shortly to discuss investment opportunities in <strong>{property.name}</strong>.</p>

            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowInterestModal(false)}>
                Cancel
              </button>
              <button className="btn-confirm" onClick={handleExpressInterest}>
                Confirm Interest
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Investment Modal */}
      {showInvestModal && (
        <div className="modal-overlay" onClick={() => setShowInvestModal(false)}>
          <div className="modal-content invest-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowInvestModal(false)}>
              ×
            </button>

            <h2>Invest in {property.name}</h2>
            <p className="modal-subtitle">Review your investment details</p>

            <div className="wallet-info">
              <div className="wallet-balance-box">
                <span className="label">Wallet Balance</span>
                <span className="value">{formatCurrency(walletBalance)}</span>
              </div>
              {walletBalance < parseFloat(property.minimum_investment) && (
                <div className="warning-box">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    <path d="M12 8V12M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  <span>Insufficient balance. <a href="/wallet">Add funds</a></span>
                </div>
              )}
            </div>

            <div className="invest-inputs">
              <div className="input-group">
                <label>Number of Shares</label>
                <div className="unit-selector">
                  <button
                    onClick={() => handleUnitsChange(unitsCount - 1)}
                    disabled={unitsCount <= 1}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={unitsCount}
                    onChange={(e) => handleUnitsChange(parseInt(e.target.value) || 1)}
                    min="1"
                    max={property.available_units}
                  />
                  <button
                    onClick={() => handleUnitsChange(unitsCount + 1)}
                    disabled={unitsCount >= property.available_units}
                  >
                    +
                  </button>
                </div>
                <span className="input-hint">{property.available_units} Shares available</span>
              </div>

              <div className="input-group">
                <label>Investment Amount (₹)</label>
                <input
                  type="number"
                  value={investmentAmount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  min={property.minimum_investment}
                  step="1000"
                />
                <span className="input-hint">Min: {formatCurrency(property.minimum_investment)}</span>
              </div>

              <div className="input-group">
                <label>Referred by</label>
                <div className="referral-input-wrapper">
                  <input
                    type="text"
                    value={referralCode}
                    onChange={(e) => {
                      let value = e.target.value.toUpperCase().trim();
                      // Auto-add CP prefix if not present
                      if (value && !value.startsWith('CP')) {
                        value = 'CP' + value;
                      }
                      setReferralCode(value);
                    }}
                    onBlur={() => validateReferralCode(referralCode)}
                    placeholder="Enter CP referral code"
                    maxLength={10}
                  />
                  {validatingCode && <span className="validating">Checking...</span>}
                </div>

                {codeValidation && (
                  <span className={`validation-message ${codeValidation.valid ? 'valid' : 'invalid'}`}>
                    {codeValidation.valid && '✓ '}
                    {codeValidation.message}
                    {codeValidation.cp_name && ` - ${codeValidation.cp_name}`}
                  </span>
                )}

                <span className="input-hint">Have a Channel Partner code? Enter it here</span>
              </div>
            </div>

            <div className="invest-summary">
              <div className="summary-row">
                <span>Price per unit</span>
                <strong>{formatCurrency(property.price_per_unit)}</strong>
              </div>
              <div className="summary-row">
                <span>Units</span>
                <strong>{unitsCount}</strong>
              </div>
              <div className="summary-row total">
                <span>Total Investment</span>
                <strong>{formatCurrency(investmentAmount)}</strong>
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={() => setShowInvestModal(false)}
                disabled={investing}
              >
                Cancel
              </button>
              <button
                className="btn-confirm"
                onClick={handleInvestmentSubmit}
                disabled={investing || walletBalance < parseFloat(investmentAmount)}
              >
                {investing ? 'Processing...' : 'Confirm Investment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetail;