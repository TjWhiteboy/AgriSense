
import React, { useState, useEffect, useRef } from 'react';
import type { Message } from '../types';
import LeafLogoIcon from './icons/LeafLogoIcon';
import UserIcon from './icons/UserIcon';
import ThumbsUpIcon from './icons/ThumbsUpIcon';
import ThumbsDownIcon from './icons/ThumbsDownIcon';
import SpeakerIcon from './icons/SpeakerIcon';
import StopIcon from './icons/StopIcon';
import CopyIcon from './icons/CopyIcon';
import CheckIcon from './icons/CheckIcon';
import ShareIcon from './icons/ShareIcon'; // Import the new icon
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ShieldCheckIcon from './icons/ShieldCheckIcon';
import WaterDropIcon from './icons/WaterDropIcon';
import SeedlingIcon from './icons/SeedlingIcon';
import { TRANSLATIONS } from '../constants';

interface MessageBubbleProps {
  message: Message;
  isStreamingTarget?: boolean;
}

// A simple animation component to wrap the message bubble
const AnimatedBubble: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    // Delay visibility to allow CSS transition to take effect on mount
    const timer = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`transition-all duration-500 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
      {children}
    </div>
  );
};

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isStreamingTarget = false }) => {
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [showFeedbackConfirmation, setShowFeedbackConfirmation] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isVoiceAvailable, setIsVoiceAvailable] = useState(false);
  const [copied, setCopied] = useState(false);
  const utteranceQueue = useRef<SpeechSynthesisUtterance[]>([]);

  // Typewriter effect state
  const [displayedText, setDisplayedText] = useState(message.text);

  useEffect(() => {
    // If not streaming, show full text immediately
    if (!isStreamingTarget) {
      setDisplayedText(message.text);
    } else if (message.text.length < displayedText.length) {
      // Handle case where text might be reset (e.g. retry or error clearing)
      setDisplayedText(message.text);
    }
  }, [isStreamingTarget, message.text, displayedText.length]);

  useEffect(() => {
    // Typing animation loop
    if (isStreamingTarget && displayedText.length < message.text.length) {
      // Adaptive speed: if backlog is huge, type faster
      const distance = message.text.length - displayedText.length;
      const speed = distance > 50 ? 5 : distance > 20 ? 10 : 20;
      
      const timer = setTimeout(() => {
        setDisplayedText(message.text.slice(0, displayedText.length + 1));
      }, speed);
      
      return () => clearTimeout(timer);
    }
  }, [isStreamingTarget, displayedText, message.text]);

  // This effect manages loading browser voices and checking if a voice for the
  // currently selected language is available.
  useEffect(() => {
    const updateVoicesAndAvailability = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
        // Check if any installed voice starts with 'en' (e.g., 'en-US', 'en-GB').
        const hasVoice = availableVoices.some(v => v.lang.startsWith('en'));
        setIsVoiceAvailable(hasVoice);
        // Once voices are loaded, we don't need the listener anymore.
        window.speechSynthesis.onvoiceschanged = null;
      }
    };

    // Voices may load asynchronously. This listener ensures we check them once they are ready.
    window.speechSynthesis.onvoiceschanged = updateVoicesAndAvailability;
    updateVoicesAndAvailability(); // Also call it immediately in case they are already loaded.

    // Cleanup function: stop any speech and remove the listener when the component
    // unmounts, preventing memory leaks.
    return () => {
      utteranceQueue.current = [];
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // Recursively speaks the next utterance in the queue until it's empty.
  const speakNextInQueue = () => {
    if (utteranceQueue.current.length > 0) {
      const utteranceToSpeak = utteranceQueue.current.shift();
      if (utteranceToSpeak) {
        window.speechSynthesis.speak(utteranceToSpeak);
      }
    } else {
      setIsSpeaking(false); // All utterances have been spoken
    }
  };

  const handleTextToSpeech = (text: string) => {
    if (isSpeaking) {
      // If already speaking, stop everything.
      utteranceQueue.current = [];
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    if (!isVoiceAvailable) return;

    // Split long text into smaller chunks (max 180 chars) to avoid issues with
    // the SpeechSynthesis API's character limits on some browsers.
    const chunks = text.match(/.{1,180}(\s|\.|\?|!|$)/g) || [];
    if (chunks.length === 0) return;

    // Dynamically find voices that match the base language code 'en'.
    const matchingVoices = voices.filter(voice => voice.lang.startsWith('en'));
    if (matchingVoices.length === 0) return; // Safeguard
    
    // Prioritize higher-quality voices from the matching set.
    const selectedVoice = 
        matchingVoices.find(v => v.name.includes('Google')) || // Prefer Google voices
        matchingVoices.find(v => v.localService) || // Then local system voices
        matchingVoices[0]; // Fallback to the first available voice for that language.
    
    if (!selectedVoice) return; // Safeguard, should be prevented by isVoiceAvailable check.

    // Create a queue of utterance objects, one for each text chunk.
    utteranceQueue.current = chunks.map(chunk => {
      const utterance = new SpeechSynthesisUtterance(chunk.trim());
      utterance.lang = selectedVoice.lang;
      utterance.voice = selectedVoice;
      utterance.onend = speakNextInQueue; // When one ends, the next one starts.
      utterance.onerror = (event) => {
        // The 'interrupted' error is expected when another speech request starts.
        // We handle it gracefully by resetting state without logging a console error.
        if (event.error !== 'interrupted') {
          console.error("SpeechSynthesis Error:", event.error);
        }
        utteranceQueue.current = []; // Clear queue on error
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      };
      return utterance;
    });

    setIsSpeaking(true);
    speakNextInQueue(); // Start speaking the first item in the queue.
  };

  const handleCopy = () => {
    if (navigator.clipboard && message.text) {
      navigator.clipboard.writeText(message.text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
      });
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: 'AgriSense Advice',
      text: message.text,
    };
    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support the Share API
      handleCopy();
      alert('Content copied to clipboard. You can now paste it to share.');
    }
  };

  const handleFeedback = (type: 'up' | 'down') => {
    setFeedback(type);
    setFeedbackSent(true);
    setShowFeedbackConfirmation(true);

    // This is where we send the data to our pipeline.
    // In a real app, the '/api/feedback' endpoint would be an HTTP Cloud Function.
    fetch('/api/feedback', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            messageId: message.id,
            feedback: type === 'up' ? 'good' : 'bad',
            // In a real app, you'd also send the chat ID
        }),
    }).catch(error => {
        // If the API call fails, we can log it or handle it gracefully.
        // For this demo, we'll just log it.
        console.error("Failed to send feedback to pipeline:", error);
    });

    setTimeout(() => {
      setShowFeedbackConfirmation(false);
    }, 2000);
  };
  
  // Generates the appropriate title/tooltip for the speaker button.
  const getSpeakerButtonTitle = () => {
      if (!isVoiceAvailable) {
          return `An English voice is not available in this browser.`;
      }
      return isSpeaking ? TRANSLATIONS.stopReading : TRANSLATIONS.readAloud;
  };

  const isUser = message.role === 'user';
  
  // Attempt to parse structured disease JSON for AI replies
  let parsedDiseaseData = null;
  if (!isUser && message.text && !isStreamingTarget) {
      try {
          const cleanText = message.text.replace(/```json/g, '').replace(/```/g, '').trim();
          if (cleanText.startsWith('{') && cleanText.endsWith('}')) {
              const parsed = JSON.parse(cleanText);
              if (parsed.disease && parsed.confidence) {
                  parsedDiseaseData = parsed;
              }
          }
      } catch (e) {
          // not valid json, fallback to normal text
      }
  }
  
  const bubbleClasses = isUser
    ? 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg'
    : 'bg-gray-100 dark:bg-[#21262D] text-gray-800 dark:text-gray-200 shadow-lg border border-slate-200 dark:border-gray-700';
  const containerClasses = isUser ? 'justify-end' : 'justify-start';
  const bubbleAlignment = isUser ? 'rounded-br-none' : 'rounded-bl-none';
  const streamingClasses = isStreamingTarget ? 'ring-2 ring-green-500 animate-pulse-ring' : '';

  return (
    <AnimatedBubble>
      <div className={`flex items-start ${containerClasses} group`}>
          {!isUser && (
              <div className="flex-shrink-0 mr-3">
                  <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white shadow-sm">
                      <LeafLogoIcon className="h-6 w-6" />
                  </div>
              </div>
          )}
          {isUser && message.text && (
            <div className="self-end mr-2 flex items-center gap-1 opacity-100 md:opacity-0 group-hover:md:opacity-100 transition-opacity duration-300">
               <button 
                  onClick={handleCopy} 
                  className="p-1.5 rounded-full text-gray-400 dark:text-gray-500 hover:bg-slate-200/50 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-500 ease-in-out"
                  title={copied ? TRANSLATIONS.copied : TRANSLATIONS.copy}
                  aria-label={copied ? TRANSLATIONS.copied : TRANSLATIONS.copy}
               >
                  {copied ? <CheckIcon /> : <CopyIcon />}
              </button>
            </div>
          )}
        <div className={`rounded-xl p-3 max-w-[85%] sm:max-w-md lg:max-w-xl ${bubbleClasses} ${bubbleAlignment} ${streamingClasses} transition-all duration-500 ease-in-out group-hover:shadow-xl group-hover:-translate-y-0.5`}>
          {message.image && (
            <img
              src={message.image}
              alt="User upload"
              className="rounded-lg mb-2 max-w-xs max-h-64 object-contain"
            />
          )}
          {message.text && !parsedDiseaseData && (
              <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-headings:my-2">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {isStreamingTarget ? displayedText + ' ▍' : message.text}
                </ReactMarkdown>
              </div>
          )}
          {parsedDiseaseData && (
              <div className="flex flex-col gap-3 mt-1">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                      <div className="flex justify-between items-start mb-2">
                          <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                              <span className="mr-2">🔬</span>{parsedDiseaseData.disease}
                          </h4>
                          <span className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 text-xs font-bold px-2 py-1 rounded-full">
                              {parsedDiseaseData.confidence} Confidence
                          </span>
                      </div>
                      
                      {parsedDiseaseData.cause && (
                          <div className="mt-3 text-sm">
                              <p className="font-semibold text-gray-700 dark:text-gray-300">Cause / Details</p>
                              <p className="text-gray-600 dark:text-gray-400 mt-1">{parsedDiseaseData.cause}</p>
                          </div>
                      )}

                      {parsedDiseaseData.treatment && (
                          <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-lg">
                              <p className="font-semibold text-amber-800 dark:text-amber-500 mb-1 flex items-center gap-1">
                                  <ShieldCheckIcon className="w-4 h-4" /> Recommended Treatment
                              </p>
                              <p className="text-sm text-amber-900 dark:text-amber-200">{parsedDiseaseData.treatment}</p>
                          </div>
                      )}

                      {(parsedDiseaseData.organic_solution || parsedDiseaseData.chemical_solution) && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 text-sm">
                              {parsedDiseaseData.organic_solution && (
                                  <div className="bg-lime-50 dark:bg-lime-900/10 border border-lime-100 dark:border-lime-900/30 p-3 rounded-lg text-lime-900 dark:text-lime-200">
                                      <p className="font-bold flex items-center gap-1 mb-1"><SeedlingIcon className="w-4 h-4" /> Organic</p>
                                      <p>{parsedDiseaseData.organic_solution}</p>
                                  </div>
                              )}
                              {parsedDiseaseData.chemical_solution && (
                                  <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 p-3 rounded-lg text-blue-900 dark:text-blue-200">
                                      <p className="font-bold flex items-center gap-1 mb-1"><WaterDropIcon className="w-4 h-4" /> Chemical</p>
                                      <p>{parsedDiseaseData.chemical_solution}</p>
                                  </div>
                              )}
                          </div>
                      )}

                      {parsedDiseaseData.prevention && (
                          <div className="mt-3 text-sm border-t border-gray-100 dark:border-gray-700 pt-3">
                              <p className="font-semibold text-gray-700 dark:text-gray-300">Prevention Strategy</p>
                              <p className="text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">{parsedDiseaseData.prevention}</p>
                          </div>
                      )}
                  </div>
              </div>
          )}
        </div>
          {isUser && (
              <div className="flex-shrink-0 ml-3">
                  <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300">
                      <UserIcon />
                  </div>
              </div>
          )}
          {!isUser && message.text && (
              <div className="self-end ml-2 flex items-center gap-1 opacity-100 md:opacity-0 group-hover:md:opacity-100 transition-opacity duration-300">
                   <button 
                      onClick={handleShare}
                      className="p-1.5 rounded-full text-gray-400 dark:text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-500 ease-in-out"
                      title="Share advice"
                      aria-label="Share advice"
                   >
                     <ShareIcon />
                   </button>
                   <button 
                      onClick={() => message.text && handleTextToSpeech(message.text)} 
                      disabled={!isVoiceAvailable}
                      className={`p-1.5 rounded-full text-gray-400 dark:text-gray-500 transition-colors duration-500 ease-in-out ${!isVoiceAvailable ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-gray-600 dark:hover:text-gray-300'} ${isSpeaking ? 'animate-pulse' : ''}`} 
                      title={getSpeakerButtonTitle()}
                      aria-label={getSpeakerButtonTitle()}
                   >
                      {isSpeaking ? <StopIcon /> : <SpeakerIcon />}
                  </button>
                   <button 
                      onClick={handleCopy} 
                      className="p-1.5 rounded-full text-gray-400 dark:text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-500 ease-in-out"
                      title={copied ? TRANSLATIONS.copied : TRANSLATIONS.copy}
                      aria-label={copied ? TRANSLATIONS.copied : TRANSLATIONS.copy}
                   >
                      {copied ? <CheckIcon /> : <CopyIcon />}
                  </button>

                  {showFeedbackConfirmation ? (
                    <div 
                      className="p-1 text-xs text-gray-500 dark:text-gray-400"
                      role="status"
                      aria-live="polite"
                    >
                      {TRANSLATIONS.feedbackSent}
                    </div>
                  ) : (
                    <>
                      <button 
                        onClick={() => handleFeedback('up')} 
                        disabled={feedbackSent}
                        title={feedbackSent ? TRANSLATIONS.feedbackSent : TRANSLATIONS.goodResponse}
                        aria-label={feedbackSent ? TRANSLATIONS.feedbackSent : TRANSLATIONS.goodResponse}
                        className={`p-1 rounded-full disabled:cursor-not-allowed ${feedback === 'up' ? 'text-green-500 bg-green-100 dark:bg-green-900/50' : 'text-gray-400 dark:text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-gray-600 dark:hover:text-gray-300'}`}>
                          <ThumbsUpIcon solid={feedback === 'up'} />
                      </button>
                       <button 
                          onClick={() => handleFeedback('down')} 
                          disabled={feedbackSent}
                          title={feedbackSent ? TRANSLATIONS.feedbackSent : TRANSLATIONS.badResponse}
                          aria-label={feedbackSent ? TRANSLATIONS.feedbackSent : TRANSLATIONS.badResponse}
                          className={`p-1 rounded-full disabled:cursor-not-allowed ${feedback === 'down' ? 'text-red-500 bg-red-100 dark:bg-red-900/50' : 'text-gray-400 dark:text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-gray-600 dark:hover:text-gray-300'}`}>
                          <ThumbsDownIcon solid={feedback === 'down'} />
                      </button>
                    </>
                  )}
              </div>
          )}
      </div>
    </AnimatedBubble>
  );
};

export default MessageBubble;
