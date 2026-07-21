import React from 'react';

interface LogoIconProps {
  className?: string;
}

const LogoIcon: React.FC<LogoIconProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className || "h-8 w-8 text-green-500"}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
     <path d="M12 0C7.8 0 4 3.8 4 8.6C4 14.5 12 24 12 24s8-9.5 8-15.4C20 3.8 16.2 0 12 0zm0 13c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z" />
  </svg>
);

export default LogoIcon;