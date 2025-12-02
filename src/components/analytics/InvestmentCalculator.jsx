import React, { useState, useCallback } from 'react';
import '../../styles/InvestmentCalculator.css';

const InvestmentCalculator = ({ calculator }) => {
  const [investmentAmount, setInvestmentAmount] = useState(500000);
  
  const calculateReturns = useCallback(() => {
    const launchPrice = calculator?.launch_price || 0;
    const currentPrice = calculator?.current_price || 0;
    
    if (!launchPrice || !currentPrice) {
      return { currentValue: 0, returns: 0, roi: 0, appreciation: 0 };
    }
    
    const appreciation = ((currentPrice - launchPrice) / launchPrice) * 100;
    const unitsPurchased = investmentAmount / launchPrice;
    const currentValue = unitsPurchased * currentPrice;
    const returns = currentValue - investmentAmount;
    const roi = (returns / investmentAmount) * 100;
    
    return { currentValue, returns, roi, appreciation };
  }, [investmentAmount, calculator]);

  const results = calculateReturns();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const renderIcon = (iconName) => {
    const icons = {
      calculator: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="4" y="2" width="16" height="20" rx="2" stroke="currentColor" strokeWidth="2"/>
          <path d="M8 6H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M8 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <rect x="8" y="14" width="2" height="2" fill="currentColor"/>
          <rect x="11" y="14" width="2" height="2" fill="currentColor"/>
          <rect x="14" y="14" width="2" height="2" fill="currentColor"/>
          <rect x="8" y="17" width="2" height="2" fill="currentColor"/>
          <rect x="11" y="17" width="2" height="2" fill="currentColor"/>
          <rect x="14" y="17" width="2" height="2" fill="currentColor"/>
        </svg>
      )
    };
    return icons[iconName] || null;
  };

  return (
    <div className="calculator-box">
      <div className="calculator-input-section">
        <label className="calculator-label">
          <span className="label-icon">{renderIcon('calculator')}</span>
          Investment Amount
        </label>
        <div className="calculator-input-wrapper">
          <span className="currency-symbol">₹</span>
          <input
            type="number"
            value={investmentAmount}
            onChange={(e) => setInvestmentAmount(Math.max(100000, parseInt(e.target.value) || 0))}
            className="calculator-input-field"
            placeholder="500000"
          />
        </div>
      </div>
      
      <div className="quick-amounts-grid">
        {calculator?.sample_amounts?.map((amount) => (
          <button
            key={amount}
            onClick={() => setInvestmentAmount(amount)}
            className={`quick-amount-btn ${investmentAmount === amount ? 'active' : ''}`}
          >
            ₹{Number(amount / 100000).toFixed(0)}L
          </button>
        ))}
      </div>

      <div className="results-section">
        <div className="result-cards-grid">
          <div className="result-card">
            <div className="result-label">Current Value</div>
            <div className="result-value">{formatCurrency(results.currentValue)}</div>
          </div>
          <div className="result-card">
            <div className="result-label">ROI</div>
            <div 
              className="result-value"
              style={{ color: results.roi > 0 ? '#10B981' : '#EF4444' }}
            >
              {results.roi.toFixed(1)}%
            </div>
          </div>
        </div>
        
        <div className="returns-summary">
          <div className="returns-main">
            <span className="returns-label">Total Returns</span>
            <span 
              className="returns-value"
              style={{ color: results.returns > 0 ? '#10B981' : '#EF4444' }}
            >
              {formatCurrency(results.returns)}
            </span>
          </div>
          <div className="appreciation-text">
            {results.appreciation.toFixed(1)}% Price Appreciation Since Launch
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentCalculator;