import React, { useState, useEffect } from 'react';
import type { Theme } from '../types';

const SETTINGS_KEY = 'agriSenseSettings';

interface Settings {
  theme: Theme;
  language: string;
  notifications: boolean;
  voiceEnabled: boolean;
  accentColor: string;
  fontSize: 'small' | 'medium' | 'large';
  privacyMode: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  theme: 'dark',
  language: 'en',
  notifications: true,
  voiceEnabled: true,
  accentColor: '#16a34a',
  fontSize: 'medium',
  privacyMode: false,
};

const loadSettings = (): Settings => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {}
  return DEFAULT_SETTINGS;
};

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी' },
  { code: 'mr', label: 'मराठी' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'te', label: 'తెలుగు' },
  { code: 'kn', label: 'ಕನ್ನಡ' },
  { code: 'gu', label: 'ગુજરાતી' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ' },
  { code: 'bn', label: 'বাংলা' },
];

const ACCENT_COLORS = [
  { label: 'Green', value: '#16a34a' },
  { label: 'Emerald', value: '#059669' },
  { label: 'Teal', value: '#0d9488' },
  { label: 'Blue', value: '#2563eb' },
  { label: 'Indigo', value: '#4f46e5' },
  { label: 'Violet', value: '#7c3aed' },
  { label: 'Orange', value: '#ea580c' },
  { label: 'Rose', value: '#e11d48' },
];

interface SettingsPageProps {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  onLogout: () => void;
}

type Section = 'appearance' | 'language' | 'notifications' | 'privacy';

