import React from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '@/contexts/AuthContext';
import { Outlet } from 'react-router';

const ProtectedRoute = ({ children }) => {
    const { user, isLoading } = useAuth();
    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />; // Redirect to login page if not authenticated
    }

    return <Outlet />;
}

export default ProtectedRoute