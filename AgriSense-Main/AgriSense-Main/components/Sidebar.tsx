
import React, { useState } from 'react';
import type { ChatMetadata, User } from '../types';
import { TRANSLATIONS } from '../constants';
import NewChatIcon from './icons/NewChatIcon';
import TrashIcon from './icons/TrashIcon';
import SearchIcon from './icons/SearchIcon';
import DashboardIcon from './icons/DashboardIcon';
import ChatBubbleIcon from './icons/ChatBubbleIcon';
import LogoutIcon from './icons/LogoutIcon';
import InformationCircleIcon from './icons/InformationCircleIcon';

interface SidebarProps {
  isOpen: boolean;
  chats: ChatMetadata[];
  activeChatId: string | null;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
  currentView: 'chat' | 'dashboard';
  onSetView: (view: 'chat' | 'dashboard') => void;
  user: User;
  onLogout: () => void;
  onOpenAboutModal: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  chats,
  activeChatId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  currentView,
  onSetView,
  user,
  onLogout,
  onOpenAboutModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent onSelectChat from firing
    onDeleteChat(id);
  };

  const filteredChats = chats.filter(chat =>
    chat.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <aside
      className={`absolute md:relative z-20 flex flex-col bg-slate-100 dark:bg-[#161B22] border-r border-slate-200 dark:border-[#2D3340] transition-all duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 w-64 h-full flex-shrink-0`}
    >
      <div className="p-4 border-b border-slate-200 dark:border-[#2D3340] space-y-4">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-900 transition-all shadow-md hover:shadow-lg"
        >
          <NewChatIcon />
          <span>{TRANSLATIONS.newChat}</span>
        </button>
        <div className="relative">
            <input
                type="text"
                placeholder={TRANSLATIONS.searchChats}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-200 dark:bg-gray-800 border-transparent focus:border-green-500 focus:ring-green-500 rounded-md text-sm pl-9"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <SearchIcon />
            </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto">
        <ul className="p-2 space-y-1">
          {filteredChats.map((chat) => (
            <li key={chat.id}>
              <button
                onClick={() => onSelectChat(chat.id)}
                className={`w-full text-left text-sm px-3 py-2 rounded-md transition-colors group flex justify-between items-center ${
                  activeChatId === chat.id && currentView === 'chat'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200'
                    : 'text-gray-600 hover:bg-slate-200/70 dark:text-gray-300 dark:hover:bg-gray-700/70'
                }`}
              >
                <span className="truncate flex-1 pr-2">{chat.title}</span>
                 <span
                    onClick={(e) => handleDelete(e, chat.id)}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 dark:hover:text-red-400 p-1 rounded-full hover:bg-slate-200 dark:hover:bg-gray-600"
                    title="Delete chat"
                  >
                   <TrashIcon />
                </span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* View Switcher */}
      <div className="p-2 border-t border-slate-200 dark:border-[#2D3340]">
        <ul className="space-y-1">
            <li>
                <button onClick={() => onSetView('dashboard')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium ${currentView === 'dashboard' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200' : 'text-gray-600 hover:bg-slate-200/70 dark:text-gray-300 dark:hover:bg-gray-700/70'}`}>
                    <DashboardIcon />
                    {TRANSLATIONS.dashboard}
                </button>
            </li>
            <li>
                <button onClick={() => onSetView('chat')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium ${currentView === 'chat' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200' : 'text-gray-600 hover:bg-slate-200/70 dark:text-gray-300 dark:hover:bg-gray-700/70'}`}>
                    <ChatBubbleIcon />
                    {TRANSLATIONS.chat}
                </button>
            </li>
        </ul>
      </div>

      {/* User Profile Section */}
      <div className="p-4 border-t border-slate-200 dark:border-[#2D3340]">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full bg-green-200 dark:bg-green-900 flex items-center justify-center text-green-700 dark:text-green-200 font-bold flex-shrink-0">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{TRANSLATIONS.welcomeBack}</p>
                </div>
            </div>
            <div className="flex items-center flex-shrink-0">
                <button 
                    onClick={onOpenAboutModal}
                    title="About AgriSense"
                    className="p-2 text-gray-500 rounded-md hover:bg-slate-200 dark:text-gray-400 dark:hover:bg-gray-700"
                >
                    <InformationCircleIcon />
                </button>
                <button 
                    onClick={onLogout}
                    title={TRANSLATIONS.logoutButton}
                    className="p-2 text-gray-500 rounded-md hover:bg-slate-200 dark:text-gray-400 dark:hover:bg-gray-700"
                >
                    <LogoutIcon />
                </button>
            </div>
        </div>
      </div>

    </aside>
  );
};

export default Sidebar;
