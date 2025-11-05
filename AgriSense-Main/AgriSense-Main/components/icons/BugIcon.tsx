import React from 'react';

const BugIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 3l-2.5 2.5M16 3l2.5 2.5M3 8l2.5-2.5M21 8l-2.5-2.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v5M8 17l-3 3M16 17l3 3" />
    </svg>
);

export default BugIcon;
