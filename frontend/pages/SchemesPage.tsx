import React, { useState } from 'react';

const SCHEMES = [
  {
    name: 'PM-KISAN Samman Nidhi',
    ministry: 'Ministry of Agriculture',
    benefit: '₹6,000/year in 3 installments',
    eligibility: 'Small and marginal farmers with less than 2 hectares of land',
    deadline: 'Rolling',
    tag: 'Cash Transfer',
    color: 'green',
    link: 'https://pmkisan.gov.in',
  },
  {
    name: 'PMFBY – Crop Insurance',
    ministry: 'Ministry of Agriculture',
    benefit: 'Full crop loss insurance at low premium (2% Kharif, 1.5% Rabi)',
    eligibility: 'All farmers growing notified crops in notified areas',
    deadline: 'Seasonal',
    tag: 'Insurance',
    color: 'blue',
    link: 'https://pmfby.gov.in',
  },
  {
    name: 'Kisan Credit Card (KCC)',
    ministry: 'Ministry of Finance & Agriculture',
    benefit: 'Credit up to ₹3 lakh at 4% interest',
    eligibility: 'All farmers, sharecroppers, and tenant farmers',
    deadline: 'Rolling',
    tag: 'Credit',
    color: 'yellow',
    link: 'https://agricoop.gov.in',
  },
  {
    name: 'Soil Health Card Scheme',
    ministry: 'Ministry of Agriculture',
    benefit: 'Free soil testing & personalised fertilizer recommendations',
    eligibility: 'All farmers in India',
    deadline: 'Rolling',
    tag: 'Advisory',
    color: 'green',
    link: 'https://soilhealth.dac.gov.in',
  },
  {
    name: 'e-NAM (National Agri Market)',
    ministry: 'Ministry of Agriculture',
    benefit: 'Online trading platform for better price discovery',
    eligibility: 'Farmers registered at participating mandis',
    deadline: 'Rolling',
    tag: 'Market',
    color: 'blue',
    link: 'https://enam.gov.in',
  },
  {
    name: 'Pradhan Mantri Fasal Bima Yojana',
    ministry: 'Ministry of Agriculture',
    benefit: 'Comprehensive risk coverage from pre-harvest to post-harvest',
    eligibility: 'All farmers including sharecroppers',
    deadline: 'Seasonal registration',
    tag: 'Insurance',
    color: 'yellow',
    link: 'https://pmfby.gov.in',
  },
];

const tagColors: Record<string, string> = {
  green: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  yellow: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
};

const SchemesPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const filtered = SCHEMES.filter(s =>
    `${s.name} ${s.tag} ${s.benefit}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 animate-fade-in-up">
      <div>
        <h1 className="font-heading font-bold text-2xl text-gray-900 dark:text-white">🏛️ Government Schemes</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Benefits and subsidies available for Indian farmers</p>
      </div>

      <input
        type="text" placeholder="Search schemes…" value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full max-w-md px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map(s => (
          <div key={s.name} className="glass-light dark:glass rounded-2xl p-5 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 flex flex-col">
            <div className="flex items-start justify-between gap-3 mb-3">
              <h2 className="font-heading font-bold text-gray-900 dark:text-white text-base leading-snug">{s.name}</h2>
              <span className={`flex-shrink-0 px-2.5 py-0.5 rounded-full text-xs font-bold ${tagColors[s.color]}`}>{s.tag}</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{s.ministry}</p>
            <div className="space-y-2 flex-1">
              <div className="flex gap-2">
                <span className="text-green-500 text-sm shrink-0">💰</span>
                <p className="text-sm text-gray-700 dark:text-gray-300">{s.benefit}</p>
              </div>
              <div className="flex gap-2">
                <span className="text-blue-500 text-sm shrink-0">✅</span>
                <p className="text-xs text-gray-500 dark:text-gray-400">{s.eligibility}</p>
              </div>
              <div className="flex gap-2">
                <span className="text-yellow-500 text-sm shrink-0">📅</span>
                <p className="text-xs text-gray-400">{s.deadline}</p>
              </div>
            </div>
            <a
              href={s.link} target="_blank" rel="noopener noreferrer"
              className="mt-4 flex items-center justify-center gap-2 py-2 bg-primary-800 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl transition-all"
            >
              Apply / Learn More 🔗
            </a>
          </div>
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="text-center text-gray-400 py-10">No schemes found for "{search}"</p>
      )}
    </div>
  );
};

export default SchemesPage;
