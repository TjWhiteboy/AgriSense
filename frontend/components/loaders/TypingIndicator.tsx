import React from 'react';
import BotIcon from '../icons/BotIcon';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-start justify-start group">
      <div className="flex-shrink-0 mr-3">
        <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white shadow-sm">
          <BotIcon />
        </div>
      </div>
      <div className="bg-white dark:bg-gray-700 rounded-xl rounded-bl-none py-3 px-4 shadow-md border border-slate-100 dark:border-gray-600">
        <div className="flex items-center justify-center space-x-1">
          <span className="h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
          <span className="h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
          <span className="h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></span>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
