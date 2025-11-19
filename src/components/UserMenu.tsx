import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const UserMenu: React.FC = () => {
    const { currentUser, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!currentUser) return null;

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 p-2 rounded-xl hover:bg-white/10 transition-colors"
                title="Menu utilisateur"
            >
                <img
                    src={currentUser.photoURL || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(currentUser.displayName || 'User')}
                    alt={currentUser.displayName || 'User'}
                    className="w-8 h-8 rounded-full border-2 border-axiom-accent shadow-sm"
                />
                <span className="text-axiom-text-primary text-sm font-medium hidden md:block">
                    {currentUser.displayName?.split(' ')[0] || 'Utilisateur'}
                </span>
                <svg
                    className={`w-4 h-4 text-axiom-text-secondary transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-72 card p-4 space-y-3 animate-fadeIn shadow-glow z-50">
                    {/* User Info */}
                    <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                        <img
                            src={currentUser.photoURL || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(currentUser.displayName || 'User')}
                            alt={currentUser.displayName || 'User'}
                            className="w-12 h-12 rounded-full"
                        />
                        <div className="flex-1 min-w-0">
                            <p className="text-axiom-text-primary font-medium truncate">
                                {currentUser.displayName || 'Utilisateur'}
                            </p>
                            <p className="text-axiom-text-secondary text-xs truncate">
                                {currentUser.email}
                            </p>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-2 py-2">
                        <div className="text-center p-2 rounded-lg bg-axiom-accent/5">
                            <p className="text-xs text-axiom-text-secondary">Notes</p>
                            <p className="text-lg font-bold text-axiom-accent">-</p>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-axiom-success/5">
                            <p className="text-xs text-axiom-text-secondary">Idées</p>
                            <p className="text-lg font-bold text-axiom-success">-</p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-1 pt-2 border-t border-white/10">
                        <button
                            onClick={async () => {
                                if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
                                    await logout();
                                    setIsOpen(false);
                                }
                            }}
                            className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Déconnexion
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
