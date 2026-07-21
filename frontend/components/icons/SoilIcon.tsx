import React from 'react';

// Fix: Add className prop to allow custom styling
const SoilIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h10a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.704 4.045a2 2 0 013.456.542l.922 2.028a2 2 0 001.84 1.385h.091a2 2 0 001.84-1.385l.922-2.028a2 2 0 013.456-.542m-11.952 0h11.952" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21V11" />
    </svg>
);

export default SoilIcon;