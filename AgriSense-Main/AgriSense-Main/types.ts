

export type Role = 'user' | 'model';

export type LanguageCode = 'en';

export type Theme = 'light' | 'dark';

export interface Language {
  code: LanguageCode;
  name: string;
}

export interface Message {
  id: string;
  role: Role;
  text: string;
  image?: string; // URL for displaying the image
  timestamp: Date;
}

// Represents the full chat session stored in the database
export interface ChatSession {
  id: string;
  title: string;
  timestamp: Date;
  messages: Message[];
}

// Represents the lightweight chat metadata for display in the sidebar
export interface ChatMetadata {
  id: string;
  title: string;
  timestamp: Date;
}

// Represents a logged-in user
export interface User {
  name: string;
}


// Fix: Add TypeScript definitions for the Web Speech API to be used across the app.
export interface SpeechRecognitionEvent extends Event {
  readonly results: SpeechRecognitionResultList;
  readonly resultIndex: number;
}
export interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}
export interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}
export interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}
export interface SpeechRecognitionErrorEvent extends Event {
    readonly error: string;
}
export interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
    // Fix: Add webkitAudioContext type to the global Window interface to fix TypeScript errors.
    webkitAudioContext?: typeof AudioContext;
  }
}
