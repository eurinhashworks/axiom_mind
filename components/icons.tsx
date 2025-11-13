
import React from 'react';

export const MicIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
  </svg>
);

export const SendIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

export const TelescopeIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 10l-2 2" />
  </svg>
);

export const ArrowRightIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

export const AxiomIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 10L90 50L50 90L10 50L50 10Z" stroke="url(#paint0_linear_axiom)" strokeWidth="8"/>
        <path d="M50 25L75 50L50 75L25 50L50 25Z" fill="url(#paint1_linear_axiom)"/>
        <defs>
            <linearGradient id="paint0_linear_axiom" x1="50" y1="10" x2="50" y2="90" gradientUnits="userSpaceOnUse">
                <stop stopColor="#6A45FF"/>
                <stop offset="1" stopColor="#8A6EFF"/>
            </linearGradient>
            <linearGradient id="paint1_linear_axiom" x1="50" y1="25" x2="50" y2="75" gradientUnits="userSpaceOnUse">
                <stop stopColor="#A0A0A3"/>
                <stop offset="1" stopColor="#EAEAEB"/>
            </linearGradient>
        </defs>
    </svg>
);
