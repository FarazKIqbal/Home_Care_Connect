import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function ProtectedRoute({ children, requiredRole }) {
  const { currentUser, userRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-[#4B49AC] text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  if (!currentUser) {
    if (requiredRole === 'provider') {
      return <Navigate to="/login/ProviderLogin" replace />;
    }
    return <Navigate to="/login/UserLogin" replace />;
  }

  if (requiredRole && userRole !== requiredRole && !(requiredRole === 'customer' && userRole === 'user')) {
    // Redirect to their respective dashboard
    if (userRole === 'provider') {
      return <Navigate to="/provider/ProviderDashboard" replace />;
    }
    return <Navigate to="/dashboard/Dashboard" replace />;
  }

  return children;
}

export function CustomerRoute({ children }) {
  return <ProtectedRoute requiredRole="customer">{children}</ProtectedRoute>;
}

export function ProviderRoute({ children }) {
  return <ProtectedRoute requiredRole="provider">{children}</ProtectedRoute>;
}