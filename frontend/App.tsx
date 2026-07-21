
import React, { useState, useEffect, useCallback } from 'react';
import type { Message, Theme, ChatSession, ChatMetadata } from './types';
import Header from './components/Header';
import ContextSelector from './components/ContextSelector';
import ChatInterface from './components/ChatInterface';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AdminCropManager from './components/AdminCropManager';
import ProfilePage from './components/ProfilePage';
import SettingsPage from './components/SettingsPage';
import LoginPage from './components/LoginPage';
import AdminPanel from './components/AdminPanel';
import LandingPage from './pages/LandingPage';
import WeatherPage from './pages/WeatherPage';
import MarketPage from './pages/MarketPage';
import SchemesPage from './pages/SchemesPage';
import NotificationsPage from './pages/NotificationsPage';
import useAuth, { isAuthenticated } from './hooks/useAuth';
import { chatService } from './services/chatService';
import { INDIAN_STATES_DISTRICTS, COMMON_CROPS, TRANSLATIONS, WELCOME_PROMPTS } from './constants';
import { offlineService } from './services/offlineService';
import Preloader from './components/Preloader';
import ConfirmationModal from './components/ConfirmationModal';
import AboutModal from './components/AboutModal';

const THEME_KEY = 'agriSenseTheme';

const App: React.FC = () => {
  const { user, state: savedState, district: savedDistrict, login, logout, isLoading: isAuthLoading } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);

  const [context, setContext] = useState({
    state: savedState || Object.keys(INDIAN_STATES_DISTRICTS)[0],
    district: savedDistrict || INDIAN_STATES_DISTRICTS[savedState || Object.keys(INDIAN_STATES_DISTRICTS)[0]][0],
    crop: COMMON_CROPS[0],
  });

  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  });

  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const [chats, setChats] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
  const [currentView, setCurrentView] = useState<'chat' | 'dashboard' | 'crops' | 'profile' | 'settings' | 'admin' | 'weather' | 'market' | 'schemes' | 'notifications'>('dashboard');
  const [showLanding, setShowLanding] = useState(true);
  const [confirmation, setConfirmation] = useState<{
    action: () => void;
    title: string;
    message: string;
  } | null>(null);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  useEffect(() => {
    // Sync app context with any changes from auth (e.g., on initial load)
    setContext(prev => ({
      ...prev,
      state: savedState || Object.keys(INDIAN_STATES_DISTRICTS)[0],
      district: savedDistrict || INDIAN_STATES_DISTRICTS[savedState || Object.keys(INDIAN_STATES_DISTRICTS)[0]][0]
    }));
  }, [savedState, savedDistrict]);

  // Effect to manage online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      offlineService.syncQueue(handleSendMessage);
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if (isOnline) {
      offlineService.syncQueue(handleSendMessage);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);


  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const loadChats = useCallback(async () => {
    setIsLoading(true);
    try {
      const history = await chatService.getHistory();
      const formattedChats = history.map((chat: any) => ({
        id: chat._id,
        title: (chat.userMessage || '').split(' ').slice(0, 5).join(' ') || 'Chat',
        timestamp: new Date(chat.createdAt),
        messages: [
          { id: `u-${chat._id}`, role: 'user', text: chat.userMessage, timestamp: new Date(chat.createdAt) },
          { id: `m-${chat._id}`, role: 'model', text: chat.aiReply, timestamp: new Date(chat.createdAt) }
        ]
      }));
      setChats(formattedChats);
    } catch (err) {
      console.error("Failed to load history", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      loadChats();
      if (!activeChatId) {
        handleNewChat(false); // Don't switch view on initial load
      }
    }
  }, [user, activeChatId, loadChats]);

  useEffect(() => {
    if (activeChatId === null && user) {
      const personalizedMessage = `Hello! I'm AgriSense, your agricultural assistant.\nI understand you're a farmer in ${context.district}, ${context.state}, and your primary crop of interest is ${context.crop}.\n\nHow can I help you today with your ${context.crop} crop or any other agricultural needs? Please feel free to ask me about:\n- Disease and pest identification\n- Treatment recommendations (organic or chemical)\n- Crop management practices\n- Interpreting your farm data\n\nI'm here to provide simple, actionable advice tailored to your region.`;
      setMessages([
        {
          id: 'initial-message',
          role: 'model',
          text: personalizedMessage,
          timestamp: new Date(),
        },
      ]);
    }
  }, [activeChatId, user, context]);

  const handleSendMessage = useCallback(async (inputText: string, imageFile: File | null) => {
    if (!inputText.trim() && !imageFile) return;

    setCurrentView('chat');

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: inputText,
      image: imageFile ? URL.createObjectURL(imageFile) : undefined,
      timestamp: new Date(),
    };

    // This logic ensures that if we are starting a new chat, the old "initial message" is cleared.
    const currentMessages = activeChatId === null ? [] : messages;
    const updatedMessages = [...currentMessages, userMessage];
    setMessages(updatedMessages);

    if (!navigator.onLine) {
      await offlineService.addToQueue(inputText, imageFile);
      setMessages((prev) => [...prev, {
        id: 'offline-notice',
        role: 'model',
        text: 'You are offline. Your message has been queued and will be sent when you reconnect.',
        timestamp: new Date()
      }]);
      return;
    }

    setIsLoading(true);
    setIsStreaming(false);

    // Verify district is never undefined. If missing, use user's profile district.
    const effectiveDistrict = context.district || savedDistrict;
    const effectiveState = context.state || savedState;
    const effectiveCrop = context.crop;

    if (!effectiveDistrict) {
      setIsLoading(false);
      setMessages((prev) => [...prev, {
        id: `weather-error-${Date.now()}`,
        role: 'model',
        text: '⚠️ **Weather Error:** Missing district information. Please select your district in the context selector or update your profile to receive accurate weather and farming recommendations.',
        timestamp: new Date()
      }]);
      return;
    }

    let currentChatId = activeChatId;

    if (currentChatId === null) {
      const newChatId = `chat-${Date.now()}`;
      setActiveChatId(newChatId);
      currentChatId = newChatId;
    }

    try {
      const replyText = await chatService.sendMessage(inputText, imageFile, { state: effectiveState, district: effectiveDistrict, crop: effectiveCrop });
      setIsLoading(false);

      const modelMessageId = `model-${Date.now()}`;
      const finalModelMessage: Message = {
        id: modelMessageId,
        role: 'model',
        text: replyText,
        timestamp: new Date(),
      };
      // Use the updatedMessages which already includes the user's message
      setMessages([...updatedMessages, finalModelMessage]);

      // We call loadChats to refresh the history sidebar after sending a message
      loadChats();

    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'model',
        text: TRANSLATIONS.errorMessage,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  }, [context, messages, activeChatId, loadChats]);

  const handleNewChat = (switchView = true) => {
    setActiveChatId(null);
    setMessages([]); // Clears messages for the new chat
    if (switchView) setCurrentView('chat');
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleSelectChat = async (id: string) => {
    const chat = chats.find(c => c.id === id);
    if (chat) {
      setActiveChatId(chat.id);
      setMessages(chat.messages);
      setCurrentView('chat');
    }
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleDeleteChat = async (id: string) => {
    setConfirmation({
      title: TRANSLATIONS.deleteChatConfirmTitle,
      message: TRANSLATIONS.deleteChatConfirmMessage,
      action: async () => {
        await chatService.deleteHistory(id);
        if (activeChatId === id) {
          handleNewChat(false);
          setCurrentView('dashboard');
        }
        loadChats();
      }
    });
  };

  const handleDownloadChat = async (id: string) => {
    try {
      const chat = chats.find(c => c.id === id);
      if (!chat) {
        console.error("Chat not found for download");
        return;
      }

      // Format chat into a plain text string
      let textContent = `AgriSense Chat\n`;
      textContent += `Title: ${chat.title}\n`;
      textContent += `Date: ${new Date(chat.timestamp).toLocaleString()}\n\n`;
      textContent += "========================================\n\n";

      chat.messages.forEach(message => {
        // Do not include the initial welcome message in the download
        if (message.id === 'initial-message') return;

        const role = message.role === 'user' ? 'You' : 'AgriSense';
        textContent += `--- ${role} (${new Date(message.timestamp).toLocaleString()}) ---\n`;
        if (message.image) {
          textContent += `[Image Attached]\n`;
        }
        if (message.text) {
          textContent += `${message.text}\n`;
        }
        textContent += `\n`;
      });

      const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      const safeTitle = chat.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      a.download = `agrisense-chat-${safeTitle}.txt`;

      document.body.appendChild(a);
      a.click();

      document.body.removeChild(a);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Failed to download chat:", error);
    }
  };

  const handleLogout = () => {
    setConfirmation({
      title: TRANSLATIONS.logoutConfirmTitle,
      message: TRANSLATIONS.logoutConfirmMessage,
      action: () => {
        logout();
        setChats([]);
        setActiveChatId(null);
        setMessages([]);
      }
    });
  };

  const handleProfileUpdate = (updatedUser: any) => {
    // Update auth state with correct login signature
    login(updatedUser.name, updatedUser.email);
    // Also persist extended profile fields to localStorage
    const stored = localStorage.getItem('agriSenseAuth');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        parsed.user = { ...parsed.user, ...updatedUser };
        localStorage.setItem('agriSenseAuth', JSON.stringify(parsed));
      } catch {}
    }
  };

  const handleDeleteAccount = () => {
    logout();
    setChats([]);
    setActiveChatId(null);
    setMessages([]);
  };

  const isNewChat = activeChatId === null;

  if (isAuthLoading) {
    return <Preloader />;
  }

  // Show Landing Page for unauthenticated users who haven't clicked login
  if (!isAuthenticated() || !user) {
    if (showLanding) {
      return <LandingPage onLogin={() => setShowLanding(false)} onSignup={() => setShowLanding(false)} />;
    }
    return <LoginPage onLogin={login} />;
  }

  return (
    <div className="flex h-screen text-gray-800 dark:text-gray-200 bg-slate-50 dark:bg-[#0D1117] transition-colors duration-500 ease-in-out">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-10 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
      <Sidebar
        isOpen={isSidebarOpen}
        chats={chats}
        activeChatId={activeChatId}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
        onDownloadChat={handleDownloadChat}
        currentView={currentView}
        onSetView={setCurrentView}
        user={user}
        onLogout={handleLogout}
        onOpenAboutModal={() => setIsAboutModalOpen(true)}
        notificationCount={0}
      />
      <div className="flex flex-col flex-1 h-screen">
        <Header
          theme={theme}
          onToggleTheme={handleToggleTheme}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <main className="flex-1 flex flex-col max-w-7xl w-full mx-auto p-2 sm:p-4 overflow-hidden">
          {!isOnline && (
            <div className="bg-yellow-500/20 border border-yellow-600/30 text-yellow-800 dark:text-yellow-200 text-sm rounded-lg p-3 mb-4 text-center">
              You are currently offline. Messages will be sent when you reconnect.
            </div>
          )}
          {currentView === 'chat' && (
            <ContextSelector
              state={context.state}
              district={context.district}
              crop={context.crop}
              onStateChange={(st) => setContext((prev) => ({ ...prev, state: st, district: INDIAN_STATES_DISTRICTS[st][0] }))}
              onDistrictChange={(dist) => setContext((prev) => ({ ...prev, district: dist }))}
              onCropChange={(crp) => setContext((prev) => ({ ...prev, crop: crp }))}
            />
          )}

          <div className="flex-1 overflow-y-auto relative">
            {currentView === 'chat' && (
              <ChatInterface
                messages={messages}
                isLoading={isLoading}
                isStreaming={isStreaming}
                onSendMessage={handleSendMessage}
                isNewChat={isNewChat}
                isOnline={isOnline}
                location={context.district}
                user={user}
              />
            )}
            {currentView === 'dashboard' && (
              <Dashboard 
                  location={context.district} 
                  crop={context.crop} 
                  chats={chats}
                  onSetView={setCurrentView}
              />
            )}
            {currentView === 'crops' && (
              <AdminCropManager />
            )}
            {currentView === 'profile' && (
              <ProfilePage
                user={user}
                onProfileUpdate={handleProfileUpdate}
                onLogout={handleLogout}
                onDeleteAccount={handleDeleteAccount}
              />
            )}
            {currentView === 'settings' && (
              <SettingsPage
                theme={theme}
                onThemeChange={handleToggleTheme}
                onLogout={handleLogout}
              />
            )}
            {currentView === 'admin' && user?.role === 'admin' && (
              <AdminPanel user={user} />
            )}
            {currentView === 'weather' && (
              <WeatherPage district={context.district} />
            )}
            {currentView === 'market' && <MarketPage />}
            {currentView === 'schemes' && <SchemesPage />}
            {currentView === 'notifications' && <NotificationsPage />}
          </div>

        </main>
        <Footer />
      </div>
      <ConfirmationModal
        isOpen={!!confirmation}
        onClose={() => setConfirmation(null)}
        onConfirm={confirmation?.action || (() => { })}
        title={confirmation?.title || ''}
        message={confirmation?.message || ''}
      />
      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
      />
    </div>
  );
};

export default App;
