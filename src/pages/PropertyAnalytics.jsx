import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/PropertyAnalytics.css';  // ← YOUR CSS
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
          <div className="loading-spinner">⏳ Loading Analytics...</div>
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
        {/* Hero Section - YOUR EXACT STYLE */}
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

        {/* Calculator + Stats Grid */}
        <div className="analytics-grid">
          <div className="analytics-section">
            <div className="section-header">
              <h3 className="section-title">💡 Investment Calculator</h3>
            </div>
            <InvestmentCalculator calculator={analytics.calculator} />
          </div>
          
          <div className="analytics-section">
            <div className="section-header">
              <h3 className="section-title">📊 Key Metrics</h3>
            </div>
            <div className="stat-grid">
              <StatsCards keyMetrics={analytics.key_metrics} />
            </div>
          </div>
        </div>

        {/* Progress Bars */}
        <div className="analytics-section">
          <div className="section-header">
            <h3 className="section-title">📈 Progress Overview</h3>
          </div>
          <ProgressBars progressMetrics={analytics.progress_metrics} />
        </div>

        {/* Charts Grid */}
        <div className="analytics-section">
          <div className="section-header">
            <h3 className="section-title">🎯 Performance Charts</h3>
          </div>
          <AnalyticsCharts analytics={analytics} />
        </div>
      </div>
    </div>
  );
};

export default PropertyAnalytics;
