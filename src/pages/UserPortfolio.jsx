import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import investmentService from '../services/investmentService';
import Sidebar from '../components/Sidebar';
import PortfolioStats from '../components/PortfolioStats';
import PropertyCard from '../components/PropertyCard';
import '../styles/UserPortfolio.css';

const UserPortfolio = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('booked');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [investments, setInvestments] = useState([]);
  const [portfolioStats, setPortfolioStats] = useState({
    propertiesHolding: 0,
    totalInvestment: 0,
    currentValue: 0,
    totalReturns: 0,
    averagePotentialGain: 0,
    averageIRR: 0,
    averageYield: 0
  });

  const tabs = [
    { id: 'booked', label: 'Booked Properties', status: 'pending' },
    { id: 'active', label: 'Active Properties', status: 'active' },
    { id: 'completed', label: 'Completed Properties', status: 'completed' },
    { id: 'all', label: 'All Properties', status: null }
  ];

  useEffect(() => {
    fetchInvestments();
  }, []);

  const fetchInvestments = async () => {
    setLoading(true);
    try {
      const response = await investmentService.getMyInvestments();

      if (response.success) {
        setInvestments(response.data);
        calculateStats(response.data);
      }
    } catch (error) {
      toast.error('Failed to load portfolio');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (investmentsData) => {
    if (!investmentsData || investmentsData.length === 0) {
      setPortfolioStats({
        propertiesHolding: 0,
        totalInvestment: 0,
        currentValue: 0,
        totalReturns: 0,
        averagePotentialGain: 0,
        averageIRR: 0,
        averageYield: 0
      });
      return;
    }

    // Parse safely with fallback to 0
    const totalInvestment = investmentsData.reduce((sum, inv) => {
      const amount = parseFloat(inv.amount);
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);

    const totalReturns = investmentsData.reduce((sum, inv) => {
      const returns = parseFloat(inv.actual_return_amount || 0);
      return sum + (isNaN(returns) ? 0 : returns);
    }, 0);

    const currentValue = totalInvestment + totalReturns;

    // Calculate averages
    const activeInvestments = investmentsData.filter(inv => inv.status === 'active');

    const avgPotentialGain = activeInvestments.length > 0
      ? activeInvestments.reduce((sum, inv) => {
        const gain = parseFloat(inv.property?.potential_gain || 0);
        return sum + (isNaN(gain) ? 0 : gain);
      }, 0) / activeInvestments.length
      : 0;

    const avgIRR = activeInvestments.length > 0
      ? activeInvestments.reduce((sum, inv) => {
        const irr = parseFloat(inv.property?.expected_return_percentage || 0);
        return sum + (isNaN(irr) ? 0 : irr);
      }, 0) / activeInvestments.length
      : 0;

    const avgYield = activeInvestments.length > 0
      ? activeInvestments.reduce((sum, inv) => {
        const yld = parseFloat(inv.property?.gross_yield || 0);
        return sum + (isNaN(yld) ? 0 : yld);
      }, 0) / activeInvestments.length
      : 0;

    setPortfolioStats({
      propertiesHolding: investmentsData.length,
      totalInvestment: totalInvestment.toFixed(2),
      currentValue: currentValue.toFixed(2),
      totalReturns: totalReturns.toFixed(2),
      averagePotentialGain: avgPotentialGain.toFixed(2),
      averageIRR: avgIRR.toFixed(2),
      averageYield: avgYield.toFixed(2)
    });
  };

  const getFilteredInvestments = () => {
    let filtered = investments;

    // Filter by tab
    const currentTab = tabs.find(t => t.id === activeTab);
    if (currentTab && currentTab.status) {
      filtered = filtered.filter(inv => inv.status === currentTab.status);
    }

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(inv =>
        inv.property?.name?.toLowerCase().includes(query) ||
        inv.property?.builder_name?.toLowerCase().includes(query) ||
        inv.property?.city?.toLowerCase().includes(query) ||
        inv.property?.locality?.toLowerCase().includes(query)
      );
    }

    return filtered;
  };

  const handleExploreProperties = () => {
    navigate('/properties');
  };

  const filteredInvestments = getFilteredInvestments();

  return (
    <div className="portfolio-page">
      <Sidebar />

      <main className="portfolio-main">
        <div className="portfolio-header">
          <h1>Hi, <span className="user-name-highlight">{user?.username || 'User'}</span></h1>
          <p className="portfolio-subtitle">Here is your list of invested properties.</p>
        </div>

        <PortfolioStats data={portfolioStats} />

        {/* Add Analytics Button */}
        <div className="analytics-cta-section">
          <button
            className="btn-view-analytics"
            onClick={() => navigate('/portfolio/analytics')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M3 3V18C3 18.5304 3.21071 19.0391 3.58579 19.4142C3.96086 19.7893 4.46957 20 5 20H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M18 9L13 14L9 10L3 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            View Detailed Analytics
          </button>
        </div>

        <div className="portfolio-section">
          <h2 className="section-title">My Portfolio</h2>

          <div className="portfolio-tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`portfolio-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="portfolio-search-bar">
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
                className="portfolio-search-input"
              />
            </div>
            <button className="filter-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M22 3H2L10 12.46V19L14 21V12.46L22 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <div className="portfolio-content">
            {loading ? (
              <div className="loading-state">
                <div className="loading-spinner">Loading your portfolio...</div>
              </div>
            ) : filteredInvestments.length === 0 ? (
              <div className="empty-state">
                <svg className="empty-icon" width="80" height="80" viewBox="0 0 24 24" fill="none">
                  <path d="M3 3H21V21H3V3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M3 9H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M9 21V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <h3>{searchQuery ? 'No Properties Found' : 'No Properties Yet'}</h3>
                <p>{searchQuery ? 'Try adjusting your search' : 'Start investing in properties to see them here'}</p>
                {!searchQuery && (
                  <button className="btn-explore-properties" onClick={handleExploreProperties}>
                    Explore Properties
                  </button>
                )}
              </div>
            ) : (
              <div className="properties-list">
                {filteredInvestments.map((investment) => (
                  <div key={investment.id} className="portfolio-property-card">
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
                        <span className="detail-label">Units Purchased:</span>
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
      </main>
    </div>
  );
};

export default UserPortfolio;