import React from 'react';

interface LeafLogoIconProps {
  className?: string;
}

const LeafLogoIcon: React.FC<LeafLogoIconProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className={className}
    fill="currentColor"
  >
    <path d="M19.46,19.25H4.54a1.75,1.75,0,0,1,0-3.5H19.46a1.75,1.75,0,0,1,0,3.5Z"/>
    <path d="M12,18.5V11.38c0,0,2.83-1.53,5-7.53,0,0-1.52,3.06-4,5.1-0.4,0.32-1,0.63-1,10.55Z"/>
    <path d="M12,18.5V11.38c0,0-2.83-1.53-5-7.53,0,0,1.52,3.06,4,5.1,0.4,0.32,1,0.63,1,10.55Z"/>
  </svg>
);

export default LeafLogoIcon;
