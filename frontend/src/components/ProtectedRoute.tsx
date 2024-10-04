import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../authentication/authContext';

//protect other routes from unauthorised access

const ProtectedRoute: React.FC = () => {
    const { isAuthenticated } = useAuth();
  
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
  
    return <Outlet />;
  };
  
  export default ProtectedRoute;