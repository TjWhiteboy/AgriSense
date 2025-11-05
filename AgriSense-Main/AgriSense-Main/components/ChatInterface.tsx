
// Fix: Remove local type definitions and import centralized types to resolve conflicts.
import React, { useState, useRef, useEffect } from 'react';
import type { Message, SpeechRecognition, SpeechRecognitionEvent, SpeechRecognitionErrorEvent, User } from '../types';
import { TRANSLATIONS } from '../constants';
import MessageBubble from './MessageBubble';
import SendIcon from './icons/SendIcon';
import AttachmentIcon from './icons/AttachmentIcon';
import MicrophoneIcon from './icons/MicrophoneIcon';
import WelcomeScreen from './WelcomeScreen';
import SkeletonLoader from './loaders/SkeletonLoader';
import TypingIndicator from './loaders/TypingIndicator';
import VideoCameraIcon from './icons/VideoCameraIcon';
import LiveAnalysisModal from './LiveAnalysisModal';

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  isStreaming: boolean;
  onSendMessage: (inputText: string, imageFile: File | null) => void;
  isNewChat: boolean;
  isOnline: boolean;
  location: string;
  user: User;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  isLoading,
  isStreaming,
  onSendMessage,
  isNewChat,
  isOnline,
  location,
  user
}) => {
  const [inputText, setInputText] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isLiveModalOpen, setIsLiveModalOpen] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, isStreaming]);

  useEffect(() => {
    if (imageFile) {
      const objectUrl = URL.createObjectURL(imageFile);
      setImagePreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
    setImagePreview(null);
  }, [imageFile]);
  
  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto'; // Reset height
      const scrollHeight = textarea.scrollHeight;
      // Set the height, capped at a maximum value (e.g., 150px)
      textarea.style.height = `${Math.min(scrollHeight, 150)}px`;
    }
  }, [inputText]);

  // Setup Speech Recognition
  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      console.warn("Speech Recognition API is not supported in this browser.");
      return;
    }
    
    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = false; // Stop recording automatically after a pause
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    
    // A simplified and more robust handler for processing speech results.
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');
      setInputText(transcript);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    // Fix: Use strongly-typed event for onerror.
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      // The 'no-speech' error is a common occurrence when the user doesn't speak.
      // We handle it gracefully by stopping the recording without logging a console error.
      if (event.error !== 'no-speech') {
        console.error("Speech recognition error:", event.error);
      }
      setIsRecording(false);
    };
    
    recognitionRef.current = recognition;
  }, []);


  const handleMicClick = () => {
    if (!isOnline) return; // Disable mic when offline
    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      setInputText(''); // Clear text before starting new recording
      recognitionRef.current?.start();
      setIsRecording(true);
    }
  };


  const handleSend = () => {
    if (inputText.trim() || imageFile) {
      onSendMessage(inputText, imageFile);
      setInputText('');
      setImageFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };
  
  const removeImage = () => {
      setImageFile(null);
      if (fileInputRef.current) {
          fileInputRef.current.value = "";
      }
  }
  
  const handlePromptClick = (prompt: string) => {
      onSendMessage(prompt, null);
  }

  const canSendMessage = (!!inputText.trim() || !!imageFile) && !isLoading && !isStreaming && isOnline;

  return (
    <div className="flex-1 flex flex-col bg-transparent overflow-hidden h-full">
      <div className="flex-1 p-4 overflow-y-auto">
        {isNewChat && messages.length <= 1 ? (
          <WelcomeScreen onPromptClick={handlePromptClick} />
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {isLoading && <SkeletonLoader />}
            {isStreaming && !isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="p-2 sm:p-4">
        {imagePreview && (
          <div className="relative w-20 h-20 mb-2 ml-4">
            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg shadow-sm" />
            <button
              onClick={removeImage}
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center -mt-1 -mr-1 text-xs font-bold transition-transform hover:scale-110"
              title={TRANSLATIONS.removeImage}
              aria-label={TRANSLATIONS.removeImage}
            >
              &times;
            </button>
          </div>
        )}
        <div className="relative flex items-end bg-white dark:bg-[#161B22] rounded-2xl p-2 shadow-lg transition-all duration-300 ease-in-out focus-within:ring-2 focus-within:ring-green-500 border border-gray-200 dark:border-gray-700">
          <button onClick={handleAttachmentClick} title="Attach image" className="text-gray-500 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400 p-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={!isOnline}>
              <AttachmentIcon className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
            disabled={!isOnline}
          />
          <button 
              onClick={handleMicClick}
              title={isRecording ? TRANSLATIONS.stopRecording : TRANSLATIONS.startRecording}
              className={`p-2 rounded-full transition-colors ${isRecording ? 'text-red-500 animate-pulse' : 'text-gray-500 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400'} disabled:opacity-50 disabled:cursor-not-allowed`}
              disabled={!isOnline}
          >
              <MicrophoneIcon className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
           <button 
              onClick={() => setIsLiveModalOpen(true)}
              title={TRANSLATIONS.liveSession}
              aria-label={TRANSLATIONS.liveSession}
              className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!isOnline}
          >
              <VideoCameraIcon className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>

          <textarea
            ref={textareaRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isOnline ? TRANSLATIONS.sendMessagePlaceholder : "You are offline. Type a message to send later."}
            className="flex-1 bg-transparent text-gray-800 dark:text-gray-200 px-2 py-2 border-none resize-none focus:outline-none focus:ring-0 placeholder-gray-400 dark:placeholder-gray-500"
            rows={1}
            disabled={!isOnline}
          />
          
          <button
            onClick={handleSend}
            disabled={!canSendMessage}
            className="bg-gray-200 dark:bg-[#2D3340] text-gray-700 dark:text-white w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-md hover:bg-green-500 hover:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-lg disabled:shadow-none"
            aria-label="Send message"
          >
            <SendIcon />
          </button>
        </div>
      </div>
      <LiveAnalysisModal
        isOpen={isLiveModalOpen}
        onClose={() => setIsLiveModalOpen(false)}
        location={location}
        user={user}
      />
    </div>
  );
};

export default ChatInterface;
