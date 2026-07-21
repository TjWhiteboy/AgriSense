import React, { useState, useEffect, useCallback } from 'react';
import { TRANSLATIONS } from '../constants';
import { analyticsService, DashboardAnalytics } from '../services/analyticsService';
import type { ChatSession } from '../types';

// Icons
import SpeakerIcon from './icons/SpeakerIcon';
import StopIcon from './icons/StopIcon';
import SunCloudIcon from './icons/SunCloudIcon';
import ShieldCheckIcon from './icons/ShieldCheckIcon';
import SoilIcon from './icons/SoilIcon';
import WaterDropIcon from './icons/WaterDropIcon';
import TrendingUpIcon from './icons/TrendingUpIcon';
import SeedlingIcon from './icons/SeedlingIcon';
import TrophyIcon from './icons/TrophyIcon';
import BugIcon from './icons/BugIcon';

interface DashboardProps {
    location: string;
    crop: string;
    chats: ChatSession[];
    onSetView: (view: 'chat' | 'dashboard' | 'crops' | 'profile' | 'settings') => void;
}

const DashboardCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
    className?: string;
    iconBgClass?: string;
    onClick?: () => void;
}> = ({ icon, title, children, className = '', iconBgClass = 'bg-green-100 dark:bg-green-900/30 text-green-600', onClick }) => (
    <div 
        className={`bg-gradient-to-br from-white to-slate-50 dark:from-[#161B22] dark:to-[#1C2128] border border-gray-200 dark:border-gray-700/80 rounded-xl p-4 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-in-out flex flex-col ${onClick ? 'cursor-pointer' : ''} ${className}`}
        onClick={onClick}
    >
        <div className="flex items-start mb-3">
            <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center mr-4 ${iconBgClass}`}>
                {icon}
            </div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 leading-tight">{title}</h3>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400 flex-grow">
            {children}
        </div>
    </div>
);

const TrendChart: React.FC<{ data: { month: string, price: number }[] }> = ({ data }) => {
    const maxPrice = Math.max(...data.map(p => p.price));
    const minPrice = Math.min(...data.map(p => p.price));

    return (
        <div className="w-full h-32 bg-slate-50 dark:bg-gray-800/50 rounded-lg p-2 flex items-end justify-between mt-2">
            {data.map((point, index) => {
                const heightPercentage = ((point.price - minPrice) / (maxPrice - minPrice)) * 100;
                return (
                    <div key={index} className="w-[12%] flex flex-col items-center justify-end h-full group">
                        <div 
                            className="w-full bg-green-400 dark:bg-green-600 rounded-t-sm group-hover:bg-green-500 transition-all duration-300 ease-in-out relative"
                            style={{ height: `${Math.max(10, heightPercentage)}%` }}
                        >
                            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-gray-600 dark:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity">
                                ₹{point.price}
                            </span>
                        </div>
                        <span className="text-[10px] text-gray-500 mt-2 font-medium">{point.month.slice(0,3)}</span>
                    </div>
                );
            })}
        </div>
    );
};

// Simulated mock data for new features
const NOTIFICATIONS = [
    { id: 1, title: 'Heavy Rain Alert', time: '2 hours ago', severity: 'high' },
    { id: 2, title: 'Market price for Wheat up 5%', time: '5 hours ago', severity: 'low' },
    { id: 3, title: 'Upcoming Harvest Window', time: '1 day ago', severity: 'medium' },
];

const GOV_SCHEMES = [
    { title: 'PM-KISAN', tag: 'Direct Benefit' },
    { title: 'Kisan Credit Card', tag: 'Loan / Subsidy' },
    { title: 'Pradhan Mantri Fasal Bima', tag: 'Insurance' },
];

const AI_SUGGESTIONS = [
    'Apply nitrogen fertilizer within 3 days for optimal vegetative growth.',
    'Spray Neem oil to prevent early aphid infestations.',
    'Test soil pH next week based on recent heavy rainfall.'
];

const Dashboard: React.FC<DashboardProps> = ({ location, crop, chats, onSetView }) => {
    const [analyticsData, setAnalyticsData] = useState<DashboardAnalytics | null>(null);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        // Simulate network delay for loading animation demonstration
        setTimeout(() => {
            const data = analyticsService.getDashboardAnalytics(location, crop);
            setAnalyticsData(data);
            setLoading(false);
        }, 800);
    }, [location, crop]);

    useEffect(() => {
        return () => {
            if (window.speechSynthesis.speaking) window.speechSynthesis.cancel();
        };
    }, []);

    const handleReadAloud = useCallback(() => {
        if (!analyticsData) return;
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
            return;
        }

        const t = TRANSLATIONS;
        const data = analyticsData;
        const levelKey = `alert${data.pestAlerts.level.charAt(0).toUpperCase() + data.pestAlerts.level.slice(1)}` as keyof typeof TRANSLATIONS;

        let summary = t.readoutIntro.replace('{location}', location) + ' ';
        summary += t.readoutWeather.replace('{condition}', data.weather.condition).replace('{temp}', data.weather.temp) + ' ';
        summary += t.readoutPestAlert.replace('{level}', t[levelKey]) + ' ';
        
        const utterance = new SpeechSynthesisUtterance(summary);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
    }, [analyticsData, location, isSpeaking]);

    if (loading || !analyticsData) {
        return (
            <div className="p-4 h-full overflow-y-auto w-full">
                <div className="flex justify-between items-center mb-6">
                    <div className="h-8 w-64 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                    <div className="h-10 w-32 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="bg-white dark:bg-[#161B22] border border-gray-100 dark:border-gray-800 rounded-xl p-4 h-32 flex flex-col justify-between">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
                                <div className="w-24 h-6 rounded bg-gray-200 dark:bg-gray-800 animate-pulse mt-2"></div>
                            </div>
                            <div className="w-full h-8 rounded bg-gray-100 dark:bg-gray-900 animate-pulse mt-4"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    
    const { weather, pestAlerts, soilHealth, yieldPrediction, plantingAdvisor, pestOutbreakPrediction, marketTrends } = analyticsData;
    const alertColor = pestAlerts.level === 'high' ? 'bg-red-100 dark:bg-red-900/30 text-red-500' : pestAlerts.level === 'medium' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-500' : 'bg-green-100 dark:bg-green-900/30 text-green-500';
    const pestAlertLevelKey = `alert${pestAlerts.level.charAt(0).toUpperCase() + pestAlerts.level.slice(1)}` as keyof typeof TRANSLATIONS;

    return (
        <div className="p-4 sm:p-6 h-full overflow-y-auto bg-[#F9FAFB] dark:bg-[#0D1117] max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
                        Dashboard
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Overview for <span className="text-green-600 dark:text-green-400 font-semibold">{location}</span></p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={() => onSetView('chat')}
                        className="px-4 py-2 text-sm font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                    >
                        + New Chat
                    </button>
                    <button 
                        onClick={handleReadAloud}
                        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
                    >
                        {isSpeaking ? <StopIcon /> : <SpeakerIcon />}
                        <span className="hidden sm:inline">{isSpeaking ? TRANSLATIONS.stopReading : TRANSLATIONS.readAloud}</span>
                    </button>
                </div>
            </div>

            {/* Top Row: Weather, Yield, Disease, Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <DashboardCard icon={<SunCloudIcon className="h-6 w-6"/>} title="Today's Weather" iconBgClass="bg-amber-100 dark:bg-amber-900/30 text-amber-500">
                    <div className="flex items-end gap-2 mt-1">
                        <p className="text-3xl font-black text-gray-900 dark:text-gray-50">{weather.temp}</p>
                        <p className="pb-1 text-gray-500">{weather.condition}</p>
                    </div>
                </DashboardCard>

                <DashboardCard icon={<ShieldCheckIcon className="h-6 w-6"/>} title="Crop Recommendation" iconBgClass="bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600">
                    <p className="text-xl font-bold text-gray-900 dark:text-gray-50">{plantingAdvisor.recommendedCrop}</p>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{plantingAdvisor.reason}</p>
                </DashboardCard>
                
                <DashboardCard icon={<BugIcon className="h-6 w-6"/>} title="Disease Alerts" iconBgClass={alertColor}>
                    <p className={`text-lg font-bold ${alertColor.split(' ')[2]}`}>{TRANSLATIONS[pestAlertLevelKey]}</p>
                    <p className="text-xs mt-1 text-gray-600 dark:text-gray-400 line-clamp-2">{pestAlerts.message}</p>
                </DashboardCard>

                {/* Quick Actions Grid */}
                <div className="grid grid-cols-2 grid-rows-2 gap-2">
                    <button onClick={() => onSetView('crops')} className="bg-white dark:bg-[#161B22] border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center rounded-xl p-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm group">
                        <span className="text-xl mb-1 group-hover:scale-110 transition-transform">🌾</span>
                        <span className="text-[11px] font-semibold text-gray-600 dark:text-gray-300">Crops</span>
                    </button>
                    <button onClick={() => onSetView('profile')} className="bg-white dark:bg-[#161B22] border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center rounded-xl p-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm group">
                        <span className="text-xl mb-1 group-hover:scale-110 transition-transform">👤</span>
                        <span className="text-[11px] font-semibold text-gray-600 dark:text-gray-300">Profile</span>
                    </button>
                    <div className="col-span-2 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/30 rounded-xl p-3 flex items-center justify-between shadow-sm cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors">
                        <div className="text-left">
                            <p className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Prediction</p>
                            <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{yieldPrediction.predictedYield} t/ha</p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-indigo-200 dark:bg-indigo-800 flex items-center justify-center text-indigo-700 dark:text-indigo-300">
                            <TrendingUpIcon />
                        </div>
                    </div>
                </div>
            </div>

            {/* Middle Row: Charts and AI Suggestions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Market chart takes up 2 cols on large */}
                <DashboardCard className="lg:col-span-2" icon={<TrendingUpIcon className="h-6 w-6"/>} title={`${TRANSLATIONS.marketTrendsTitle} - ${marketTrends.crop}`} iconBgClass="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600">
                    <TrendChart data={marketTrends.data} />
                    <div className="mt-4 flex justify-between items-center bg-gray-50 dark:bg-gray-800/40 p-3 rounded-lg border border-gray-100 dark:border-gray-800">
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider">Current Avg</p>
                            <p className="text-lg font-bold text-gray-900 dark:text-gray-100">₹{Math.round(marketTrends.data.reduce((acc, c) => acc+c.price, 0)/marketTrends.data.length)}/Q</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-500 uppercase tracking-wider">Forecast</p>
                            <p className="text-sm font-bold text-green-600">+4.2% Expected</p>
                        </div>
                    </div>
                </DashboardCard>

                {/* AI Suggestions Stack */}
                <div className="flex flex-col gap-4">
                    <DashboardCard icon={<span className="text-xl leading-none">✨</span>} title="AI Suggestions" iconBgClass="bg-purple-100 dark:bg-purple-900/30 text-purple-600">
                        <ul className="space-y-3 mt-1">
                            {AI_SUGGESTIONS.map((sug, i) => (
                                <li key={i} className="flex gap-3 text-sm">
                                    <span className="text-purple-500 mt-0.5">•</span>
                                    <span className="text-gray-600 dark:text-gray-300 leading-snug">{sug}</span>
                                </li>
                            ))}
                        </ul>
                    </DashboardCard>
                </div>
            </div>

            {/* Bottom Row: Recent Chats, Notifications / Calendar, Gov Schemes */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Recent Chats */}
                <DashboardCard icon={<span className="text-xl">💬</span>} title="Recent Chats" iconBgClass="bg-blue-100 dark:bg-blue-900/30 text-blue-600">
                    <div className="flex flex-col gap-2 mt-1">
                        {chats.length > 0 ? chats.slice(0, 4).map(chat => (
                            <div key={chat.id} onClick={() => onSetView('chat')} className="p-3 bg-gray-50 dark:bg-gray-800/40 rounded-lg border border-gray-100 dark:border-gray-800 cursor-pointer hover:bg-green-50 dark:hover:bg-green-900/20 hover:border-green-200 dark:hover:border-green-800 transition-colors group flex items-center justify-between">
                                <div className="truncate pr-4">
                                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{chat.title}</p>
                                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{new Date(chat.timestamp).toLocaleDateString()}</p>
                                </div>
                                <span className="text-gray-400 group-hover:text-green-500 group-hover:translate-x-1 transition-all">→</span>
                            </div>
                        )) : (
                            <p className="text-sm text-gray-500 text-center py-4">No recent chats. Ask AI a question!</p>
                        )}
                    </div>
                </DashboardCard>

                {/* Notifications & Calendar stack */}
                <div className="flex flex-col gap-4">
                    {/* Tiny Calendar */}
                    <DashboardCard icon={<span className="text-xl">📅</span>} title="Farm Calendar" iconBgClass="bg-teal-100 dark:bg-teal-900/30 text-teal-600">
                        <div className="flex items-center justify-between bg-teal-50 dark:bg-teal-900/20 p-3 rounded-lg border border-teal-100 dark:border-teal-800/30">
                            <div className="text-center bg-white dark:bg-gray-800 px-3 py-2 rounded-md shadow-sm border border-gray-100 dark:border-gray-700">
                                <p className="text-[10px] font-bold text-red-500 uppercase">JUL</p>
                                <p className="text-lg font-black text-gray-800 dark:text-gray-200 leading-none mt-1">01</p>
                            </div>
                            <div className="flex-1 ml-4">
                                <p className="text-sm font-bold text-gray-800 dark:text-gray-200">Harvesting Phase</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Expected to start in 12 days.</p>
                            </div>
                        </div>
                    </DashboardCard>

                    {/* Notifications list */}
                    <div className="bg-white dark:bg-[#161B22] border border-gray-200 dark:border-gray-700/80 rounded-xl p-4 shadow-sm flex-1">
                        <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                            Live Alerts
                        </h3>
                        <div className="space-y-3">
                            {NOTIFICATIONS.map(notif => (
                                <div key={notif.id} className="flex gap-3 items-start border-b border-gray-100 dark:border-gray-800 pb-3 last:border-0 last:pb-0">
                                    <div className={`mt-1 flex-shrink-0 w-2 h-2 rounded-full ${notif.severity === 'high' ? 'bg-red-500' : notif.severity === 'medium' ? 'bg-amber-500' : 'bg-blue-500'}`} />
                                    <div>
                                        <p className="text-sm font-medium text-gray-800 dark:text-gray-300 leading-tight">{notif.title}</p>
                                        <p className="text-[10px] text-gray-400 mt-1">{notif.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Gov Schemes */}
                <DashboardCard icon={<span className="text-xl">🏛️</span>} title="Govt Schemes" iconBgClass="bg-rose-100 dark:bg-rose-900/30 text-rose-600">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Available subsidies and programs for your district.</p>
                    <div className="space-y-2">
                        {GOV_SCHEMES.map((scheme, i) => (
                            <div key={i} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/40 p-2.5 rounded-lg border border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-colors cursor-pointer">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate mr-2">{scheme.title}</span>
                                <span className="text-[10px] font-bold px-2 py-1 rounded bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 whitespace-nowrap">
                                    {scheme.tag}
                                </span>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-4 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline">
                        View All Schemes →
                    </button>
                </DashboardCard>
                
            </div>
        </div>
    );
};

export default Dashboard;
