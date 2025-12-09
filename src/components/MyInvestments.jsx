import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import investmentService from '../services/investmentService';
import PropertyCard from '../components/PropertyCard';
import '../styles/MyInvestments.css';

const MyInvestments = () => {
  const navigate = useNavigate();
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = [
    { id: 'all', label: 'All Investments' },
    { id: 'approved', label: 'Approved' },
    { id: 'pending', label: 'Pending' },
    { id: 'rejected', label: 'Rejected' }
  ];

  useEffect(() => {
    fetchInvestments();
  }, []);

const fetchInvestments = async () => {
  setLoading(true);
  try {
    const response = await investmentService.getMyInvestments(); // ← Changed from getUserInvestments
    if (response.success) {
      setInvestments(response.data);
    }
  } catch (error) {
    toast.error('Failed to load investments');
    console.error('Error:', error);
  } finally {
    setLoading(false);
  }
};

  const filteredInvestments = investments.filter((investment) => {
    const matchesTab = activeTab === 'all' || investment.status === activeTab;
    const matchesSearch = searchQuery === '' || 
      investment.property?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      investment.property?.builder_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      investment.property?.city.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTab && matchesSearch;
  });

  const handleExploreProperties = () => {
    navigate('/properties');
  };

  return (
    <div className="my-investments-page">
      <div className="investments-container">
        
        {/* Back Button */}
        <button className="back-button" onClick={() => navigate(-1)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </button>

        {/* Page Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">My Investments</h1>
            <p className="page-subtitle">Track and manage all your property investments</p>
          </div>
          <button className="btn-explore" onClick={handleExploreProperties}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Explore Properties
          </button>
        </div>

        {/* Tabs */}
        <div className="investment-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`investment-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
              <span className="tab-count">
                {tab.id === 'all' 
                  ? investments.length 
                  : investments.filter(inv => inv.status === tab.id).length}
              </span>
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="search-section">
          <div className="search-input-wrapper">
            <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
              <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Search by Properties, Builder's Name, Location"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          <button className="filter-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M22 3H2L10 12.46V19L14 21V12.46L22 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Investments List */}
        <div className="investments-content">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner">Loading your investments...</div>
            </div>
          ) : filteredInvestments.length === 0 ? (
            <div className="empty-state">
              <svg className="empty-icon" width="80" height="80" viewBox="0 0 24 24" fill="none">
                <path d="M3 3H21V21H3V3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3 9H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9 21V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <h3>{searchQuery ? 'No Investments Found' : 'No Investments Yet'}</h3>
              <p>{searchQuery ? 'Try adjusting your search' : 'Start investing in properties to see them here'}</p>
              {!searchQuery && (
                <button className="btn-explore-properties" onClick={handleExploreProperties}>
                  Explore Properties
                </button>
              )}
            </div>
          ) : (
            <div className="investments-grid">
              {filteredInvestments.map((investment) => (
                <div key={investment.id} className="investment-card">
                  <div className="investment-badge">
                    <span className={`status-badge ${investment.status}`}>
                      {investment.status}
                    </span>
                  </div>
                  {investment.property && (
                    <PropertyCard property={investment.property} />
                  )}
                  <div className="investment-details">
                    <div className="detail-row">
                      <span className="detail-label">Investment Amount:</span>
                      <span className="detail-value">₹{parseFloat(investment.amount).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Shares Purchased:</span>
                      <span className="detail-value">{investment.units_purchased}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Investment Date:</span>
                      <span className="detail-value">
                        {new Date(investment.investment_date).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                    {investment.expected_return_amount && (
                      <div className="detail-row">
                        <span className="detail-label">Expected Returns:</span>
                        <span className="detail-value positive">
                          ₹{parseFloat(investment.expected_return_amount).toLocaleString('en-IN')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default MyInvestments;