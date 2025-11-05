
import React from 'react';
import { TRANSLATIONS } from '../constants';
import AlertTriangleIcon from './icons/AlertTriangleIcon';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  // This is an inline style tag to define animations. It's a simple way to add animations
  // without needing to configure PostCSS or other build tools for keyframe animations.
  const animationStyles = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in { animation: fadeIn 0.2s ease-out forwards; }
    .animate-slide-in { animation: slideIn 0.3s ease-out forwards; }
  `;

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmation-title"
    >
      <style>{animationStyles}</style>
      <div
        className="bg-white dark:bg-[#161B22] rounded-2xl w-full max-w-sm shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700 animate-slide-in transition-colors duration-300 ease-in-out"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/40">
                <AlertTriangleIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 id="confirmation-title" className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                {title}
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {message}
            </p>
        </div>
        <div className="bg-gray-50 dark:bg-[#21262D]/50 px-4 py-3 sm:px-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 transition-colors duration-300 ease-in-out">
            <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto justify-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 dark:focus:ring-offset-gray-800 transition-colors duration-300 ease-in-out"
            >
                {TRANSLATIONS.cancelButton}
            </button>
            <button
                type="button"
                onClick={handleConfirm}
                className="w-full sm:w-auto justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-800 transition-colors duration-300 ease-in-out"
            >
                {TRANSLATIONS.confirmButton}
            </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
