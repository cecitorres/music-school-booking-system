// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ user, role, redirectPath = '/login' }) => {
//   if (!user || user.role !== role) {
//     return <Navigate to={redirectPath} replace />;
//   }
  return <Outlet />;
};

export default ProtectedRoute;