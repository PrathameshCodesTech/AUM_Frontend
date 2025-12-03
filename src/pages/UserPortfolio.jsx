import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import investmentService from '../services/investmentService';
import Sidebar from '../components/Sidebar';
import PortfolioStats from '../components/PortfolioStats';
import PropertyCard from '../components/PropertyCard';
import {
  PieChart, Pie, Cell, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
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

  // Analytics state
  const [mode, setMode] = useState('demo');
  const [analyticsData, setAnalyticsData] = useState(null);

  const tabs = [
    { id: 'booked', label: 'Booked Properties', status: 'pending' },
    { id: 'active', label: 'Active Properties', status: 'active' },
    { id: 'completed', label: 'Completed Properties', status: 'completed' },
    { id: 'all', label: 'All Properties', status: null }
  ];

  useEffect(() => {
    fetchInvestments();
    fetchAnalytics();
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

  const fetchAnalytics = async () => {
    try {
      const response = await investmentService.getPortfolioAnalytics();
      
      if (response.success) {
        setMode(response.mode);
        setAnalyticsData(response.data);
      }
    } catch (error) {
      console.error('Analytics Error:', error);
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

    const totalInvestment = investmentsData.reduce((sum, inv) => {
      const amount = parseFloat(inv.amount);
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);

    const totalReturns = investmentsData.reduce((sum, inv) => {
      const returns = parseFloat(inv.actual_return_amount || 0);
      return sum + (isNaN(returns) ? 0 : returns);
    }, 0);

    const currentValue = totalInvestment + totalReturns;

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

    const currentTab = tabs.find(t => t.id === activeTab);
    if (currentTab && currentTab.status) {
      filtered = filtered.filter(inv => inv.status === currentTab.status);
    }

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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
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

        {/* Disclaimer */}
        {mode === 'demo' && (
          <div className="illustrative-disclaimer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 16V12M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span>Below dashboard is provided for illustrative purpose only</span>
          </div>
        )}

        {/* Analytics Section */}
        {analyticsData && analyticsData.cash_flow && analyticsData.portfolio_breakdown && (
          <div className="analytics-section">
            {/* Cash Flow & Funding Status Row */}
            <div className="analytics-row-2">
              {/* Cash Flow Chart */}
              <div className="chart-card">
                <div className="chart-header">
                  <h3>Cash Flow (Illustrative)</h3>
                </div>
                <div className="chart-container">
                  <div className="chart-legend-custom">
                    <div className="legend-item">
                      <span className="legend-color" style={{backgroundColor: '#F59E0B'}}></span>
                      <span>Capital Appr.</span>
                    </div>
                    <div className="legend-item">
                      <span className="legend-color" style={{backgroundColor: '#3B82F6'}}></span>
                      <span>Rental Income</span>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={analyticsData.cash_flow || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="year" 
                        tick={{fontSize: 12}}
                        axisLine={{stroke: '#d1d5db'}}
                      />
                      <YAxis 
                        tick={{fontSize: 12}}
                        axisLine={{stroke: '#d1d5db'}}
                        label={{ value: 'Amount (₹L)', angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip 
                        formatter={(value) => `₹${value}L`}
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="rental_income" stackId="a" fill="#3B82F6" radius={[0, 0, 0, 0]}>
                        {(analyticsData.cash_flow || []).map((entry, index) => (
                          <Cell key={`rental-${index}`}>
                            {/* Label inside bar */}
                            {index === (analyticsData.cash_flow || []).length - 1 && (
                              <text x="50%" y="50%" fill="white" textAnchor="middle">
                                ₹{entry.rental_income}L
                              </text>
                            )}
                          </Cell>
                        ))}
                      </Bar>
                      <Bar dataKey="capital_appreciation" stackId="a" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Funding Status & Asset Grade */}
              <div className="funding-card">
                <div className="funding-metrics">
                  <div className="metric-item">
                    <div className="metric-label">Entry Yield</div>
                    <div className="metric-value">{analyticsData.entry_yield || '8.2'}%</div>
                    <div className="metric-description">Net annual rental yield at entry</div>
                  </div>

                  <div className="metric-item">
                    <div className="metric-label">Projected IRR</div>
                    <div className="metric-value">{analyticsData.projected_irr || '13.8% – 15.2%'}</div>
                    <div className="metric-description">Rental income + capital appreciation</div>
                  </div>

                  <div className="metric-item">
                    <div className="metric-label">Investment Tenure</div>
                    <div className="metric-value">{analyticsData.investment_tenure || '5–7 Years'}</div>
                    <div className="metric-description">Typical Grade-A commercial exit horizon</div>
                  </div>

                  <div className="metric-item">
                    <div className="metric-label">Total Earnings (Illustration)</div>
                    <div className="metric-value">₹ {analyticsData.total_earnings || '8'} L</div>
                    <div className="metric-description">On ₹ {analyticsData.investment_amount || '25'} L investment over tenure</div>
                  </div>
                </div>

                <div className="funding-status-section">
                  <h4>Funding Status</h4>
                  <div className="progress-bar-container">
                    <div 
                      className="progress-bar-fill" 
                      style={{width: `${analyticsData.funding_percentage || 72}%`}}
                    >
                      <span className="progress-text">{analyticsData.funding_percentage || 72}% Funded</span>
                    </div>
                  </div>
                  <div className="funding-details">
                    <span>₹ {analyticsData.funded_amount || '18'} L funded</span>
                    <span>₹ {analyticsData.available_amount || '7'} L available</span>
                  </div>
                </div>

                
              </div>
            </div>

            {/* Portfolio Distribution, ROI Breakdown, Property Types - 3 in a row */}
            <div className="analytics-row-3">
              {/* Portfolio Distribution - Pie Chart */}
              <div className="chart-card">
                <div className="chart-header">
                  <h3>Portfolio Distribution</h3>
                  <p className="chart-subtitle">{analyticsData.properties_count} Properties</p>
                </div>
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analyticsData.portfolio_breakdown || []}
                        dataKey="percentage"
                        nameKey="property_name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={(entry) => `${entry.property_name}: ${entry.percentage.toFixed(1)}%`}
                      >
                        {(analyticsData.portfolio_breakdown || []).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={['#10B981', '#3B82F6', '#F59E0B', '#EF4444'][index % 4]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* ROI Breakdown - Donut Chart */}
              <div className="chart-card">
                <div className="chart-header">
                  <h3>ROI Breakdown</h3>
                  <p className="chart-subtitle">Average Returns</p>
                </div>
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analyticsData.roi_breakdown || []}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        label
                      >
                        {(analyticsData.roi_breakdown || []).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Property Types - Pie Chart */}
              <div className="chart-card">
                <div className="chart-header">
                  <h3>Property Types</h3>
                  <p className="chart-subtitle">Investment Mix</p>
                </div>
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analyticsData.property_types || []}
                        dataKey="value"
                        nameKey="type"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                      >
                        {(analyticsData.property_types || []).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Portfolio Growth & Payout History - 2 in a row */}
            <div className="analytics-row-2">
              {/* Portfolio Growth - Line Chart */}
              <div className="chart-card">
                <div className="chart-header">
                  <h3>Portfolio Growth</h3>
                  <p className="chart-subtitle">Historical Performance</p>
                </div>
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analyticsData.portfolio_growth || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Legend />
                      <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} name="Portfolio Value" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Payout History - Bar Chart */}
              <div className="chart-card">
                <div className="chart-header">
                  <h3>Payout History</h3>
                  <p className="chart-subtitle">Quarterly Distributions</p>
                </div>
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analyticsData.payout_history || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="quarter" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Legend />
                      <Bar dataKey="amount" name="Payout Amount">
                        {(analyticsData.payout_history || []).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.type === 'actual' ? '#10B981' : '#F59E0B'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* My Portfolio Section */}
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