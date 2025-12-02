import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import investmentService from '../services/investmentService';
import {
  PieChart, Pie, Cell, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import '../styles/PortfolioAnalytics.css';

const PortfolioAnalytics = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState('demo'); // 'demo' or 'personal'
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await investmentService.getPortfolioAnalytics();
      
      if (response.success) {
        setMode(response.mode);
        setAnalyticsData(response.data);
      }
    } catch (error) {
      toast.error('Failed to load analytics');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="portfolio-analytics-page">
        <main className="analytics-main">
          <div className="loading-state">
            <div className="loading-spinner">Loading analytics...</div>
          </div>
        </main>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="portfolio-analytics-page">
        <main className="analytics-main">
          <div className="error-state">
            <p>Failed to load analytics data</p>
          </div>
        </main>
      </div>
    );
  }

  const {
    total_invested,
    current_value,
    total_returns,
    total_roi,
    properties_count,
    portfolio_breakdown,
    roi_breakdown,
    portfolio_growth,
    payout_history,
    property_types
  } = analyticsData;

  return (
    <div className="portfolio-analytics-page">
      <main className="analytics-main">
        {/* Header */}
        <div className="analytics-header">
          <div className="header-left">
            <button className="btn-back" onClick={() => navigate('/portfolio')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back to Portfolio
            </button>
            <h1>Portfolio Analytics</h1>
            {mode === 'demo' && (
              <p className="demo-badge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Demo Mode - Start investing to see your real data
              </p>
            )}
          </div>
        </div>

        {/* Overview Stats */}
        <div className="stats-overview">
          <div className="stat-card-analytics">
            <div className="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2V22M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="stat-content">
              <p className="stat-label">Total Invested</p>
              <h3 className="stat-value">{formatCurrency(total_invested)}</h3>
            </div>
          </div>

          <div className="stat-card-analytics">
            <div className="stat-icon success">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="stat-content">
              <p className="stat-label">Current Value</p>
              <h3 className="stat-value">{formatCurrency(current_value)}</h3>
            </div>
          </div>

          <div className="stat-card-analytics">
            <div className="stat-icon warning">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="stat-content">
              <p className="stat-label">Total Returns</p>
              <h3 className="stat-value positive">{formatCurrency(total_returns)}</h3>
            </div>
          </div>

          <div className="stat-card-analytics">
            <div className="stat-icon primary">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M22 12H18L15 21L9 3L6 12H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="stat-content">
              <p className="stat-label">Total ROI</p>
              <h3 className="stat-value">{total_roi.toFixed(2)}%</h3>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="charts-grid">
          {/* Portfolio Breakdown - Pie Chart */}
          <div className="chart-card">
            <div className="chart-header">
              <h3>Portfolio Distribution</h3>
              <p className="chart-subtitle">{properties_count} Properties</p>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={portfolio_breakdown}
                    dataKey="percentage"
                    nameKey="property_name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={(entry) => `${entry.property_name}: ${entry.percentage.toFixed(1)}%`}
                  >
                    {portfolio_breakdown.map((entry, index) => (
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
                    data={roi_breakdown}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    label
                  >
                    {roi_breakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Portfolio Growth - Line Chart */}
          <div className="chart-card full-width">
            <div className="chart-header">
              <h3>Portfolio Growth</h3>
              <p className="chart-subtitle">Historical Performance</p>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={portfolio_growth}>
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
          <div className="chart-card full-width">
            <div className="chart-header">
              <h3>Payout History</h3>
              <p className="chart-subtitle">Quarterly Distributions</p>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={payout_history}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="quarter" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Bar dataKey="amount" name="Payout Amount">
                    {payout_history.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.type === 'actual' ? '#10B981' : '#F59E0B'} />
                    ))}
                  </Bar>
                </BarChart>
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
                    data={property_types}
                    dataKey="value"
                    nameKey="type"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {property_types.map((entry, index) => (
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

        {/* CTA Section (only in demo mode) */}
        {mode === 'demo' && (
          <div className="cta-section">
            <div className="cta-content">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <h2>Ready to Start Your Investment Journey?</h2>
              <p>Explore our curated properties and build your real estate portfolio today</p>
              <button className="btn-explore" onClick={() => navigate('/properties')}>
                Explore Properties
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PortfolioAnalytics;