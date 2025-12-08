import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/authService';
import OTPModal from './OTPModal';
import logoImage from '../assets/AssetKart-1.png';
import '../styles/LoginSignup.css';

const LoginSignup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [isLogin, setIsLogin] = useState(true);
  const [mobileNo, setMobileNo] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);

  // Validation
  const validateForm = () => {
    if (!mobileNo || mobileNo.length !== 10) {
      toast.error('Please enter a valid 10-digit mobile number');
      return false;
    }

    if (!isLogin) {
      if (!name.trim()) {
        toast.error('Please enter your full name');
        return false;
      }
      if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
        toast.error('Please enter a valid email address');
        return false;
      }
    }

    return true;
  };

  // Send OTP
  const handleSendOTP = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await authService.sendOTP(
        mobileNo,
        !isLogin, // isSignup
        name,
        email
      );

      toast.success(response.message || 'OTP sent successfully!');
      setShowOTPModal(true);
    } catch (error) {
      // Handle specific error codes
      if (error.error === 'phone_exists') {
        toast.error(error.message);
        // Switch to login mode
        setIsLogin(true);
      } else if (error.error === 'phone_not_found') {
        toast.error(error.message);
        // Switch to signup mode
        setIsLogin(false);
      } else {
        toast.error(error.message || error.error || 'Failed to send OTP');
      }
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
// Verify OTP
  const handleVerifyOTP = async (otp) => {
  try {
    await login(mobileNo, otp);  // ✅ This already handles navigation!
    toast.success('Login successful!');
    setShowOTPModal(false);
    
    // ✅ Only handle special case of pending CP application
    const pendingApplication = localStorage.getItem('pending_cp_application');
    if (pendingApplication) {
      toast.info('Completing your CP application...', { duration: 3000 });
      navigate('/cp/apply');
    }
    // ✅ No else needed - AuthContext.login() already navigated!
    
  } catch (error) {
    toast.error(error.message || error.error || 'Invalid OTP');
    throw error;
  }
};

  // Resend OTP
  const handleResendOTP = async () => {
    try {
      const response = await authService.sendOTP(
        mobileNo,
        !isLogin,
        name,
        email
      );
      toast.success('OTP resent successfully!');
    } catch (error) {
      toast.error('Failed to resend OTP');
    }
  };

  const handleGoogleSignIn = () => {
    toast.error('Google Sign-In coming soon!');
  };

  // NEW: Handle CP Application
  const handleBecomeCP = () => {
    navigate('/cp/apply');
  };

  return (
    <>
      <div className="login-signup-container">
        <div className="left-panel">
          <div className="form-content">
            <div className="toggle-buttons">
              <button 
                className={`toggle-btn ${isLogin ? 'active' : ''}`}
                onClick={() => setIsLogin(true)}
              >
                Login
              </button>
              <button 
                className={`toggle-btn ${!isLogin ? 'active' : ''}`}
                onClick={() => setIsLogin(false)}
              >
                Signup
              </button>
            </div>
            
            <div className="form-wrapper">
              {!isLogin && (
                <>
                  <div className="input-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div className="input-group">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                    />
                  </div>
                </>
              )}
              
              <div className="input-group">
                <label>Enter Mobile No *</label>
                <div className="phone-input-wrapper">
                  <span className="country-code">+91</span>
                  <input
                    type="tel"
                    value={mobileNo}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setMobileNo(value);
                    }}
                    placeholder="Enter mobile number"
                    maxLength="10"
                    className="phone-input"
                  />
                </div>
              </div>
              
              <button 
                className="otp-button" 
                onClick={handleSendOTP}
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
              
              <div className="divider">
                <span>OR</span>
              </div>
              
              <button className="google-button" onClick={handleGoogleSignIn}>
                <svg className="google-icon" viewBox="0 0 24 24" width="20" height="20">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign {isLogin ? 'In' : 'Up'} With Google
              </button>

              {/* NEW: Channel Partner CTA */}
              <div className="cp-cta-section">
                <div className="cp-divider"></div>
                <div className="cp-info-box">
                  <div className="cp-icon">🤝</div>
                  <div className="cp-content">
                    <h3>Want to Earn with AssetKart?</h3>
                    <p>Become a Channel Partner and earn attractive commissions</p>
                  </div>
                </div>
                <button className="become-cp-button" onClick={handleBecomeCP}>
                  <span className="cp-btn-icon">💰</span>
                  Become a Channel Partner
                </button>
              </div>
            </div>
            
            <div className="footer-text">
              Copyright © <span className="brand-link">AssetKart</span> 2025
            </div>
          </div>
        </div>
        
        <div className="right-panel">
          <div className="overlay"></div>
          <img 
            src="https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=2070&auto=format&fit=crop" 
            alt="City Buildings" 
            className="background-image"
          />
        </div>
      </div>

      <OTPModal
        isOpen={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        phoneNumber={mobileNo}
        onVerify={handleVerifyOTP}
        onResend={handleResendOTP}
      />
    </>
  );
};

export default LoginSignup;