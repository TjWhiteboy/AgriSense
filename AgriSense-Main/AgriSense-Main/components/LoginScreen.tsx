
import React, { useState, useEffect, useRef } from 'react';
import type { SpeechRecognition, SpeechRecognitionEvent, SpeechRecognitionErrorEvent } from '../types';
import { TRANSLATIONS, INDIAN_STATES_DISTRICTS } from '../constants';
import { parseLoginDetailsFromSpeech } from '../services/geminiService';
import LeafLogoIcon from './icons/LeafLogoIcon';
import SpinnerIcon from './icons/SpinnerIcon';
import MicrophoneIcon from './icons/MicrophoneIcon';
import SpeakerIcon from './icons/SpeakerIcon';

interface LoginScreenProps {
  onLogin: (name: string, state: string, district: string) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [selectedState, setSelectedState] = useState(Object.keys(INDIAN_STATES_DISTRICTS)[0]);
  const [selectedDistrict, setSelectedDistrict] = useState(INDIAN_STATES_DISTRICTS[selectedState][0]);
  
  const [uiState, setUiState] = useState<'idle' | 'speaking_greeting' | 'listening' | 'parsing' | 'manual' | 'loggingIn'>('idle');
  const [manualIsSubmitting, setManualIsSubmitting] = useState(false);
  const [hasBeenGreeted, setHasBeenGreeted] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const newDistricts = INDIAN_STATES_DISTRICTS[selectedState] || [];
    setSelectedDistrict(newDistricts[0] || '');
  }, [selectedState]);

  // Setup speech recognition instance once on component mount.
  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      console.warn("Speech Recognition not supported.");
      setUiState('manual'); // Fallback if API is missing
      return;
    }
    
    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-IN';

    recognition.onresult = async (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      console.log("Transcript:", transcript);
      setUiState('parsing');
      try {
        const details = await parseLoginDetailsFromSpeech(transcript);
        console.log("Parsed details:", details);
        if (details.name) setName(details.name);
        if (details.state) setSelectedState(details.state);
        if (details.district) setSelectedDistrict(details.district);

        if (details.name && details.state && details.district) {
          setUiState('loggingIn');
          setTimeout(() => {
            onLogin(details.name!, details.state!, details.district!);
          }, 1000);
        } else {
          setUiState('manual');
        }
      } catch (error) {
        console.error("Error parsing speech:", error);
        setUiState('manual');
      }
    };
    recognition.onend = () => {
      if (uiState === 'listening') setUiState('idle');
    };
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error:", event.error);
      if (uiState === 'listening') setUiState('idle');
    };
    recognitionRef.current = recognition;
  // The 'uiState' dependency is removed to prevent re-creating the recognition object on every state change.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onLogin]);


  // This function is now more robust against browsers' asynchronous voice loading.
  const speakGreetingAndListen = () => {
      if (typeof window.speechSynthesis === 'undefined') {
          console.warn("Speech Synthesis API not supported, falling back to manual entry.");
          setUiState('manual');
          return;
      }
      
      // Cancel any ongoing speech from previous actions to prevent overlaps.
      window.speechSynthesis.cancel();
      
      const greetingText = TRANSLATIONS.loginGreetingSpokenFull;
      const utterance = new SpeechSynthesisUtterance(greetingText);
      
      utterance.lang = 'en-US'; 
      
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
          const selectedVoice = voices.find(v => v.lang.startsWith('en') && v.name.includes('Google')) 
                             || voices.find(v => v.lang.startsWith('en') && v.localService) 
                             || voices.find(v => v.lang.startsWith('en'));
          if (selectedVoice) {
              utterance.voice = selectedVoice;
          }
      }
      
      utterance.onend = () => {
          setUiState('listening');
          recognitionRef.current?.start();
      };
      
      utterance.onerror = (event) => {
          console.error("SpeechSynthesis Error:", event.error);
          setUiState('manual'); // Fallback if TTS fails
      };

      window.speechSynthesis.speak(utterance);
      setHasBeenGreeted(true);
  };
  
  const handleMicClick = () => {
    if (uiState === 'listening') {
      recognitionRef.current?.stop();
      return;
    }
    
    if (!hasBeenGreeted) {
        setUiState('speaking_greeting');
        speakGreetingAndListen();
    } else {
      setUiState('listening');
      recognitionRef.current?.start();
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && selectedState && selectedDistrict) {
      setManualIsSubmitting(true);
      setTimeout(() => {
        onLogin(name.trim(), selectedState, selectedDistrict);
      }, 500);
    }
  };

  const getButtonContent = () => {
    switch(uiState) {
        case 'speaking_greeting': return <SpeakerIcon />;
        case 'listening': return <div className="h-10 w-10 bg-red-500 rounded-full animate-pulse" />;
        case 'parsing':
        case 'loggingIn': return <SpinnerIcon className="h-10 w-10 text-green-500" />;
        default: return <MicrophoneIcon className="h-10 w-10" />;
    }
  }
  
  const getPromptText = () => {
    switch(uiState) {
        case 'speaking_greeting': return TRANSLATIONS.loginListenPrompt;
        case 'listening': return TRANSLATIONS.loginListeningPrompt;
        case 'parsing': return TRANSLATIONS.loginProcessing;
        case 'loggingIn': return `${TRANSLATIONS.welcomeBack}!`;
        case 'manual': return TRANSLATIONS.loginManualHeader;
        case 'idle':
        default:
            return TRANSLATIONS.loginStartPrompt;
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-[#0D1117] p-4 transition-colors duration-300 ease-in-out">
      <div className="w-full max-w-md mx-auto text-center">
        <div className="flex flex-col items-center justify-center mb-8">
          <LeafLogoIcon className="h-16 w-16 text-green-500 mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            {TRANSLATIONS.loginTitle}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-4 min-h-[2rem]">
            {getPromptText()}
          </p>
        </div>
        
        {uiState !== 'manual' && (
             <div className="flex flex-col items-center space-y-6">
                <button
                    onClick={handleMicClick}
                    disabled={['parsing', 'loggingIn', 'speaking_greeting'].includes(uiState)}
                    className="w-24 h-24 flex items-center justify-center rounded-full bg-white dark:bg-gray-700 text-green-500 dark:text-green-400 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-wait transition-all duration-300 ring-4 ring-green-500/20 hover:ring-green-500/40"
                    aria-label="Start voice login"
                >
                    {getButtonContent()}
                </button>
                <button onClick={() => setUiState('manual')} className="text-sm text-gray-500 dark:text-gray-400 hover:underline">
                    {TRANSLATIONS.loginManualButton}
                </button>
            </div>
        )}
       
        {uiState === 'manual' && (
            <form onSubmit={handleSubmit} className="bg-white dark:bg-[#161B22] shadow-xl rounded-2xl p-6 sm:p-8 space-y-6 border border-gray-200 dark:border-gray-700/80 text-left animate-fade-in transition-colors duration-300 ease-in-out">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {TRANSLATIONS.nameLabel}
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={manualIsSubmitting}
                  className="w-full p-2.5 text-sm bg-slate-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-gray-800 dark:text-gray-200 disabled:opacity-50"
                  placeholder="e.g., Thikash"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="state-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {TRANSLATIONS.stateLabel}
                  </label>
                  <select
                    id="state-select"
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    disabled={manualIsSubmitting}
                    className="w-full p-2.5 text-sm bg-slate-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-gray-800 dark:text-gray-200 disabled:opacity-50"
                  >
                    {Object.keys(INDIAN_STATES_DISTRICTS).map(stateName => (
                      <option key={stateName} value={stateName}>{stateName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="district-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {TRANSLATIONS.locationLabel}
                  </label>
                  <select
                    id="district-select"
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    disabled={!INDIAN_STATES_DISTRICTS[selectedState]?.length || manualIsSubmitting}
                    className="w-full p-2.5 text-sm bg-slate-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-gray-800 dark:text-gray-200 disabled:opacity-50"
                  >
                    {(INDIAN_STATES_DISTRICTS[selectedState] || []).map(districtName => (
                      <option key={districtName} value={districtName}>{districtName}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={manualIsSubmitting || !name.trim()}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-900 transition-all shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {manualIsSubmitting ? <SpinnerIcon className="h-5 w-5" /> : TRANSLATIONS.loginButton}
              </button>
            </form>
        )}
      </div>
    </div>
  );
};

export default LoginScreen;
