import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/authService';
import kycService from '../services/kycService';
import AccountSetup from '../components/AccountSetup';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [setupStartStep, setSetupStartStep] = useState(2); // Which step to start from
  const [showBankForm, setShowBankForm] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [profileComplete, setProfileComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [kycData, setKycData] = useState(null);
  const [kycLoading, setKycLoading] = useState(false);

  // Bank form state
  const [bankFormData, setBankFormData] = useState({
    accountNumber: '',
    ifscCode: ''
  });
  const [bankSubmitting, setBankSubmitting] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (!profileComplete && userData && !loading) {
      const timer = setTimeout(() => {
        setShowTooltip(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [profileComplete, userData, loading]);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const response = await authService.getCurrentUser();
      setUserData(response);
      
      const isComplete = response.profile_completed || false;
      setProfileComplete(isComplete);

      if (isComplete) {
        await fetchKYCStatus();
      }
    } catch (error) {
      console.error('❌ Failed to load profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchKYCStatus = async () => {
    setKycLoading(true);
    try {
      const response = await kycService.getKYCStatus();
      
      if (response && response.success && response.data) {
        setKycData(response.data);
      } else {
        setKycData(null);
      }
    } catch (error) {
      console.error('❌ Failed to load KYC status:', error);
      setKycData(null);
    } finally {
      setKycLoading(false);
    }
  };

  const handleCompleteProfile = () => {
    setShowTooltip(false);
    setSetupStartStep(2); // Start from Personal Details
    setShowSetupModal(true);
  };

  const handleCompleteKYC = () => {
    setSetupStartStep(3); // Start from KYC step
    setShowSetupModal(true);
  };

  const handleSetupComplete = async () => {
    setShowSetupModal(false);
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const freshUserData = await authService.getCurrentUser();
      setUserData(freshUserData);
      setProfileComplete(freshUserData.profile_completed || false);
      
      if (freshUserData.profile_completed) {
        await fetchKYCStatus();
      }
      
      toast.success('Setup completed successfully!');
    } catch (error) {
      console.error('Error refreshing profile:', error);
      toast.error('Setup updated, but failed to refresh. Please reload the page.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseTooltip = () => {
    setShowTooltip(false);
  };

  const handleBankSubmit = async (e) => {
    e.preventDefault();
    
    if (!bankFormData.accountNumber || !bankFormData.ifscCode) {
      toast.error('Please enter account number and IFSC code');
      return;
    }

    if (bankFormData.ifscCode.length !== 11) {
      toast.error('IFSC code should be 11 characters');
      return;
    }

    setBankSubmitting(true);
    try {
      const response = await kycService.verifyBank(
        bankFormData.accountNumber,
        bankFormData.ifscCode
      );

      if (response.success) {
        toast.success('Bank account verified successfully!');
        setShowBankForm(false);
        await fetchKYCStatus();
      }
    } catch (error) {
      toast.error(error.message || 'Bank verification failed');
    } finally {
      setBankSubmitting(false);
    }
  };

  const handleSkipBank = async () => {
    try {
      await kycService.skipBank();
      toast.success('Bank verification skipped. You can add it later from settings.');
      setShowBankForm(false);
    } catch (error) {
      toast.error('Failed to skip bank verification');
    }
  };

  const renderIcon = (iconName) => {
    const icons = {
      wave: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <path d="M7 12.5C7 12.5 8.5 14 10 14C11.5 14 13 12.5 13 12.5C13 12.5 14.5 14 16 14C17.5 14 19 12.5 19 12.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M7 8.5C7 8.5 8.5 10 10 10C11.5 10 13 8.5 13 8.5C13 8.5 14.5 10 16 10C17.5 10 19 8.5 19 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      warning: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
          <path d="M10.29 3.86L1.82 18C1.64537 18.3024 1.55296 18.6453 1.55199 18.9945C1.55101 19.3437 1.64151 19.6871 1.81445 19.9905C1.98738 20.2939 2.23675 20.5467 2.53773 20.7239C2.83871 20.901 3.18082 20.9962 3.53 21H20.47C20.8192 20.9962 21.1613 20.901 21.4623 20.7239C21.7633 20.5467 22.0126 20.2939 22.1856 19.9905C22.3585 19.6871 22.449 19.3437 22.448 18.9945C22.447 18.6453 22.3546 18.3024 22.18 18L13.71 3.86C13.5317 3.56611 13.2807 3.32312 12.9812 3.15448C12.6817 2.98585 12.3437 2.89725 12 2.89725C11.6563 2.89725 11.3183 2.98585 11.0188 3.15448C10.7193 3.32312 10.4683 3.56611 10.29 3.86V3.86Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 9V13M12 17H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      chart: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <path d="M18 20V10M12 20V4M6 20V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      users: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
          <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      money: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      trending: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <path d="M23 6L13.5 15.5L8.5 10.5L1 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M17 6H23V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      bank: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M3 21H21M3 10H21M5 6L12 3L19 6M4 10V21M8 10V21M12 10V21M16 10V21M20 10V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      target: (
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="2"/>
          <circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      close: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    };
    return icons[iconName] || null;
  };

  // Determine what to show based on status
  const needsPersonalDetails = !profileComplete;
  const needsKYC = profileComplete && kycData && (!kycData.aadhaar_verified || !kycData.pan_verified);
  const needsBank = profileComplete && kycData && kycData.aadhaar_verified && kycData.pan_verified && !kycData.bank_verified;
  const isFullyComplete = profileComplete && kycData && kycData.aadhaar_verified && kycData.pan_verified;

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-hero-single">
          <div className="hero-content-dash">
            <h1>
              Welcome back, <span className="name-highlight">{userData?.username || user?.username || 'User'}</span>
              <span className="wave-icon">{renderIcon('wave')}</span>
            </h1>
            <p className="hero-subtitle">
              {isFullyComplete 
                ? 'Your profile is complete! Start exploring investment opportunities.'
                : 'Complete your setup to unlock all features and start investing in properties.'}
            </p>

            {loading ? (
              <div className="loading-state-dash">
                <div className="loading-spinner">Loading your profile...</div>
              </div>
            ) : (
              <>
                {/* Case 1: Personal Details Pending */}
                {needsPersonalDetails && (
                  <div className="setup-prompt">
                    <div className="prompt-card">
                      <div className="prompt-icon">{renderIcon('warning')}</div>
                      <div className="prompt-content">
                        <h3>Complete Your Profile</h3>
                        <p>Add your personal details to get started</p>
                        <button className="btn-complete-setup" onClick={handleCompleteProfile}>
                          Complete Profile Setup
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Case 2: KYC Pending (Aadhaar/PAN) */}
                {needsKYC && (
                  <div className="setup-prompt">
                    <div className="prompt-card">
                      <div className="prompt-icon">{renderIcon('warning')}</div>
                      <div className="prompt-content">
                        <h3>Complete KYC Verification</h3>
                        <p>Verify your Aadhaar and PAN to start investing</p>
                        <button className="btn-complete-setup" onClick={handleCompleteKYC}>
                          Complete KYC Verification
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Case 3 & 4: Profile Complete - Show Full Dashboard */}
                {!needsPersonalDetails && !needsKYC && (
                  <div className="profile-complete-section">
                    {/* User Info Card */}
                    <div className="user-info-card">
                      <h3>Your Profile</h3>
                      <div className="info-grid">
                        <div className="info-item">
                          <span className="info-label">Name</span>
                          <span className="info-value">{userData?.username || 'Not provided'}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Email</span>
                          <span className="info-value">{userData?.email || 'Not provided'}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Phone</span>
                          <span className="info-value">{userData?.phone || 'Not provided'}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Date of Birth</span>
                          <span className="info-value">
                            {userData?.date_of_birth 
                              ? new Date(userData.date_of_birth).toLocaleDateString('en-IN', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric'
                                })
                              : 'Not provided'}
                          </span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Citizenship</span>
                          <span className="info-value">
                            {userData?.is_indian === true ? '🇮🇳 Indian' : 
                             userData?.is_indian === false ? '🌍 Non-Indian' : 
                             'Not specified'}
                          </span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">KYC Status</span>
                          <span className={`status-badge ${kycData?.status || 'pending'}`}>
                            {kycData?.status === 'verified' ? '✓ Verified' :
                             kycData?.status === 'rejected' ? '✗ Rejected' :
                             kycData?.status === 'under_review' ? '⏳ Under Review' :
                             '⏳ Pending'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* KYC Details Card */}
                    {kycData && (
                      <div className="kyc-details-card">
                        <h3>KYC Verification Details</h3>
                        <div className="kyc-checklist">
                          <div className={`kyc-check-item ${kycData.aadhaar_verified ? 'verified' : 'pending'}`}>
                            <span className="check-icon">
                              {kycData.aadhaar_verified ? '✓' : '○'}
                            </span>
                            <span className="check-label">Aadhaar Verified</span>
                          </div>
                          <div className={`kyc-check-item ${kycData.pan_verified ? 'verified' : 'pending'}`}>
                            <span className="check-icon">
                              {kycData.pan_verified ? '✓' : '○'}
                            </span>
                            <span className="check-label">PAN Verified</span>
                          </div>
                          <div className={`kyc-check-item ${kycData.bank_verified ? 'verified' : 'optional'}`}>
                            <span className="check-icon">
                              {kycData.bank_verified ? '✓' : '○'}
                            </span>
                            <span className="check-label">
                              Bank Account {!kycData.bank_verified ? '(Optional)' : ''}
                            </span>
                          </div>
                          <div className={`kyc-check-item ${kycData.pan_aadhaar_linked ? 'verified' : 'warning'}`}>
                            <span className="check-icon">
                              {kycData.pan_aadhaar_linked ? '✓' : '⚠'}
                            </span>
                            <span className="check-label">PAN-Aadhaar Linked</span>
                          </div>
                        </div>

                        {/* KYC Rejected */}
                        {kycData.status === 'rejected' && kycData.rejection_reason && (
                          <div className="kyc-rejection">
                            <h4>KYC Rejected</h4>
                            <p>{kycData.rejection_reason}</p>
                            <button className="btn-resubmit" onClick={handleCompleteKYC}>
                              Re-submit KYC
                            </button>
                          </div>
                        )}

                        {/* PAN-Aadhaar Not Linked Warning */}
                        {!kycData.pan_aadhaar_linked && kycData.pan_verified && (
                          <div className="kyc-warning">
                            <p>⚠ Your PAN and Aadhaar are not linked. Please link them for full access to all features.</p>
                          </div>
                        )}

                        {/* Case 3: Bank Pending - Show Prompt */}
                        {needsBank && !showBankForm && (
                          <div className="bank-prompt">
                            <div className="prompt-card">
                              <div className="prompt-icon">{renderIcon('bank')}</div>
                              <div className="prompt-content">
                                <h3>Add Bank Account</h3>
                                <p>Complete your verification by adding bank details</p>
                                <button className="btn-complete-setup" onClick={() => setShowBankForm(true)}>
                                  Add Bank Account
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Inline Bank Form */}
                        {showBankForm && (
                          <div className="bank-form-inline">
                            <div className="bank-form-header">
                              <div className="bank-form-icon">{renderIcon('bank')}</div>
                              <h4>Add Bank Account Details</h4>
                              <button className="bank-form-close" onClick={() => setShowBankForm(false)}>
                                {renderIcon('close')}
                              </button>
                            </div>
                            
                            <form onSubmit={handleBankSubmit}>
                              <div className="bank-form-row">
                                <div className="bank-form-group">
                                  <label>Account Number *</label>
                                  <input
                                    type="text"
                                    placeholder="1234567890"
                                    value={bankFormData.accountNumber}
                                    onChange={(e) => setBankFormData({
                                      ...bankFormData,
                                      accountNumber: e.target.value.replace(/\D/g, '')
                                    })}
                                    disabled={bankSubmitting}
                                    required
                                  />
                                </div>

                                <div className="bank-form-group">
                                  <label>IFSC Code *</label>
                                  <input
                                    type="text"
                                    placeholder="SBIN0001234"
                                    value={bankFormData.ifscCode}
                                    onChange={(e) => setBankFormData({
                                      ...bankFormData,
                                      ifscCode: e.target.value.toUpperCase()
                                    })}
                                    maxLength="11"
                                    disabled={bankSubmitting}
                                    style={{ textTransform: 'uppercase' }}
                                    required
                                  />
                                </div>
                              </div>

                              <div className="bank-form-info">
                                <p>🏦 Bank verification is optional but required for withdrawals</p>
                                <p>🔒 Your bank details are encrypted and secure</p>
                              </div>

                              <div className="bank-form-actions">
                                <button
                                  type="button"
                                  className="btn-bank-skip"
                                  onClick={handleSkipBank}
                                  disabled={bankSubmitting}
                                >
                                  Skip for Now
                                </button>
                                <button
                                  type="submit"
                                  className="btn-complete-setup"
                                  disabled={bankSubmitting || !bankFormData.accountNumber || !bankFormData.ifscCode}
                                >
                                  {bankSubmitting ? 'Verifying...' : 'Verify Bank Account'}
                                </button>
                              </div>
                            </form>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="dashboard-actions">
                      <button className="btn-primary-dash" onClick={() => navigate('/properties')}>
                        Explore Properties
                      </button>
                      <button className="btn-secondary-dash" onClick={() => navigate('/portfolio')}>
                        View Portfolio
                      </button>
                      <button className="btn-secondary-dash" onClick={() => navigate('/wallet')}>
                        My Wallet
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="quick-stats">
          <div className="stat-item">
            <div className="stat-icon-dash">{renderIcon('chart')}</div>
            <div className="stat-info">
              <span className="stat-label">Total Properties</span>
              <span className="stat-value">500+</span>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon-dash">{renderIcon('users')}</div>
            <div className="stat-info">
              <span className="stat-label">Active Investors</span>
              <span className="stat-value">10K+</span>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon-dash">{renderIcon('money')}</div>
            <div className="stat-info">
              <span className="stat-label">Total Investment</span>
              <span className="stat-value">₹50 Cr+</span>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon-dash">{renderIcon('trending')}</div>
            <div className="stat-info">
              <span className="stat-label">Avg. Returns</span>
              <span className="stat-value">12-15%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {showTooltip && (needsPersonalDetails || needsKYC) && (
        <div className="tooltip-overlay">
          <div className="tooltip-container">
            <button className="tooltip-close" onClick={handleCloseTooltip}>
              {renderIcon('close')}
            </button>
            <div className="tooltip-icon">{renderIcon('target')}</div>
            <h3>{needsPersonalDetails ? 'Complete Your Profile' : 'Complete KYC Verification'}</h3>
            <p>
              {needsPersonalDetails 
                ? 'Get full access to all features by completing your profile setup in just 2 simple steps.'
                : 'Verify your identity to start investing in properties.'}
            </p>
            <button 
              className="btn-tooltip" 
              onClick={needsPersonalDetails ? handleCompleteProfile : handleCompleteKYC}
            >
              Complete Now
            </button>
            <button className="btn-tooltip-skip" onClick={handleCloseTooltip}>
              Maybe Later
            </button>
          </div>
        </div>
      )}

      {/* Account Setup Modal */}
      {showSetupModal && (
        <AccountSetup
          onClose={() => setShowSetupModal(false)}
          onComplete={handleSetupComplete}
          startStep={setupStartStep}
        />
      )}
    </div>
  );
};

export default Dashboard;