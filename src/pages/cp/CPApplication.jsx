// CPApplication.jsx
// =====================================================
// CP Application Page - SIMPLIFIED
// No marketing content, just the form
// =====================================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import CPHeader from '../../components/cp/CPHeader';
import CPApplicationForm from '../../components/cp/CPApplicationForm';
import cpApplicationService from '../../services/cpApplicationService';
import '../../styles/cp/CPApplication.css';

const CPApplication = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(false);
  const [existingApplication, setExistingApplication] = useState(null);

  useEffect(() => {
    // Only check if user is logged in
    if (user) {
      checkExistingApplication();
    }
  }, [user]);

  const checkExistingApplication = async () => {
    try {
      setChecking(true);
      const result = await cpApplicationService.checkStatus();
      
      if (result.success && result.hasApplication) {
        setExistingApplication(result.data);
        navigate('/cp/application-status');
      }
    } catch (error) {
      console.error('Error checking application:', error);
    } finally {
      setChecking(false);
    }
  };

  const handleApplicationSuccess = () => {
    // After successful submission, redirect to login
    alert('Application submitted successfully! Please login to continue.');
    navigate('/login');
  };

  if (checking) {
    return (
      <div className="cp-application-page">
        <CPHeader />
        <div className="loading-state-dash">
          <div className="loading-spinner">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="cp-application-page">
      <CPHeader />
      
      <div className="cp-application-container">
        {/* Just the form - no hero, no benefits */}
        <CPApplicationForm 
          mode="self-apply"
          onSuccess={handleApplicationSuccess}
        />
      </div>
    </div>
  );
};

export default CPApplication;