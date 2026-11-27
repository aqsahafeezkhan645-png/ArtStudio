import React from "react";
import { Navigate } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";

export default function ProtectedRoute({
  children,
  requiredRole
}) {
  const { user, authLoading } = useApp();

  if (authLoading) {
    return <div>Checking account permissions...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}