import React, { useState, useEffect, useRef } from 'react';
import { profileService } from '../services/profileService';
import type { User } from '../types';
import { INDIAN_STATES_DISTRICTS, COMMON_CROPS } from '../constants';

interface ProfilePageProps {
  user: User;
  onProfileUpdate: (updatedUser: User) => void;
  onLogout: () => void;
  onDeleteAccount: () => void;
}

type Toast = { message: string; type: 'success' | 'error' };
type Section = 'profile' | 'password' | 'danger';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी (Hindi)' },
  { code: 'mr', label: 'मराठी (Marathi)' },
  { code: 'ta', label: 'தமிழ் (Tamil)' },
  { code: 'te', label: 'తెలుగు (Telugu)' },
  { code: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
  { code: 'gu', label: 'ગુજરાતી (Gujarati)' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ (Punjabi)' },
  { code: 'bn', label: 'বাংলা (Bengali)' },
];

const ALL_STATES = Object.keys(INDIAN_STATES_DISTRICTS);

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onProfileUpdate, onLogout, onDeleteAccount }) => {
  const [activeSection, setActiveSection] = useState<Section>('profile');
  const [toast, setToast] = useState<Toast | null>(null);
  const [saving, setSaving] = useState(false);

  // Profile form
  const [name, setName] = useState(user.name || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [state, setState] = useState(user.state || '');
  const [district, setDistrict] = useState(user.district || '');
  const [preferredCrop, setPreferredCrop] = useState(user.preferredCrop || '');
  const [language, setLanguage] = useState(user.language || 'en');
  const [profilePicture, setProfilePicture] = useState(user.profilePicture || '');
  const [nameError, setNameError] = useState('');

  // Password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwErrors, setPwErrors] = useState<Record<string, string>>({});

  // Delete confirm
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const districts = state ? INDIAN_STATES_DISTRICTS[state] || [] : [];

  useEffect(() => {
    if (state && !districts.includes(district)) {
      setDistrict(districts[0] || '');
    }
  }, [state]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) { showToast('Only JPG, PNG, WEBP images allowed.', 'error'); return; }
    if (file.size > 2 * 1024 * 1024) { showToast('Image must be under 2MB.', 'error'); return; }
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
    const base64 = `data:${file.type};base64,${btoa(binary)}`;
    setProfilePicture(base64);
  };

  const handleSaveProfile = async () => {
    if (!name.trim()) { setNameError('Name is required.'); return; }
    setNameError('');
    setSaving(true);
    try {
      const result = await profileService.updateProfile({ name, phone, state, district, preferredCrop, language, profilePicture });
      onProfileUpdate(result.user);
      showToast('Profile saved successfully!', 'success');
    } catch {
      showToast('Failed to save profile.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    const errors: Record<string, string> = {};
    if (!currentPassword) errors.currentPassword = 'Current password is required.';
    if (!newPassword || newPassword.length < 6) errors.newPassword = 'New password must be at least 6 characters.';
    if (newPassword !== confirmPassword) errors.confirmPassword = 'Passwords do not match.';
    setPwErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setSaving(true);
    try {
      await profileService.changePassword({ currentPassword, newPassword });
      showToast('Password changed successfully!', 'success');
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
    } catch (err: any) {
      showToast(err?.message || 'Failed to change password.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await profileService.deleteAccount();
      onDeleteAccount();
    } catch {
      showToast('Failed to delete account.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const initials = name ? name.charAt(0).toUpperCase() : '?';

  return (
    <div style={s.page}>
      {/* Toast */}
      {toast && (
        <div style={{ ...s.toast, background: toast.type === 'success' ? '#16a34a' : '#dc2626' }}>
          {toast.type === 'success' ? '✅' : '❌'} {toast.message}
        </div>
      )}

      <div style={s.container}>
        {/* Left: Avatar + Nav */}
        <div style={s.sidebar}>
          {/* Avatar */}
          <div style={s.avatarWrap}>
            <div style={s.avatarOuter} onClick={() => fileInputRef.current?.click()} title="Click to change photo">
              {profilePicture ? (
                <img src={profilePicture} alt="Profile" style={s.avatarImg} />
              ) : (
                <span style={s.avatarInitials}>{initials}</span>
              )}
              <div style={s.avatarOverlay}>📷</div>
            </div>
            <input ref={fileInputRef} type="file" accept="image/jpg,image/jpeg,image/png,image/webp" style={{ display: 'none' }} onChange={handleAvatarChange} />
            <p style={s.avatarName}>{name || 'Your Name'}</p>
            <p style={s.avatarEmail}>{user.email}</p>
          </div>

          {/* Nav */}
          <nav style={s.nav}>
            {([['profile', '👤', 'Profile'], ['password', '🔒', 'Password'], ['danger', '⚠️', 'Danger Zone']] as [Section, string, string][]).map(([key, icon, label]) => (
              <button key={key} style={{ ...s.navBtn, ...(activeSection === key ? s.navBtnActive : {}) }} onClick={() => setActiveSection(key)}>
                <span>{icon}</span> {label}
              </button>
            ))}
            <button style={s.logoutBtn} onClick={onLogout}>
              <span>🚪</span> Logout
            </button>
          </nav>
        </div>

        {/* Right: Content */}
        <div style={s.content}>
          {/* Profile Section */}
          {activeSection === 'profile' && (
            <div>
              <h2 style={s.sectionTitle}>Profile Information</h2>
              <div style={s.grid}>
                <div style={s.field}>
                  <label style={s.label}>Full Name *</label>
                  <input style={{ ...s.input, borderColor: nameError ? '#f87171' : '#3f3f46' }} value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" />
                  {nameError && <span style={s.errText}>{nameError}</span>}
                </div>
                <div style={s.field}>
                  <label style={s.label}>Email Address</label>
                  <input style={{ ...s.input, opacity: 0.5, cursor: 'not-allowed' }} value={user.email} readOnly />
                </div>
                <div style={s.field}>
                  <label style={s.label}>Phone Number</label>
                  <input style={s.input} value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 XXXXX XXXXX" />
                </div>
                <div style={s.field}>
                  <label style={s.label}>State</label>
                  <select style={s.input} value={state} onChange={e => setState(e.target.value)}>
                    <option value="">Select State</option>
                    {ALL_STATES.map(st => <option key={st} value={st}>{st}</option>)}
                  </select>
                </div>
                <div style={s.field}>
                  <label style={s.label}>District</label>
                  <select style={s.input} value={district} onChange={e => setDistrict(e.target.value)} disabled={!state}>
                    <option value="">Select District</option>
                    {districts.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div style={s.field}>
                  <label style={s.label}>Preferred Crop</label>
                  <select style={s.input} value={preferredCrop} onChange={e => setPreferredCrop(e.target.value)}>
                    <option value="">Select Crop</option>
                    {COMMON_CROPS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div style={s.field}>
                  <label style={s.label}>Language</label>
                  <select style={s.input} value={language} onChange={e => setLanguage(e.target.value)}>
                    {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ marginTop: 24 }}>
                <button style={s.saveBtn} onClick={handleSaveProfile} disabled={saving}>
                  {saving ? 'Saving…' : '💾 Save Profile'}
                </button>
              </div>
            </div>
          )}

          {/* Password Section */}
          {activeSection === 'password' && (
            <div>
              <h2 style={s.sectionTitle}>Change Password</h2>
              <div style={{ maxWidth: 420 }}>
                {([['currentPassword', 'Current Password', currentPassword, setCurrentPassword] as const,
                   ['newPassword', 'New Password', newPassword, setNewPassword] as const,
                   ['confirmPassword', 'Confirm New Password', confirmPassword, setConfirmPassword] as const
                ]).map(([key, label, value, setter]) => (
                  <div key={key} style={{ ...s.field, marginBottom: 16 }}>
                    <label style={s.label}>{label}</label>
                    <input type="password" style={{ ...s.input, borderColor: pwErrors[key] ? '#f87171' : '#3f3f46' }} value={value} onChange={e => setter(e.target.value)} placeholder="••••••••" />
                    {pwErrors[key] && <span style={s.errText}>{pwErrors[key]}</span>}
                  </div>
                ))}
                <button style={s.saveBtn} onClick={handleChangePassword} disabled={saving}>
                  {saving ? 'Updating…' : '🔒 Update Password'}
                </button>
              </div>
            </div>
          )}

          {/* Danger Zone */}
          {activeSection === 'danger' && (
            <div>
              <h2 style={{ ...s.sectionTitle, color: '#f87171' }}>⚠️ Danger Zone</h2>
              <div style={s.dangerCard}>
                <div>
                  <p style={{ fontWeight: 700, color: '#f4f4f5', margin: '0 0 4px' }}>Delete Account</p>
                  <p style={{ color: '#a1a1aa', margin: 0, fontSize: 14 }}>Permanently delete your account and all chat history. This action cannot be undone.</p>
                </div>
                <button style={s.deleteBtn} onClick={() => setShowDeleteConfirm(true)}>Delete Account</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirm Modal */}
      {showDeleteConfirm && (
        <div style={s.overlay}>
          <div style={s.modal}>
            <h2 style={{ color: '#f87171', margin: '0 0 12px', fontSize: 20 }}>🗑️ Delete Account</h2>
            <p style={{ color: '#a1a1aa', marginBottom: 24 }}>
              This will <strong style={{ color: '#fff' }}>permanently delete</strong> your account and all your chat history. Are you absolutely sure?
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button style={s.cancelBtn} onClick={() => setShowDeleteConfirm(false)} disabled={deleting}>Cancel</button>
              <button style={{ ...s.deleteBtn, padding: '10px 20px' }} onClick={handleDeleteAccount} disabled={deleting}>
                {deleting ? 'Deleting…' : 'Yes, Delete Everything'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const s: Record<string, React.CSSProperties> = {
  page: { padding: 24, minHeight: '100%', color: '#f4f4f5', fontFamily: 'Inter, sans-serif', position: 'relative' },
  toast: { position: 'fixed', top: 20, right: 20, zIndex: 9999, padding: '12px 20px', borderRadius: 10, color: '#fff', fontWeight: 600, fontSize: 14, boxShadow: '0 4px 20px rgba(0,0,0,0.4)' },
  container: { display: 'flex', gap: 28, maxWidth: 960, margin: '0 auto', flexWrap: 'wrap' },
  sidebar: { width: 220, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 16 },
  avatarWrap: { textAlign: 'center', padding: '24px 0 0' },
  avatarOuter: { width: 96, height: 96, borderRadius: '50%', background: 'linear-gradient(135deg,#16a34a,#0d9488)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', margin: '0 auto 12px', position: 'relative', overflow: 'hidden', border: '3px solid #27272a', boxShadow: '0 4px 20px rgba(22,163,74,0.3)' },
  avatarImg: { width: '100%', height: '100%', objectFit: 'cover' },
  avatarInitials: { fontSize: 36, fontWeight: 700, color: '#fff' },
  avatarOverlay: { position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s', fontSize: 24 },
  avatarName: { margin: '0 0 4px', fontWeight: 700, fontSize: 15, color: '#f4f4f5' },
  avatarEmail: { margin: 0, fontSize: 12, color: '#71717a', wordBreak: 'break-all' },
  nav: { display: 'flex', flexDirection: 'column', gap: 4 },
  navBtn: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, border: 'none', background: 'transparent', color: '#a1a1aa', cursor: 'pointer', fontSize: 14, fontWeight: 500, textAlign: 'left', width: '100%', transition: 'all 0.15s' },
  navBtnActive: { background: 'rgba(74,222,128,0.12)', color: '#4ade80' },
  logoutBtn: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, border: 'none', background: 'transparent', color: '#f87171', cursor: 'pointer', fontSize: 14, fontWeight: 500, textAlign: 'left', width: '100%', marginTop: 8 },
  content: { flex: 1, minWidth: 280, background: '#18181b', border: '1px solid #27272a', borderRadius: 16, padding: 32 },
  sectionTitle: { margin: '0 0 24px', fontSize: 20, fontWeight: 700, color: '#f4f4f5' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 13, fontWeight: 600, color: '#a1a1aa' },
  input: { padding: '10px 12px', borderRadius: 8, border: '1px solid #3f3f46', background: '#09090b', color: '#f4f4f5', fontSize: 14, outline: 'none', width: '100%', boxSizing: 'border-box' },
  errText: { fontSize: 12, color: '#f87171' },
  saveBtn: { padding: '10px 24px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#16a34a,#15803d)', color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: 14, boxShadow: '0 4px 14px rgba(22,163,74,0.35)' },
  dangerCard: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, border: '1px solid rgba(220,38,38,0.3)', borderRadius: 12, padding: 20, background: 'rgba(220,38,38,0.06)' },
  deleteBtn: { padding: '8px 18px', borderRadius: 8, border: '1px solid #dc2626', background: 'rgba(220,38,38,0.15)', color: '#f87171', cursor: 'pointer', fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 },
  modal: { background: '#18181b', border: '1px solid #3f3f46', borderRadius: 16, padding: 32, width: '100%', maxWidth: 440, boxShadow: '0 24px 64px rgba(0,0,0,0.5)' },
  cancelBtn: { padding: '10px 20px', borderRadius: 10, border: '1px solid #3f3f46', background: 'transparent', color: '#a1a1aa', cursor: 'pointer', fontWeight: 600 },
};

export default ProfilePage;
