
import React from 'react';
import { TRANSLATIONS } from '../constants';

const Footer: React.FC = () => {
    return (
        <footer className="text-center p-2 text-xs text-gray-500 dark:text-gray-700">
            <p>{TRANSLATIONS.footerText}</p>
        </footer>
    );
};

export default Footer;
