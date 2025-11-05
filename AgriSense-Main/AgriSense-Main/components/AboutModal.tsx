
import React from 'react';
import { TRANSLATIONS } from '../constants';
import MapPinLogoIcon from './icons/MapPinLogoIcon';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

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
          aria-labelledby="about-title"
        >
          <style>{animationStyles}</style>
          <div
            className="bg-white dark:bg-[#161B22] rounded-2xl w-full max-w-lg shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700 animate-slide-in transition-colors duration-300 ease-in-out"
            onClick={(e) => e.stopPropagation()}
          >
              <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                      <MapPinLogoIcon className="h-12 w-12 text-green-500" />
                      <div>
                        <h3 id="about-title" className="text-xl font-bold text-gray-900 dark:text-gray-100">
                            AgriSense
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{TRANSLATIONS.headerSubtitle}</p>
                      </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Developed by <strong>Thikash</strong>, AgriSense is a Management Information System designed to function as a powerful Decision Support System for farmers, converting complex data into simple, actionable intelligence.
                  </p>
                  
                  <div className="space-y-3 text-sm">
                      <h4 className="font-semibold text-gray-800 dark:text-gray-200">Key Features:</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                          <li><strong>AI Advisory Chat:</strong> On-demand expert advice through a multi-modal interface (text, voice, image).</li>
                          <li><strong>Proactive Dashboard:</strong> Real-time analytics on weather, soil health, and market trends.</li>
                          <li><strong>Live Video Analysis:</strong> Instantaneous, spoken feedback via a live video stream from the user's camera.</li>
                          <li><strong>Offline Support:</strong> Messages are queued and sent automatically when connectivity is restored.</li>
                      </ul>

                      <h4 className="font-semibold text-gray-800 dark:text-gray-200 pt-2">Technology Stack:</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                          <li><strong>AI Core:</strong> Google Gemini API</li>
                          <li><strong>Frontend:</strong> React & TypeScript</li>
                          <li><strong>Offline Storage:</strong> IndexedDB</li>
                      </ul>
                  </div>

              </div>
              <div className="bg-gray-50 dark:bg-[#21262D]/50 px-6 py-3 flex justify-end transition-colors duration-300 ease-in-out">
                  <button
                      type="button"
                      onClick={onClose}
                      className="w-full sm:w-auto justify-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 dark:focus:ring-offset-gray-800 transition-colors duration-300 ease-in-out"
                  >
                      Close
                  </button>
              </div>
          </div>
        </div>
    );
};

export default AboutModal;