const SettingsPage: React.FC<SettingsPageProps> = ({ theme, onThemeChange, onLogout }) => {
  const [settings, setSettings] = useState<Settings>(loadSettings);
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState<Section>('appearance');

  // Keep theme in sync with App.tsx
  useEffect(() => {
    if (settings.theme !== theme) {
      onThemeChange(settings.theme);
    }
  }, [settings.theme]);

  // Apply font size to document root
  useEffect(() => {
    const sizes = { small: '14px', medium: '16px', large: '18px' };
    document.documentElement.style.fontSize = sizes[settings.fontSize];
  }, [settings.fontSize]);

  // Apply accent color to CSS variable
  useEffect(() => {
    document.documentElement.style.setProperty('--accent', settings.accentColor);
  }, [settings.accentColor]);

  const update = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    // Also sync theme key for App.tsx
    localStorage.setItem('agriSenseTheme', settings.theme);
    onThemeChange(settings.theme);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
    setSaved(false);
  };

  const NAV_ITEMS: { key: Section; icon: string; label: string }[] = [
    { key: 'appearance', icon: '🎨', label: 'Appearance' },
    { key: 'language', icon: '🌐', label: 'Language' },
    { key: 'notifications', icon: '🔔', label: 'Notifications & Voice' },
    { key: 'privacy', icon: '🔒', label: 'Privacy & Security' },
  ];

  const isDark = settings.theme === 'dark';

  return (
    <div style={s.page}>
      {/* Save toast */}
      {saved && (
        <div style={s.toast}>✅ Settings saved!</div>
      )}

      <div style={s.container}>
        {/* Left nav */}
        <div style={s.sidebar}>
          <h1 style={s.pageTitle}>⚙️ Settings</h1>
          <nav style={s.nav}>
            {NAV_ITEMS.map(({ key, icon, label }) => (
              <button
                key={key}
                style={{ ...s.navBtn, ...(activeSection === key ? s.navBtnActive : {}) }}
                onClick={() => setActiveSection(key)}
              >
                <span style={{ fontSize: 18 }}>{icon}</span>
                <span>{label}</span>
              </button>
            ))}
            <div style={s.divider} />
            <button style={s.logoutBtn} onClick={onLogout}>
              <span style={{ fontSize: 18 }}>🚪</span> Logout
            </button>
          </nav>
        </div>

        {/* Content */}
        <div style={s.content}>

          {/* APPEARANCE */}
          {activeSection === 'appearance' && (
            <div>
              <h2 style={s.sectionTitle}>🎨 Appearance</h2>

              {/* Theme */}
              <div style={s.card}>
                <div style={s.cardHeader}>
                  <p style={s.cardLabel}>Color Mode</p>
                  <p style={s.cardDesc}>Choose between Light and Dark mode for the interface.</p>
                </div>
                <div style={s.themeRow}>
                  {(['light', 'dark'] as Theme[]).map(t => (
                    <button
                      key={t}
                      onClick={() => update('theme', t)}
                      style={{
                        ...s.themeBtn,
                        borderColor: settings.theme === t ? settings.accentColor : '#3f3f46',
                        boxShadow: settings.theme === t ? `0 0 0 2px ${settings.accentColor}40` : 'none',
                      }}
                    >
                      <span style={{ fontSize: 28 }}>{t === 'dark' ? '🌙' : '☀️'}</span>
                      <span style={s.themeBtnLabel}>{t === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
                      {settings.theme === t && <span style={{ ...s.themeBtnCheck, color: settings.accentColor }}>✓</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Accent Color */}
              <div style={s.card}>
                <div style={s.cardHeader}>
                  <p style={s.cardLabel}>Accent Color</p>
                  <p style={s.cardDesc}>Personalize the highlight color used throughout the app.</p>
                </div>
                <div style={s.colorGrid}>
                  {ACCENT_COLORS.map(c => (
                    <button
                      key={c.value}
                      title={c.label}
                      onClick={() => update('accentColor', c.value)}
                      style={{
                        ...s.colorSwatch,
                        background: c.value,
                        transform: settings.accentColor === c.value ? 'scale(1.25)' : 'scale(1)',
                        boxShadow: settings.accentColor === c.value ? `0 0 0 3px white, 0 0 0 5px ${c.value}` : 'none',
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Font Size */}
              <div style={s.card}>
                <div style={s.cardHeader}>
                  <p style={s.cardLabel}>Font Size</p>
                  <p style={s.cardDesc}>Adjust the base font size for readability.</p>
                </div>
                <div style={s.fontRow}>
                  {(['small', 'medium', 'large'] as const).map(sz => (
                    <button
                      key={sz}
                      onClick={() => update('fontSize', sz)}
                      style={{
                        ...s.fontBtn,
                        borderColor: settings.fontSize === sz ? settings.accentColor : '#3f3f46',
                        color: settings.fontSize === sz ? settings.accentColor : '#a1a1aa',
                        background: settings.fontSize === sz ? `${settings.accentColor}18` : 'transparent',
                      }}
                    >
                      <span style={{ fontSize: sz === 'small' ? 12 : sz === 'medium' ? 16 : 22 }}>Aa</span>
                      <span style={{ fontSize: 11, marginTop: 2 }}>{sz.charAt(0).toUpperCase() + sz.slice(1)}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* LANGUAGE */}
          {activeSection === 'language' && (
            <div>
              <h2 style={s.sectionTitle}>🌐 Language</h2>
              <div style={s.card}>
                <div style={s.cardHeader}>
                  <p style={s.cardLabel}>Display Language</p>
                  <p style={s.cardDesc}>Select the language for the application interface.</p>
                </div>
                <div style={s.langGrid}>
                  {LANGUAGES.map(l => (
                    <button
                      key={l.code}
                      onClick={() => update('language', l.code)}
                      style={{
                        ...s.langBtn,
                        borderColor: settings.language === l.code ? settings.accentColor : '#3f3f46',
                        background: settings.language === l.code ? `${settings.accentColor}18` : 'transparent',
                        color: settings.language === l.code ? settings.accentColor : '#d4d4d8',
                      }}
                    >
                      {settings.language === l.code && <span style={{ marginRight: 6 }}>✓</span>}
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS */}
          {activeSection === 'notifications' && (
            <div>
              <h2 style={s.sectionTitle}>🔔 Notifications & Voice</h2>
              <div style={s.card}>
                <ToggleRow
                  icon="🔔"
                  label="Push Notifications"
                  desc="Receive alerts for weather warnings and crop tips."
                  checked={settings.notifications}
                  accent={settings.accentColor}
                  onChange={v => update('notifications', v)}
                />
              </div>
              <div style={s.card}>
                <ToggleRow
                  icon="🎤"
                  label="Voice Input"
                  desc="Enable microphone for voice messaging in the chat."
                  checked={settings.voiceEnabled}
                  accent={settings.accentColor}
                  onChange={v => update('voiceEnabled', v)}
                />
              </div>
            </div>
          )}

          {/* PRIVACY */}
          {activeSection === 'privacy' && (
            <div>
              <h2 style={s.sectionTitle}>🔒 Privacy & Security</h2>
              <div style={s.card}>
                <ToggleRow
                  icon="🕵️"
                  label="Privacy Mode"
                  desc="Blur sensitive information and disable chat previews in the sidebar."
                  checked={settings.privacyMode}
                  accent={settings.accentColor}
                  onChange={v => update('privacyMode', v)}
                />
              </div>
              <div style={{ ...s.card, border: '1px solid rgba(220,38,38,0.3)', background: 'rgba(220,38,38,0.05)' }}>
                <p style={{ ...s.cardLabel, color: '#f87171' }}>Data</p>
                <p style={{ ...s.cardDesc, marginBottom: 16 }}>Clear all locally cached settings and preferences. Your chats and account data are not affected.</p>
                <button
                  style={s.dangerBtn}
                  onClick={() => {
                    localStorage.removeItem(SETTINGS_KEY);
                    localStorage.removeItem('agriSenseTheme');
                    setSettings(DEFAULT_SETTINGS);
                    setSaved(false);
                  }}
                >
                  🗑️ Clear Local Settings
                </button>
              </div>
            </div>
          )}

          {/* Save / Reset buttons */}
          <div style={s.actionRow}>
            <button style={s.resetBtn} onClick={handleReset}>↺ Reset Defaults</button>
            <button
              style={{ ...s.saveBtn, background: `linear-gradient(135deg, ${settings.accentColor}, ${settings.accentColor}cc)` }}
              onClick={handleSave}
            >
              💾 Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* Toggle Row sub-component */
interface ToggleRowProps {
  icon: string;
  label: string;
  desc: string;
  checked: boolean;
  accent: string;
  onChange: (v: boolean) => void;
}
const ToggleRow: React.FC<ToggleRowProps> = ({ icon, label, desc, checked, accent, onChange }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      <span style={{ fontSize: 22, marginTop: 2 }}>{icon}</span>
      <div>
        <p style={{ margin: 0, fontWeight: 600, color: '#f4f4f5', fontSize: 14 }}>{label}</p>
        <p style={{ margin: '4px 0 0', color: '#71717a', fontSize: 13 }}>{desc}</p>
      </div>
    </div>
    <button
      onClick={() => onChange(!checked)}
      role="switch"
      aria-checked={checked}
      style={{
        width: 48, height: 26, borderRadius: 13, border: 'none', cursor: 'pointer',
        background: checked ? accent : '#3f3f46',
        position: 'relative', flexShrink: 0, transition: 'background 0.2s',
      }}
    >
      <span style={{
        position: 'absolute', top: 3, borderRadius: '50%', width: 20, height: 20,
        background: '#fff', transition: 'left 0.2s',
        left: checked ? 24 : 4,
      }} />
    </button>
  </div>
);

/* Styles */
const s: Record<string, React.CSSProperties> = {
  page: { padding: 24, minHeight: '100%', color: '#f4f4f5', fontFamily: 'Inter, sans-serif', position: 'relative' },
  toast: { position: 'fixed', top: 20, right: 20, zIndex: 9999, padding: '12px 20px', borderRadius: 10, background: '#16a34a', color: '#fff', fontWeight: 600, fontSize: 14, boxShadow: '0 4px 20px rgba(0,0,0,0.4)' },
  container: { display: 'flex', gap: 28, maxWidth: 900, margin: '0 auto', flexWrap: 'wrap' },
  sidebar: { width: 210, flexShrink: 0 },
  pageTitle: { fontSize: 22, fontWeight: 700, margin: '0 0 20px', background: 'linear-gradient(135deg,#4ade80,#22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  nav: { display: 'flex', flexDirection: 'column', gap: 4 },
  navBtn: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, border: 'none', background: 'transparent', color: '#a1a1aa', cursor: 'pointer', fontSize: 14, fontWeight: 500, textAlign: 'left', width: '100%', transition: 'all 0.15s' },
  navBtnActive: { background: 'rgba(74,222,128,0.12)', color: '#4ade80' },
  divider: { height: 1, background: '#27272a', margin: '12px 0' },
  logoutBtn: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, border: 'none', background: 'transparent', color: '#f87171', cursor: 'pointer', fontSize: 14, fontWeight: 500, width: '100%' },
  content: { flex: 1, minWidth: 280 },
  sectionTitle: { margin: '0 0 20px', fontSize: 20, fontWeight: 700, color: '#f4f4f5' },
  card: { background: '#18181b', border: '1px solid #27272a', borderRadius: 14, padding: '20px 24px', marginBottom: 16 },
  cardHeader: { marginBottom: 16 },
  cardLabel: { margin: 0, fontWeight: 700, fontSize: 15, color: '#f4f4f5' },
  cardDesc: { margin: '4px 0 0', color: '#71717a', fontSize: 13 },
  // Theme
  themeRow: { display: 'flex', gap: 14, flexWrap: 'wrap' },
  themeBtn: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '18px 28px', borderRadius: 12, border: '2px solid', background: '#09090b', cursor: 'pointer', position: 'relative', minWidth: 110, transition: 'all 0.2s' },
  themeBtnLabel: { fontSize: 13, fontWeight: 600, color: '#d4d4d8' },
  themeBtnCheck: { position: 'absolute', top: 8, right: 10, fontWeight: 700, fontSize: 16 },
  // Colors
  colorGrid: { display: 'flex', gap: 12, flexWrap: 'wrap' },
  colorSwatch: { width: 34, height: 34, borderRadius: '50%', border: 'none', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' },
  // Font
  fontRow: { display: 'flex', gap: 12, flexWrap: 'wrap' },
  fontBtn: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '14px 24px', borderRadius: 10, border: '2px solid', cursor: 'pointer', transition: 'all 0.2s', minWidth: 80 },
  // Language
  langGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 },
  langBtn: { padding: '10px 14px', borderRadius: 10, border: '2px solid', cursor: 'pointer', fontSize: 13, fontWeight: 600, textAlign: 'left', transition: 'all 0.15s' },
  // Actions
  actionRow: { display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 8 },
  resetBtn: { padding: '10px 20px', borderRadius: 10, border: '1px solid #3f3f46', background: 'transparent', color: '#a1a1aa', cursor: 'pointer', fontWeight: 600, fontSize: 14 },
  saveBtn: { padding: '10px 28px', borderRadius: 10, border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: 14, boxShadow: '0 4px 14px rgba(22,163,74,0.3)' },
  // Danger
  dangerBtn: { padding: '8px 18px', borderRadius: 8, border: '1px solid #dc2626', background: 'rgba(220,38,38,0.1)', color: '#f87171', cursor: 'pointer', fontWeight: 600, fontSize: 13 },
};

export default SettingsPage;
