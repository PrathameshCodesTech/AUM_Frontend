import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requireAdmin = false, requireCP = false }) => {
  const { user, loading, isAuthenticated } = useAuth();

  // Show loading state
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check admin access
  if (requireAdmin) {
    if (user?.role !== 'admin' && !user?.is_admin) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  // Check CP access
  if (requireCP) {
    const isCP = user?.role === 'channel_partner' || user?.is_cp === true;
    const isActiveCP = isCP && (user?.cp_status === 'approved' || user?.is_active_cp === true);
    
    if (!isActiveCP) {
      // If CP but not approved, redirect to status page
      if (isCP) {
        return <Navigate to="/cp/status" replace />;
      }
      // Not a CP at all, redirect to dashboard
      return <Navigate to="/dashboard" replace />;
    }
  }

  // User has access
  return children;
};

export default ProtectedRoute;