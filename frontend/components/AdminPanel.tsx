import React, { useState, useEffect } from 'react';
import { adminService, AdminStats } from '../services/adminService';
import type { User, ChatSession } from '../types';
import AdminCropManager from './AdminCropManager';
import DefaultAvatarIcon from './icons/DefaultAvatarIcon';

const AdminPanel: React.FC<{ user: User }> = ({ user }) => {
    const [view, setView] = useState<'dashboard' | 'users' | 'crops' | 'chats' | 'logs'>('dashboard');
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [chats, setChats] = useState<any[]>([]); // Using any for chats since populated userId changes shape
    const [loading, setLoading] = useState(true);

    // Pagination & Search
    const [searchQ, setSearchQ] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    useEffect(() => {
        loadData();
    }, [view]);

    const loadData = async () => {
        setLoading(true);
        try {
            if (view === 'dashboard' || view === 'logs') {
                const s = await adminService.getStats();
                setStats(s);
            } else if (view === 'users') {
                const u = await adminService.getUsers();
                setUsers(u);
            } else if (view === 'chats') {
                const c = await adminService.getChats();
                setChats(c);
            }
        } catch (e) {
            console.error("Failed to load admin data", e);
        }
        setLoading(false);
    };

    const handleDeleteUser = async (id: string) => {
        if (!confirm("Are you sure you want to delete this user and all their chats?")) return;
        try {
            await adminService.deleteUser(id);
            setUsers(users.filter(u => u._id !== id));
        } catch (e) {
            alert("Failed to delete user");
        }
    };

    // Derived states for pagination
    const applyPagination = (arr: any[]) => {
        const start = (currentPage - 1) * itemsPerPage;
        return arr.slice(start, start + itemsPerPage);
    };

    const filteredUsers = users.filter(u => `${u.name} ${u.email} ${u.role}`.toLowerCase().includes(searchQ.toLowerCase()));
    const paginatedUsers = applyPagination(filteredUsers);
    
    const filteredChats = chats.filter(c => `${c.userMessage} ${c.aiReply} ${c.userId?.name}`.toLowerCase().includes(searchQ.toLowerCase()));
    const paginatedChats = applyPagination(filteredChats);

    const renderPagination = (totalItems: number) => {
        const pages = Math.ceil(totalItems / itemsPerPage);
        if (pages <= 1) return null;
        return (
            <div className="flex justify-center gap-2 mt-4">
                <button 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(c => c - 1)}
                    className="px-3 py-1 bg-white border border-gray-200 rounded disabled:opacity-50"
                >Prev</button>
                <span className="px-3 py-1">Page {currentPage} of {pages}</span>
                <button 
                    disabled={currentPage === pages}
                    onClick={() => setCurrentPage(c => c + 1)}
                    className="px-3 py-1 bg-white border border-gray-200 rounded disabled:opacity-50"
                >Next</button>
            </div>
        );
    };

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-[#0D1117] w-full text-gray-800 dark:text-gray-200 font-sans">
            {/* Sidebar for Admin */}
            <div className="w-64 bg-white dark:bg-[#161B22] border-r border-gray-200 dark:border-gray-800 flex flex-col">
                <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                    <h2 className="text-xl font-black text-green-600">AgriSense Admin</h2>
                    <p className="text-xs text-gray-500 mt-1">Superuser Dashboard</p>
                </div>
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {(['dashboard', 'users', 'crops', 'chats', 'logs'] as const).map(v => (
                        <button
                            key={v}
                            onClick={() => { setView(v); setCurrentPage(1); setSearchQ(''); }}
                            className={`w-full text-left px-4 py-3 rounded-xl font-semibold capitalize transition-all ${view === v ? 'bg-green-50 dark:bg-green-900/20 text-green-600' : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'}`}
                        >
                            {v} Management
                        </button>
                    ))}
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <header className="bg-white dark:bg-[#161B22] h-16 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6">
                    <h1 className="text-xl font-bold capitalize">{view}</h1>
                    {(view === 'users' || view === 'chats') && (
                        <input 
                            type="text" 
                            placeholder="Search..." 
                            value={searchQ}
                            onChange={e => {setSearchQ(e.target.value); setCurrentPage(1);}}
                            className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none w-64"
                        />
                    )}
                </header>

                <main className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <p className="text-gray-500">Loading data...</p>
                    ) : (
                        <>
                            {view === 'dashboard' && stats && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-white dark:bg-[#161B22] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 text-center">
                                        <p className="text-4xl font-black text-blue-500">{stats.users}</p>
                                        <p className="font-semibold mt-2 text-gray-500">Total Users</p>
                                    </div>
                                    <div className="bg-white dark:bg-[#161B22] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 text-center">
                                        <p className="text-4xl font-black text-green-500">{stats.crops}</p>
                                        <p className="font-semibold mt-2 text-gray-500">Crop DB Entries</p>
                                    </div>
                                    <div className="bg-white dark:bg-[#161B22] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 text-center">
                                        <p className="text-4xl font-black text-purple-500">{stats.chats}</p>
                                        <p className="font-semibold mt-2 text-gray-500">Total Chats</p>
                                    </div>
                                </div>
                            )}

                            {view === 'users' && (
                                <div className="bg-white dark:bg-[#161B22] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 text-sm">
                                            <tr>
                                                <th className="p-4 border-b dark:border-gray-700">Account</th>
                                                <th className="p-4 border-b dark:border-gray-700">Role</th>
                                                <th className="p-4 border-b dark:border-gray-700">Joined</th>
                                                <th className="p-4 border-b dark:border-gray-700">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginatedUsers.map(u => (
                                                <tr key={u._id} className="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                    <td className="p-4 flex items-center gap-3">
                                                        {u.profilePicture ? (
                                                            <img src={u.profilePicture} className="w-10 h-10 rounded-full object-cover" />
                                                        ) : (
                                                            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center"><DefaultAvatarIcon className="w-6 h-6 text-gray-400" /></div>
                                                        )}
                                                        <div>
                                                            <p className="font-bold">{u.name}</p>
                                                            <p className="text-xs text-gray-500">{u.email}</p>
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <span className={`px-2 py-1 rounded text-xs font-bold ${u.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 dark:bg-gray-800 text-gray-600'}`}>{u.role?.toUpperCase()}</span>
                                                    </td>
                                                    <td className="p-4 text-sm text-gray-500">{new Date(u.createdAt!).toLocaleDateString()}</td>
                                                    <td className="p-4">
                                                        {u.role !== 'admin' && (
                                                            <button onClick={() => handleDeleteUser(u._id!)} className="text-red-500 hover:underline text-sm font-bold">Delete</button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {renderPagination(filteredUsers.length)}
                                </div>
                            )}

                            {view === 'chats' && (
                                <div className="space-y-4">
                                    {paginatedChats.map(c => (
                                        <div key={c._id} className="bg-white dark:bg-[#161B22] p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                                            <div className="flex justify-between items-start mb-3">
                                                <p className="text-sm font-bold text-blue-600">{c.userId?.name || 'Deleted User'}</p>
                                                <p className="text-xs text-gray-500">{new Date(c.createdAt).toLocaleString()}</p>
                                            </div>
                                            <div className="space-y-2 text-sm">
                                                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border-l-4 border-gray-400">
                                                    <span className="font-bold mr-2">User:</span>{c.userMessage}
                                                </div>
                                                <div className="bg-green-50 dark:bg-green-900/10 p-3 rounded-lg border-l-4 border-green-500">
                                                    <span className="font-bold mr-2 text-green-700">AI:</span>{String(c.aiReply).substring(0, 200)}...
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {renderPagination(filteredChats.length)}
                                </div>
                            )}

                            {view === 'crops' && (
                                <div className="bg-white dark:bg-[#161B22] rounded-2xl p-2 h-full shadow-sm border border-gray-100 dark:border-gray-800">
                                    <AdminCropManager />
                                </div>
                            )}

                            {view === 'logs' && stats && (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div className="bg-white dark:bg-[#161B22] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                                        <h3 className="font-bold mb-4 flex justify-between">System Logs <span>📡</span></h3>
                                        <div className="space-y-3">
                                            {stats.systemLogs.map(l => (
                                                <div key={l.id} className="text-sm font-mono p-3 bg-gray-50 dark:bg-gray-800 rounded">
                                                    <p className={`font-bold ${l.type === 'error' ? 'text-red-500' : l.type === 'warn' ? 'text-amber-500' : 'text-blue-500'}`}>[{l.type.toUpperCase()}]</p>
                                                    <p className="mt-1">{l.message}</p>
                                                    <p className="text-xs text-gray-400 mt-2">{new Date(l.timestamp).toLocaleString()}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="bg-white dark:bg-[#161B22] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                                        <h3 className="font-bold mb-4 flex justify-between">Weather API Logs <span>🌦️</span></h3>
                                        <div className="space-y-3">
                                            {stats.weatherLogs.map(l => (
                                                <div key={l.id} className="text-sm font-mono p-3 bg-slate-50 dark:bg-slate-800/50 border-l-2 border-indigo-500 rounded">
                                                    <p className="font-bold text-indigo-500">Location: {l.location}</p>
                                                    <p>Response: {l.temp}°C, {l.condition}</p>
                                                    <p className="text-xs text-gray-400 mt-2">{new Date(l.timestamp).toLocaleString()}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>
        </div>
    );
};

export default AdminPanel;
