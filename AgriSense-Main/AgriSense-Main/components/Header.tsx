
import React from 'react';
import type { Theme } from '../types';
import { TRANSLATIONS } from '../constants';
import SunIcon from './icons/SunIcon';
import MoonIcon from './icons/MoonIcon';
import LeafLogoIcon from './icons/LeafLogoIcon';
import MenuIcon from './icons/MenuIcon';

interface HeaderProps {
  theme: Theme;
  onToggleTheme: () => void;
  onToggleSidebar: () => void;
}

// FIX: The Header component was incomplete. It has been fully implemented with props and a default export.
const Header: React.FC<HeaderProps> = ({ theme, onToggleTheme, onToggleSidebar }) => {
  return (
    <header className="flex items-center justify-between p-2 sm:p-4 bg-white dark:bg-[#161B22] border-b border-gray-200 dark:border-gray-700/80 transition-colors duration-300 ease-in-out">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 md:hidden"
          aria-label="Toggle sidebar"
        >
          <MenuIcon />
        </button>
        <div className="flex items-center gap-2">
          <LeafLogoIcon className="h-8 w-8 text-green-500" />
          <div>
            <h1 className="text-lg font-bold text-gray-800 dark:text-gray-200">{TRANSLATIONS.headerTitle}</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">{TRANSLATIONS.headerSubtitle}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center">
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300 ease-in-out"
          aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        >
          {theme === 'light' ? <MoonIcon /> : <SunIcon />}
        </button>
      </div>
    </header>
  );
};

export default Header;
