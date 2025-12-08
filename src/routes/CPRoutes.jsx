// CPRoutes.jsx
// =====================================================
// Protected Routes for Channel Partners
// Handles different CP states: Not Applied, Pending, Approved, Rejected
// =====================================================

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// CP Pages
import CPDashboard from '../pages/cp/CPDashboard';
import CPApplication from '../pages/cp/CPApplication';
import CPApplicationStatus from '../pages/cp/CPApplicationStatus';
import CPProperties from '../pages/cp/CPProperties';
import CPCustomers from '../pages/cp/CPCustomers';
import CPLeads from '../pages/cp/CPLeads';
import CPInvites from '../pages/cp/CPInvites';
import CPCommissions from '../pages/cp/CPCommissions';
import CPProfile from '../pages/cp/CPProfile';

// Loading Component
const LoadingState = () => (
  <div className="loading-state-dash">
    <div className="loading-spinner">Loading...</div>
  </div>
);

// Protected Route for Approved CPs Only
const CPProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingState />;
  }

  // Not logged in - redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check CP status
  const isChannelPartner = user?.role?.slug === 'channel_partner' || user?.is_cp === true;
  const cpStatus = user?.cp_status || user?.onboarding_status;
  const isActiveCP = user?.is_active_cp || cpStatus === 'approved' || cpStatus === 'completed';

  // Not a CP at all - redirect to application
  if (!isChannelPartner) {
    return <Navigate to="/cp/apply" replace />;
  }

  // CP but not approved - redirect to status page
  if (!isActiveCP) {
    return <Navigate to="/cp/application-status" replace />;
  }

  // Approved CP - allow access
  return children;
};

// Public CP Routes (accessible to logged-in users)
const PublicCPRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingState />;
  }

  // Not logged in - redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Application Route - Special handling
// Application Route - PUBLIC (No login required)
const ApplicationRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingState />;
  }

  // ✅ CHANGED: Allow application WITHOUT login
  if (!user) {
    return <CPApplication />;  // Show form to anyone
  }

  // Check if already a CP
  const isChannelPartner = user?.role?.slug === 'channel_partner' || user?.is_cp === true;
  const cpStatus = user?.cp_status || user?.onboarding_status;
  const isActiveCP = user?.is_active_cp || cpStatus === 'approved' || cpStatus === 'completed';

  // Already approved CP - redirect to dashboard
  if (isChannelPartner && isActiveCP) {
    return <Navigate to="/cp/dashboard" replace />;
  }

  // Has pending application - redirect to status
  if (isChannelPartner && (cpStatus === 'pending' || cpStatus === 'in_progress')) {
    return <Navigate to="/cp/application-status" replace />;
  }

  // Application rejected or not applied yet - show application form
  return <CPApplication />;
};

// Status Route - Special handling
const StatusRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingState />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const isChannelPartner = user?.role?.slug === 'channel_partner' || user?.is_cp === true;
  const cpStatus = user?.cp_status || user?.onboarding_status;
  const isActiveCP = user?.is_active_cp || cpStatus === 'approved' || cpStatus === 'completed';

  // Not a CP - redirect to application
  if (!isChannelPartner) {
    return <Navigate to="/cp/apply" replace />;
  }

  // Approved CP - redirect to dashboard
  if (isActiveCP) {
    return <Navigate to="/cp/dashboard" replace />;
  }

  // Pending/Rejected - show status page
  return <CPApplicationStatus />;
};

const CPRoutes = () => {
  return (
    <Routes>
      {/* Application Route - Smart redirect based on status */}
      <Route path="/apply" element={<ApplicationRoute />} />
      
      {/* Status Route - Smart redirect based on status */}
      <Route path="/application-status" element={<StatusRoute />} />
      <Route path="/status" element={<StatusRoute />} /> {/* Alias */}

      {/* Protected CP Routes - Only for Approved Channel Partners */}
      <Route
        path="/dashboard"
        element={
          <CPProtectedRoute>
            <CPDashboard />
          </CPProtectedRoute>
        }
      />
      <Route
        path="/properties"
        element={
          <CPProtectedRoute>
            <CPProperties />
          </CPProtectedRoute>
        }
      />
      <Route
        path="/customers"
        element={
          <CPProtectedRoute>
            <CPCustomers />
          </CPProtectedRoute>
        }
      />
      <Route
        path="/leads"
        element={
          <CPProtectedRoute>
            <CPLeads />
          </CPProtectedRoute>
        }
      />
      <Route
        path="/invites"
        element={
          <CPProtectedRoute>
            <CPInvites />
          </CPProtectedRoute>
        }
      />
      <Route
        path="/commissions"
        element={
          <CPProtectedRoute>
            <CPCommissions />
          </CPProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <CPProtectedRoute>
            <CPProfile />
          </CPProtectedRoute>
        }
      />

      {/* Default redirect - Intelligent based on status */}
      <Route path="/" element={<Navigate to="/cp/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/cp/dashboard" replace />} />
    </Routes>
  );
};

export default CPRoutes;