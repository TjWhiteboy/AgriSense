import React, { useState } from 'react';
import type { ChatMetadata, User } from '../types';
import { TRANSLATIONS } from '../constants';

const NavItem: React.FC<{
  icon: string;
  label: string;
  active?: boolean;
  onClick: () => void;
  badge?: number;
}> = ({ icon, label, active, onClick, badge }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
      active
        ? 'bg-primary-800 text-white shadow-md shadow-primary-800/30'
        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary-800 dark:hover:text-primary-400'
    }`}
  >
    <span className="text-lg">{icon}</span>
    <span className="flex-1 text-left">{label}</span>
    {badge !== undefined && badge > 0 && (
      <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
        {badge > 9 ? '9+' : badge}
      </span>
    )}
  </button>
);

interface SidebarProps {
  isOpen: boolean;
  chats: ChatMetadata[];
  activeChatId: string | null;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
  onDownloadChat: (id: string) => void;
  currentView: 'chat' | 'dashboard' | 'crops' | 'profile' | 'settings' | 'admin' | 'weather' | 'market' | 'schemes' | 'notifications';
  onSetView: (view: 'chat' | 'dashboard' | 'crops' | 'profile' | 'settings' | 'admin' | 'weather' | 'market' | 'schemes' | 'notifications') => void;
  user: User;
  onLogout: () => void;
  onOpenAboutModal: () => void;
  notificationCount?: number;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen, chats, activeChatId, onNewChat, onSelectChat, onDeleteChat, onDownloadChat,
  currentView, onSetView, user, onLogout, onOpenAboutModal, notificationCount = 0
}) => {
  const [chatSearch, setChatSearch] = useState('');

  if (['admin'].includes(currentView)) return null;

  const filteredChats = chats.filter(c => c.title.toLowerCase().includes(chatSearch.toLowerCase()));

  const navGroups = [
    {
      label: 'Main', items: [
        { icon: '📊', label: 'Dashboard', view: 'dashboard' as const },
        { icon: '💬', label: 'AI Assistant', view: 'chat' as const },
        { icon: '🌦️', label: 'Weather', view: 'weather' as const },
      ]
    },
    {
      label: 'Agriculture', items: [
        { icon: '🌾', label: 'Crop Database', view: 'crops' as const },
        { icon: '📈', label: 'Market Prices', view: 'market' as const },
        { icon: '🏛️', label: 'Gov. Schemes', view: 'schemes' as const },
      ]
    },
    {
      label: 'Account', items: [
        { icon: '🔔', label: 'Notifications', view: 'notifications' as const, badge: notificationCount },
        { icon: '👤', label: 'My Profile', view: 'profile' as const },
        { icon: '⚙️', label: 'Settings', view: 'settings' as const },
      ]
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 z-10 md:hidden" onClick={() => {}} aria-hidden="true" />
      )}

      <aside
        className={`absolute md:relative z-20 flex flex-col bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } w-64 h-full flex-shrink-0 shadow-xl md:shadow-none`}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <span className="text-2xl">🌿</span>
          <div>
            <span className="font-heading font-extrabold text-lg text-primary-800 dark:text-primary-400">AgriSense</span>
            <p className="text-xs text-gray-400 font-mono tracking-wider leading-none">AI FARMING</p>
          </div>
        </div>

        {/* New Chat */}
        <div className="px-4 py-3">
          <button
            onClick={onNewChat}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary-800 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl transition-all shadow-sm shadow-primary-800/30"
          >
            <span>✏️</span> New Chat
          </button>
        </div>

        {/* Nav Groups */}
        <nav className="flex-shrink-0 px-3 space-y-4 pb-2">
          {navGroups.map(group => (
            <div key={group.label}>
              <p className="px-3 mb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">{group.label}</p>
              <div className="space-y-0.5">
                {group.items.map(item => (
                  <NavItem
                    key={item.view}
                    icon={item.icon}
                    label={item.label}
                    active={currentView === item.view}
                    onClick={() => onSetView(item.view)}
                    badge={(item as any).badge}
                  />
                ))}
              </div>
            </div>
          ))}
          {user?.role === 'admin' && (
            <NavItem icon="👑" label="Admin Panel" active={currentView === 'admin'} onClick={() => onSetView('admin')} />
          )}
        </nav>

        {/* Chat History */}
        <div className="flex-1 overflow-hidden flex flex-col px-3 border-t border-gray-100 dark:border-gray-800 pt-3">
          <p className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Recent Chats</p>
          <div className="relative mb-2">
            <input
              type="text" placeholder="Search chats…" value={chatSearch}
              onChange={e => setChatSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none"
            />
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">🔍</span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-0.5 pr-1">
            {filteredChats.slice(0, 15).map(chat => (
              <button
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors group flex items-center justify-between ${
                  activeChatId === chat.id && currentView === 'chat'
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-800 dark:text-primary-400 font-semibold'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <span className="truncate flex-1 pr-2">{chat.title}</span>
                <button
                  onClick={e => { e.stopPropagation(); onDeleteChat(chat.id); }}
                  className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 flex-shrink-0"
                >✕</button>
              </button>
            ))}
          </div>
        </div>

        {/* User Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-300 flex items-center justify-center font-bold text-sm flex-shrink-0">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user.name}</p>
            <p className="text-xs text-gray-400 truncate">{user.email}</p>
          </div>
          <button onClick={onLogout} title="Logout" className="text-gray-400 hover:text-red-500 text-sm transition-colors shrink-0 p-1">
            🚪
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
