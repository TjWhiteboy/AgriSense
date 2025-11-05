import React from 'react';

const SeedlingIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m-4-6.5a4 4 0 014-4h.01M16 11.5a4 4 0 01-4 4h-.01M12 8V5a2 2 0 012-2h0a2 2 0 012 2v3m-4 5v3a2 2 0 002 2h0a2 2 0 002-2v-3" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18" />
    </svg>
);

export default SeedlingIcon;
