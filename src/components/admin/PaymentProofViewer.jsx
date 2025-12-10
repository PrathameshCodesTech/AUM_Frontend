import React, { useState } from 'react';
import '../../styles/admin/PaymentProofViewer.css';

const PaymentProofViewer = ({ imageUrl, altText = "Payment Proof" }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imageError, setImageError] = useState(false);

  if (!imageUrl || imageError) {
    return (
      <div className="payment-proof-empty">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
          <path d="M3 15L9 9L13 13L21 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="7.5" cy="7.5" r="1.5" fill="currentColor"/>
        </svg>
        <p>No payment proof uploaded</p>
      </div>
    );
  }

  return (
    <>
      <div className="payment-proof-viewer">
        <div className="payment-proof-preview">
          <img 
            src={imageUrl} 
            alt={altText}
            onError={() => setImageError(true)}
          />
          <div className="payment-proof-overlay">
            <button 
              className="btn-proof-action"
              onClick={() => setIsFullscreen(true)}
              title="View Fullscreen"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M8 3H5C3.89543 3 3 3.89543 3 5V8M21 8V5C21 3.89543 20.1046 3 19 3H16M16 21H19C20.1046 21 21 20.1046 21 19V16M3 16V19C3 20.1046 3.89543 21 5 21H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            <a 
              href={imageUrl} 
              download 
              className="btn-proof-action"
              title="Download"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <polyline points="7 10 12 15 17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {isFullscreen && (
        <div className="payment-proof-fullscreen" onClick={() => setIsFullscreen(false)}>
          <button className="btn-close-fullscreen" onClick={() => setIsFullscreen(false)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          <img src={imageUrl} alt={altText} onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </>
  );
};

export default PaymentProofViewer;