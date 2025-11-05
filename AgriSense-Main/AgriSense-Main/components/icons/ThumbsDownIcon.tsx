import React from 'react';

const ThumbsDownIcon: React.FC<{ solid?: boolean }> = ({ solid = false }) => (
    solid ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667V3a1 1 0 00-1-1H6.636a1 1 0 00-.942.671l-1.7 4.25a1 1 0 00.942 1.329h3.214a1 1 0 01.942.671l1.25 3.126A1 1 0 0011.636 17H13a1 1 0 001-1V9.667z" />
        </svg>
    ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.738 3h4.017c.163 0 .326.02.485.06L17 4m-7 10v5a2 2 0 002 2h.085a2 2 0 001.736-.97l2.714-4.223 1.39-2.086M17 4h-2.172a2 2 0 00-1.732 1.03l-.368.614M17 4V14m0-10a2 2 0 012-2h2a2 2 0 012 2v8a2 2 0 01-2 2h-2a2 2 0 01-2-2V4z" />
        </svg>
    )
);

export default ThumbsDownIcon;