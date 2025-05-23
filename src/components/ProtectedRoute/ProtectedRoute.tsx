// src/components/ProtectedRoute/ProtectedRoute.tsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import authService from "../../services/AuthService.ts";

interface ProtectedRouteProps {
  allowedUserTypes: string[];
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedUserTypes, children }) => {
  const token = authService.getToken();
  const userType = authService.getUserTypeFromToken();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!userType || !allowedUserTypes.includes(userType)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Si el usuario está logueado y tiene el tipo permitido
  // Si 'children' se usa, es para rutas anidadas que se renderizan con <Outlet />
  // Si no, este componente actúa como un wrapper directo para un elemento de ruta.
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
