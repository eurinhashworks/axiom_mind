import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { currentUser, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-axiom-dark via-axiom-medium to-axiom-dark">
                <div className="space-y-4 text-center">
                    <div className="w-16 h-16 border-4 border-axiom-accent border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-axiom-text-secondary text-lg">Vérification de l'authentification...</p>
                    <p className="text-axiom-text-secondary/70 text-sm">Veuillez patienter</p>
                </div>
            </div>
        );
    }

    return currentUser ? <>{children}</> : <Navigate to="/login" replace />;
};
