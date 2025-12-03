import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/PropertyAnalytics.css';
import propertyService from '../services/propertyService';
import InvestmentCalculator from '../components/analytics/InvestmentCalculator';
import AnalyticsCharts from '../components/analytics/AnalyticsCharts';
import StatsCards from '../components/analytics/StatsCards';
import ProgressBars from '../components/analytics/ProgressBars';

const PropertyAnalytics = () => {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await propertyService.getPropertyAnalytics(slug);
        setData(response.data);
      } catch (err) {
        setError('Failed to load analytics data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchAnalytics();
  }, [slug]);

  if (loading) {
    return (
      <div className="analytics-page">
        <div className="loading-container">
          <div className="loading-spinner">Loading Analytics...</div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="analytics-page">
        <div className="no-properties">
          <p>{error || 'Analytics data not available'}</p>
        </div>
      </div>
    );
  }

  const { property, analytics } = data;

  return (
    <div className="analytics-page">
      <div className="analytics-container">
        
        {/* ROW 1: Hero Section */}
        <div className="analytics-hero fade-in-up">
          <img 
            src={property?.primary_image || '/placeholder-property.jpg'} 
            alt={property?.name || 'Property'}
            className="mx-auto mb-6 border-4 border-white shadow-2xl object-cover"
            onError={(e) => { e.target.src = '/placeholder-property.jpg'; }}
          />
          <h1 className="mb-4 leading-tight">
            {property?.name || 'Loading Property...'}
          </h1>
          <p className="mb-6 opacity-90">
            {property?.city || ''}, {property?.locality || ''}
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-lg mb-8">
            <span className="analytics-badge">
              {property?.property_type?.toUpperCase() || 'N/A'}
            </span>
            <span className="analytics-badge">
              {property?.status?.toUpperCase() || 'LOADING'}
            </span>
            <span className="analytics-badge">
              ₹{property?.price_per_unit 
                ? Number(property.price_per_unit).toLocaleString() 
                : '0'} / unit
            </span>
          </div>
        </div>

        {/* ROW 2: Investment Calculator | Key Metrics | Progress Overview */}
        <div className="analytics-grid">
          <div className="analytics-section">
            <div className="section-header">
              <div className="section-title-with-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z"/>
                  <path d="M2 17L12 22L22 17"/>
                  <path d="M2 12L12 17L22 12"/>
                </svg>
                <h3 className="section-title">Investment Calculator</h3>
              </div>
            </div>
            <InvestmentCalculator calculator={analytics.calculator} />
          </div>
          
          <div className="analytics-section">
            <div className="section-header">
              <div className="section-title-with-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 12H18L15 21L9 3L6 12H2"/>
                </svg>
                <h3 className="section-title">Key Metrics</h3>
              </div>
            </div>
            <div className="stat-grid">
              <StatsCards keyMetrics={analytics.key_metrics} />
            </div>
          </div>

          <div className="analytics-section">
            <div className="section-header">
              <div className="section-title-with-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                <h3 className="section-title">Progress Overview</h3>
              </div>
            </div>
            <ProgressBars progressMetrics={analytics.progress_metrics} />
          </div>
        </div>

        {/* ROW 3: Payout History | ROI Breakdown | Funding Sources */}
        <div className="analytics-grid">
          <div className="analytics-section">
            <div className="section-header">
              <div className="section-title-with-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                  <line x1="1" y1="10" x2="23" y2="10"/>
                </svg>
                <h3 className="section-title">Payout History</h3>
              </div>
            </div>
            <AnalyticsCharts analytics={analytics} chartType="payout" />
          </div>

          <div className="analytics-section">
            <div className="section-header">
              <div className="section-title-with-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6V12L16 14"/>
                </svg>
                <h3 className="section-title">ROI Breakdown</h3>
              </div>
            </div>
            <AnalyticsCharts analytics={analytics} chartType="roi" />
          </div>

          <div className="analytics-section">
            <div className="section-header">
              <div className="section-title-with-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 3V18C3 18.5304 3.21071 19.0391 3.58579 19.4142C3.96086 19.7893 4.46957 20 5 20H21"/>
                  <path d="M18 9L13 14L9 10L3 16"/>
                </svg>
                <h3 className="section-title">Funding Sources</h3>
              </div>
            </div>
            <AnalyticsCharts analytics={analytics} chartType="funding" />
          </div>
        </div>

      </div>
    </div>
  );
};

export default PropertyAnalytics;