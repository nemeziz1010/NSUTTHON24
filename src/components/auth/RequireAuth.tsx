import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './auth';

interface RequireAuthProps {
  children: ReactNode;
}

export const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const { user, loading } = useAuth();

  // If the auth status is still being determined, show a loading indicator or return null
  if (loading) {
    return <div>Loading...</div>;
  }

  // If the user is not authenticated, redirect to the login page.
  if (!user) {
    return <Navigate to="/" />;
  }

  // If the user is authenticated, render the children components.
  return <>{children}</>;
};
