
import React from 'react';
import { TRANSLATIONS, WELCOME_PROMPTS } from '../constants';
import MapPinLogoIcon from './icons/MapPinLogoIcon';

interface WelcomeScreenProps {
  onPromptClick: (prompt: string) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onPromptClick }) => {
  const prompts = WELCOME_PROMPTS;

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
      <div className="flex flex-col items-center justify-center flex-grow">
          <MapPinLogoIcon className="h-16 w-16 text-green-500 mb-4" />
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            {TRANSLATIONS.headerTitle}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            {TRANSLATIONS.welcomeTitle}
          </p>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pb-16">
        {prompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => onPromptClick(prompt)}
            className="text-left group bg-white/50 dark:bg-[#161B22]/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-white dark:hover:bg-[#161B22] hover:shadow-lg hover:-translate-y-1 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <p className="font-medium text-sm text-gray-700 dark:text-gray-300">{prompt}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default WelcomeScreen;
