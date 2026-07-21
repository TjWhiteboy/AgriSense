import React, { useState, useEffect } from 'react';
import { apiClient } from '../services/apiClient';

interface MarketItem {
  name: string;
  unit: string;
  price: number;
  prev: number;
  change: number;
  trend: string;
}

const SkeletonRow = () => (
  <tr>
    {Array.from({ length: 5 }).map((_, i) => (
      <td key={i} className="px-5 py-3">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-full" />
      </td>
    ))}
  </tr>
);

const MarketPage: React.FC = () => {
  const [crops, setCrops] = useState<MarketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'up' | 'down'>('all');

  useEffect(() => {
    const fetchMarket = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get('/market');
        if (res.error) throw new Error(res.error);
        setCrops(res.data || []);
        setLastUpdated(res.lastUpdated);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch market data');
      } finally {
        setLoading(false);
      }
    };
    fetchMarket();
  }, []);

  const filtered = crops
    .filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
    .filter(c => {
      if (filter === 'up') return c.change > 0;
      if (filter === 'down') return c.change < 0;
      return true;
    });

  const upCount = crops.filter(c => c.change > 0).length;
  const downCount = crops.filter(c => c.change < 0).length;
  const stableCount = crops.filter(c => c.change === 0).length;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 animate-fade-in-up">
      <div>
        <h1 className="font-heading font-bold text-2xl text-gray-900 dark:text-white">📈 Market Prices</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Today's mandi prices across major commodities ·{' '}
          {lastUpdated && <span>Updated {new Date(lastUpdated).toLocaleTimeString()}</span>}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Trending Up', count: loading ? '—' : upCount, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20', icon: '↑', onClick: () => setFilter('up') },
          { label: 'Trending Down', count: loading ? '—' : downCount, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20', icon: '↓', onClick: () => setFilter('down') },
          { label: 'Stable', count: loading ? '—' : stableCount, color: 'text-gray-600', bg: 'bg-gray-50 dark:bg-gray-800', icon: '→', onClick: () => setFilter('all') },
        ].map(s => (
          <div key={s.label} onClick={s.onClick} className={`${s.bg} rounded-2xl p-4 text-center glass-light dark:glass cursor-pointer hover:scale-105 transition-all`}>
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

      {/* Error */}
      {error && (
        <div className="rounded-2xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-6 text-center">
          <p className="text-red-600 dark:text-red-400 font-semibold">⚠️ {error}</p>
        </div>
      )}

      {/* Table */}
      <div className="glass-light dark:glass rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
        <div className="overflow-x-auto">
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
              {loading
                ? Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
                : filtered.map((c, i) => (
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
                ))
              }
            </tbody>
          </table>
          {!loading && filtered.length === 0 && (
            <div className="text-center py-10 text-gray-400">No crops found matching "{search}"</div>
          )}
        </div>
      </div>
      <p className="text-xs text-gray-400 text-center">Prices are indicative based on AGMARKNET MSP data. Updated daily.</p>
    </div>
  );
};

export default MarketPage;
