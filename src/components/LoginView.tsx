import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const LoginView: React.FC = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        setError(null);
        try {
            await login();
            // Indiquer que la redirection est en cours
            setError('Connexion réussie ! Redirection en cours...');
            // Redirection vers la page d'accueil après une authentification réussie
            navigate('/');
        } catch (err: any) {
            setError(err.message || 'Erreur de connexion');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-axiom-dark via-axiom-medium to-axiom-dark">
            <div className="card max-w-md w-full p-8 text-center space-y-6 animate-popIn shadow-glow">
                {/* Logo */}
                <div className="space-y-2">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-axiom-accent to-axiom-accent-light bg-clip-text text-transparent">
                        AXIOM
                    </h1>
                    <p className="text-axiom-text-secondary mt-2 text-sm">
                        L'Intelligence Artificielle pour Architectes d'Idées
                    </p>
                </div>

                {/* Illustration */}
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-axiom-accent/20 to-axiom-accent-light/20 flex items-center justify-center border-2 border-axiom-accent/30">
                    <svg className="w-12 h-12 text-axiom-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                </div>

                {/* Google Login Button */}
                <button
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                    className="w-full bg-white hover:bg-gray-50 text-gray-800 font-semibold py-4 px-6 rounded-xl shadow-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                    {isLoading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin" />
                            <span>Connexion en cours...</span>
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Continuer avec Google
                        </>
                    )}
                </button>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                        <p className="text-red-500 text-sm">{error}</p>
                    </div>
                )}

                {/* Footer */}
                <div className="space-y-2 pt-4 border-t border-white/10">
                    <p className="text-axiom-text-secondary text-xs">
                        En vous connectant, vous acceptez nos conditions d'utilisation
                    </p>
                    <p className="text-axiom-text-secondary text-xs opacity-60">
                        Vos données sont sécurisées avec Firebase Authentication
                    </p>
                </div>
            </div>
        </div>
    );
};
