import React, { useState } from 'react';
import { Button } from '../components/ui';

interface LandingPageProps {
  onLogin: () => void;
  onSignup: () => void;
}

const FEATURES = [
  { icon: '🤖', title: 'AI Disease Detection', desc: 'Upload any crop photo to instantly diagnose plant diseases with confidence scores, causes, and organic + chemical treatment plans.' },
  { icon: '🌦️', title: 'Hyper-Local Weather', desc: 'Get precise, real-time weather data tailored to your exact district and state, including rain probability and humidity alerts.' },
  { icon: '🌾', title: 'Smart Crop Recommendations', desc: 'Receive AI-powered crop suggestions based on your soil type, current season, expected rainfall, and regional climate data.' },
  { icon: '💬', title: 'Conversational AI Assistant', desc: 'Talk to AgriSense like an expert farming advisor. It remembers conversation history and personalises advice to your farm.' },
  { icon: '📈', title: 'Market Price Tracker', desc: 'Stay informed on current mandi prices for your crops, with weekly trends and best-time-to-sell recommendations.' },
  { icon: '🏛️', title: 'Government Scheme Alerts', desc: 'Never miss a subsidy or PMFBY application. AgriSense surfaces eligible government schemes personalised to your profile.' },
];

const TESTIMONIALS = [
  { name: 'Ravi Kumar', state: 'Punjab', crop: 'Wheat', quote: 'AgriSense detected leaf rust in my wheat field three weeks before I noticed it. Saved nearly 20% of my crop this harvest.' },
  { name: 'Meena Devi', state: 'Maharashtra', crop: 'Cotton', quote: 'The AI assistant explained the entire bollworm treatment plan in Hindi. It\'s like having an agronomist in my pocket.' },
  { name: 'Suresh Naidu', state: 'Andhra Pradesh', crop: 'Paddy', quote: 'I got notified about the PM-Kisan scheme registration deadline right on time. The scheme tracker is invaluable!' },
];

const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onSignup }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans">

      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 glass-light dark:glass-dark border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌿</span>
              <span className="font-heading font-bold text-xl text-primary-800 dark:text-primary-400">AgriSense</span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600 dark:text-gray-400">
              <a href="#features" className="hover:text-primary-800 dark:hover:text-primary-400 transition-colors">Features</a>
              <a href="#how" className="hover:text-primary-800 dark:hover:text-primary-400 transition-colors">How It Works</a>
              <a href="#testimonials" className="hover:text-primary-800 dark:hover:text-primary-400 transition-colors">Testimonials</a>
              <a href="#faq" className="hover:text-primary-800 dark:hover:text-primary-400 transition-colors">FAQ</a>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={onLogin}>Log In</Button>
              <Button variant="primary" size="sm" onClick={onSignup}>Get Started</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-28 pb-24 overflow-hidden">
        <div className="absolute inset-0 hero-gradient-light dark:hero-gradient opacity-50 dark:opacity-30 pointer-events-none" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%232e7d32%22%20fill-opacity%3D%220.04%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in-up">
            <span className="inline-flex items-center gap-2 bg-primary-50 dark:bg-primary-900/20 text-primary-800 dark:text-primary-400 border border-primary-200 dark:border-primary-800 rounded-full px-4 py-1.5 text-sm font-semibold mb-6">
              <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
              AI-Powered Smart Agriculture
            </span>
          </div>
          <h1 className="font-heading font-extrabold text-5xl md:text-7xl text-gray-900 dark:text-white leading-tight mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Farm Smarter,<br />
            <span className="text-primary-800 dark:text-primary-400">Harvest Better</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            AgriSense combines Gemini AI, hyper-local weather data, and a crop knowledge database to give every Indian farmer access to expert agricultural guidance — in their language, on any device.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Button variant="primary" size="lg" onClick={onSignup} icon={<span>🌱</span>}>
              Start for Free
            </Button>
            <Button variant="secondary" size="lg" onClick={onLogin}>
              View Demo
            </Button>
          </div>
          {/* Stats Row */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            {[['50K+', 'Farmers Helped'],['95%', 'Disease Accuracy'],['18', 'Crops Supported']].map(([num, label]) => (
              <div key={label} className="text-center">
                <p className="font-heading font-extrabold text-3xl text-primary-800 dark:text-primary-400">{num}</p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-heading font-bold text-4xl mb-4">Everything You Need to Grow</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">A complete AI-powered toolkit designed from the ground up for modern Indian agriculture.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(f => (
              <div key={f.title} className="glass-light dark:glass rounded-2xl p-6 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="font-heading font-bold text-lg mb-2 text-gray-900 dark:text-white">{f.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-heading font-bold text-4xl mb-4">Simple 3-Step Process</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Create Your Profile', desc: 'Sign up and tell AgriSense your state, district, and the crops you grow.' },
              { step: '02', title: 'Upload or Ask', desc: 'Upload a photo of a sick plant, or ask any farming question in text or voice.' },
              { step: '03', title: 'Get Expert Advice', desc: 'Receive instant AI diagnosis with treatment plans tailored to your region.' },
            ].map(s => (
              <div key={s.step} className="relative text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary-800 text-white flex items-center justify-center font-mono font-bold text-lg mx-auto mb-4 shadow-lg shadow-primary-800/30">
                  {s.step}
                </div>
                <h3 className="font-heading font-bold text-xl mb-2">{s.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading font-bold text-4xl text-center mb-14">Trusted by Farmers Across India</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="glass-light dark:glass rounded-2xl p-6">
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4 italic">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-300 flex items-center justify-center font-bold">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.crop} farmer, {t.state}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="hero-gradient rounded-3xl p-12 text-white shadow-2xl">
            <h2 className="font-heading font-extrabold text-4xl mb-4">Ready to Transform Your Farm?</h2>
            <p className="text-white/80 text-lg mb-8">Join thousands of farmers who now make data-driven decisions every growing season.</p>
            <Button
              variant="primary"
              size="lg"
              onClick={onSignup}
              className="!bg-white !text-primary-800 hover:!bg-gray-100"
            >
              Get Started for Free
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌿</span>
            <span className="font-heading font-bold text-lg text-primary-800 dark:text-primary-400">AgriSense</span>
          </div>
          <p className="text-sm text-gray-400">© 2026 AgriSense. Empowering Indian Farmers with AI.</p>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-primary-700 transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary-700 transition-colors">Terms</a>
            <a href="#" className="hover:text-primary-700 transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
