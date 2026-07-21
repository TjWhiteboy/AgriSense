import React, { useState } from 'react';

const CROPS = [
  { name: 'Rice (Fine)', unit: 'Quintal', price: 2800, prev: 2750, change: +50, trend: '📈' },
  { name: 'Wheat', unit: 'Quintal', price: 2250, prev: 2280, change: -30, trend: '📉' },
  { name: 'Cotton', unit: 'Quintal', price: 7800, prev: 7650, change: +150, trend: '📈' },
  { name: 'Soybean', unit: 'Quintal', price: 4600, prev: 4600, change: 0, trend: '➡️' },
  { name: 'Maize', unit: 'Quintal', price: 1900, prev: 1880, change: +20, trend: '📈' },
  { name: 'Groundnut', unit: 'Quintal', price: 5800, prev: 5900, change: -100, trend: '📉' },
  { name: 'Sugarcane', unit: 'Tonne', price: 315, prev: 315, change: 0, trend: '➡️' },
  { name: 'Turmeric', unit: 'Quintal', price: 14200, prev: 13800, change: +400, trend: '📈' },
];

const MarketPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'up' | 'down'>('all');

  const filtered = CROPS
    .filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
    .filter(c => {
      if (filter === 'up') return c.change > 0;
      if (filter === 'down') return c.change < 0;
      return true;
    });

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 animate-fade-in-up">
      <div>
        <h1 className="font-heading font-bold text-2xl text-gray-900 dark:text-white">📈 Market Prices</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Today's mandi prices across major commodities</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Trending Up', count: CROPS.filter(c => c.change > 0).length, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20', icon: '↑' },
          { label: 'Trending Down', count: CROPS.filter(c => c.change < 0).length, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20', icon: '↓' },
          { label: 'Stable', count: CROPS.filter(c => c.change === 0).length, color: 'text-gray-600', bg: 'bg-gray-50 dark:bg-gray-800', icon: '→' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-4 text-center glass-light dark:glass`}>
            <p className={`font-heading font-extrabold text-3xl ${s.color}`}>{s.count}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text" placeholder="Search crop…" value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600"
        />
        <div className="flex gap-2">
          {(['all', 'up', 'down'] as const).map(f => (
            <button key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${filter === f ? 'bg-primary-800 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200'}`}
            >{f}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="glass-light dark:glass rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50/80 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700">
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Commodity</th>
              <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Today (₹)</th>
              <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Yesterday</th>
              <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Change</th>
              <th className="text-center px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Trend</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c, i) => (
              <tr key={c.name} className={`border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${i % 2 === 0 ? '' : 'bg-gray-50/30 dark:bg-gray-800/20'}`}>
                <td className="px-5 py-3 font-semibold text-gray-900 dark:text-white">
                  {c.name}
                  <span className="ml-2 text-xs text-gray-400">/{c.unit}</span>
                </td>
                <td className="px-5 py-3 text-right font-bold text-gray-900 dark:text-white">₹{c.price.toLocaleString()}</td>
                <td className="px-5 py-3 text-right text-gray-500">₹{c.prev.toLocaleString()}</td>
                <td className={`px-5 py-3 text-right font-semibold ${c.change > 0 ? 'text-green-600' : c.change < 0 ? 'text-red-500' : 'text-gray-400'}`}>
                  {c.change > 0 ? '+' : ''}{c.change}
                </td>
                <td className="px-5 py-3 text-center text-lg">{c.trend}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-10 text-gray-400">No crops found matching "{search}"</div>
        )}
      </div>
      <p className="text-xs text-gray-400 text-center">Prices are indicative. Source: AGMARKNET. Last updated today.</p>
    </div>
  );
};

export default MarketPage;
