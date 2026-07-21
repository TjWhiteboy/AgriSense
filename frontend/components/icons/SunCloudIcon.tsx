import React from 'react';

// Fix: Add className prop to allow custom styling
const SunCloudIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-12 w-12 opacity-80"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 15.75c0-1.02.433-1.95.882-2.625a4.502 4.502 0 017.238-3.483c.31-.66.86-1.222 1.518-1.608a4.5 4.5 0 015.352 5.923c.376.06.74.183 1.088.36a3.75 3.75 0 013.234 4.085c0 2.062-1.678 3.75-3.75 3.75H5.25a3.75 3.75 0 01-2.25-3.75z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0112 4.5zM17.66 6.34a.75.75 0 011.06 1.06l-1.06 1.06a.75.75 0 01-1.06-1.06l1.06-1.06zM21 12a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5a.75.75 0 01.75.75z" />
    </svg>
);

export default SunCloudIcon;