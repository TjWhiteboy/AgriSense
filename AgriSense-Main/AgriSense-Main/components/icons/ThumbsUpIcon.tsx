import React from 'react';

const ThumbsUpIcon: React.FC<{ solid?: boolean }> = ({ solid = false }) => (
    solid ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333V17a1 1 0 001 1h6.364a1 1 0 00.942-.671l1.7-4.25a1 1 0 00-.942-1.329h-3.214a1 1 0 01-.942-.671l-1.25-3.126A1 1 0 008.364 3H7a1 1 0 00-1 1v6.333z" />
        </svg>
    ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.085a2 2 0 00-1.736.97l-2.714 4.223-1.39 2.086M7 20h2.172a2 2 0 001.732-1.03l.368-.614M7 20V10m0 10a2 2 0 01-2 2H3a2 2 0 01-2-2V12a2 2 0 012-2h2a2 2 0 012 2v8z" />
        </svg>
    )
);

export default ThumbsUpIcon;