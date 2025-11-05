import React from 'react';

// Fix: Add className prop to allow custom styling
const WaterDropIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a5 5 0 01-.88-9.914A6 6 0 0118 8a6.002 6.002 0 01-4.12 9.914A5.001 5.001 0 017 16z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.002 9.002 0 004.5-1.635" />
    </svg>
);

export default WaterDropIcon;