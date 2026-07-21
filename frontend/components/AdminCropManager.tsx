import React, { useState, useEffect, useCallback } from 'react';
import { cropService, Crop } from '../services/cropService';

const EMPTY_FORM: Omit<Crop, '_id'> = {
  cropName: '',
  soilType: '',
  temperature: '',
  fertilizer: '',
  irrigation: '',
  season: '',
};

type Toast = { message: string; type: 'success' | 'error' };

const AdminCropManager: React.FC = () => {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [filtered, setFiltered] = useState<Crop[]>([]);
  const [search, setSearch] = useState('');
  const [seasonFilter, setSeasonFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<Toast | null>(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCrop, setEditingCrop] = useState<Crop | null>(null);
  const [form, setForm] = useState<Omit<Crop, '_id'>>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof typeof EMPTY_FORM, string>>>({});
  const [saving, setSaving] = useState(false);

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState<Crop | null>(null);
  const [deleting, setDeleting] = useState(false);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadCrops = useCallback(async () => {
    setLoading(true);
    try {
      const data = await cropService.getAllCrops();
      setCrops(data);
    } catch {
      showToast('Failed to load crops.', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadCrops(); }, [loadCrops]);

  useEffect(() => {
    let result = crops;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(c =>
        c.cropName.toLowerCase().includes(q) ||
        (c.soilType || '').toLowerCase().includes(q) ||
        (c.season || '').toLowerCase().includes(q)
      );
    }
    if (seasonFilter) {
      result = result.filter(c => (c.season || '').toLowerCase() === seasonFilter.toLowerCase());
    }
    setFiltered(result);
  }, [crops, search, seasonFilter]);

  const allSeasons = Array.from(new Set(crops.map(c => c.season).filter(Boolean)));

  const openAdd = () => {
    setEditingCrop(null);
    setForm(EMPTY_FORM);
    setFormErrors({});
    setModalOpen(true);
  };

  const openEdit = (crop: Crop) => {
    setEditingCrop(crop);
    setForm({ cropName: crop.cropName, soilType: crop.soilType || '', temperature: crop.temperature || '', fertilizer: crop.fertilizer || '', irrigation: crop.irrigation || '', season: crop.season || '' });
    setFormErrors({});
    setModalOpen(true);
  };

  const validate = () => {
    const errors: typeof formErrors = {};
    if (!form.cropName.trim()) errors.cropName = 'Crop name is required.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      if (editingCrop?._id) {
        await cropService.updateCrop(editingCrop._id, form);
        showToast('Crop updated successfully!', 'success');
      } else {
        await cropService.createCrop(form);
        showToast('Crop added successfully!', 'success');
      }
      setModalOpen(false);
      loadCrops();
    } catch {
      showToast('Failed to save crop.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget?._id) return;
    setDeleting(true);
    try {
      await cropService.deleteCrop(deleteTarget._id);
      showToast('Crop deleted.', 'success');
      setDeleteTarget(null);
      loadCrops();
    } catch {
      showToast('Failed to delete crop.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const fields: { key: keyof typeof EMPTY_FORM; label: string; placeholder: string }[] = [
    { key: 'cropName', label: 'Crop Name *', placeholder: 'e.g. Rice' },
    { key: 'soilType', label: 'Soil Type', placeholder: 'e.g. Loamy' },
    { key: 'temperature', label: 'Temperature', placeholder: 'e.g. 20–30°C' },
    { key: 'fertilizer', label: 'Fertilizer', placeholder: 'e.g. Urea, DAP' },
    { key: 'irrigation', label: 'Irrigation', placeholder: 'e.g. Drip, Flood' },
    { key: 'season', label: 'Season', placeholder: 'e.g. Kharif' },
  ];

  return (
    <div style={styles.wrapper}>
      {/* Toast */}
      {toast && (
        <div style={{ ...styles.toast, background: toast.type === 'success' ? '#16a34a' : '#dc2626' }}>
          {toast.type === 'success' ? '✅' : '❌'} {toast.message}
        </div>
      )}

      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>🌾 Crop Database</h1>
          <p style={styles.subtitle}>{crops.length} crop{crops.length !== 1 ? 's' : ''} in database</p>
        </div>
        <button style={styles.addBtn} onClick={openAdd}>+ Add Crop</button>
      </div>

      {/* Filters */}
      <div style={styles.filterRow}>
        <input
          style={styles.searchInput}
          placeholder="🔍  Search by name, soil, season…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select style={styles.select} value={seasonFilter} onChange={e => setSeasonFilter(e.target.value)}>
          <option value="">All Seasons</option>
          {allSeasons.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div style={styles.center}><div style={styles.spinner} /></div>
      ) : filtered.length === 0 ? (
        <div style={styles.empty}>No crops found. {search || seasonFilter ? 'Try clearing filters.' : 'Click "+ Add Crop" to get started.'}</div>
      ) : (
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                {['Crop Name', 'Soil Type', 'Temperature', 'Fertilizer', 'Irrigation', 'Season', 'Actions'].map(h => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((crop, i) => (
                <tr key={crop._id} style={{ ...styles.tr, background: i % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'transparent' }}>
                  <td style={{ ...styles.td, fontWeight: 600, color: '#4ade80' }}>{crop.cropName}</td>
                  <td style={styles.td}>{crop.soilType || '—'}</td>
                  <td style={styles.td}>{crop.temperature || '—'}</td>
                  <td style={styles.td}>{crop.fertilizer || '—'}</td>
                  <td style={styles.td}>{crop.irrigation || '—'}</td>
                  <td style={styles.td}>
                    {crop.season ? <span style={styles.badge}>{crop.season}</span> : '—'}
                  </td>
                  <td style={styles.td}>
                    <button style={styles.editBtn} onClick={() => openEdit(crop)}>✏️ Edit</button>
                    <button style={styles.delBtn} onClick={() => setDeleteTarget(crop)}>🗑️ Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h2 style={styles.modalTitle}>{editingCrop ? '✏️ Edit Crop' : '🌱 Add New Crop'}</h2>
            <div style={styles.formGrid}>
              {fields.map(({ key, label, placeholder }) => (
                <div key={key} style={styles.formGroup}>
                  <label style={styles.label}>{label}</label>
                  <input
                    style={{ ...styles.input, borderColor: formErrors[key] ? '#f87171' : '#3f3f46' }}
                    placeholder={placeholder}
                    value={form[key]}
                    onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                  />
                  {formErrors[key] && <span style={styles.errorText}>{formErrors[key]}</span>}
                </div>
              ))}
            </div>
            <div style={styles.modalActions}>
              <button style={styles.cancelBtn} onClick={() => setModalOpen(false)} disabled={saving}>Cancel</button>
              <button style={styles.saveBtn} onClick={handleSave} disabled={saving}>
                {saving ? 'Saving…' : editingCrop ? 'Update Crop' : 'Add Crop'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <div style={styles.overlay}>
          <div style={{ ...styles.modal, maxWidth: 400 }}>
            <h2 style={{ ...styles.modalTitle, color: '#f87171' }}>🗑️ Delete Crop</h2>
            <p style={{ color: '#a1a1aa', marginBottom: 24 }}>
              Are you sure you want to delete <strong style={{ color: '#fff' }}>{deleteTarget.cropName}</strong>? This action cannot be undone.
            </p>
            <div style={styles.modalActions}>
              <button style={styles.cancelBtn} onClick={() => setDeleteTarget(null)} disabled={deleting}>Cancel</button>
              <button style={{ ...styles.saveBtn, background: '#dc2626' }} onClick={handleDelete} disabled={deleting}>
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  wrapper: { padding: '24px', minHeight: '100%', color: '#f4f4f5', fontFamily: 'Inter, sans-serif', position: 'relative' },
  toast: { position: 'fixed', top: 20, right: 20, zIndex: 9999, padding: '12px 20px', borderRadius: 10, color: '#fff', fontWeight: 600, fontSize: 14, boxShadow: '0 4px 20px rgba(0,0,0,0.4)', animation: 'fadeIn 0.3s ease' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 24 },
  title: { fontSize: 28, fontWeight: 700, margin: 0, background: 'linear-gradient(135deg,#4ade80,#22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  subtitle: { margin: '4px 0 0', color: '#71717a', fontSize: 14 },
  addBtn: { padding: '10px 20px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#16a34a,#15803d)', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer', boxShadow: '0 4px 14px rgba(22,163,74,0.4)', transition: 'transform 0.15s' },
  filterRow: { display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' },
  searchInput: { flex: 1, minWidth: 220, padding: '10px 14px', borderRadius: 10, border: '1px solid #3f3f46', background: '#18181b', color: '#f4f4f5', fontSize: 14, outline: 'none' },
  select: { padding: '10px 14px', borderRadius: 10, border: '1px solid #3f3f46', background: '#18181b', color: '#f4f4f5', fontSize: 14, outline: 'none', cursor: 'pointer' },
  tableWrap: { overflowX: 'auto', borderRadius: 14, border: '1px solid #27272a' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 14 },
  thead: { background: 'rgba(39,39,42,0.9)' },
  th: { padding: '12px 16px', textAlign: 'left', color: '#a1a1aa', fontWeight: 600, whiteSpace: 'nowrap' },
  tr: { borderBottom: '1px solid #27272a', transition: 'background 0.15s' },
  td: { padding: '11px 16px', verticalAlign: 'middle', color: '#d4d4d8' },
  badge: { padding: '2px 10px', borderRadius: 20, background: 'rgba(74,222,128,0.12)', color: '#4ade80', fontWeight: 600, fontSize: 12 },
  editBtn: { marginRight: 8, padding: '5px 12px', borderRadius: 8, border: '1px solid #3f3f46', background: '#27272a', color: '#e4e4e7', cursor: 'pointer', fontSize: 12 },
  delBtn: { padding: '5px 12px', borderRadius: 8, border: '1px solid #dc262640', background: 'rgba(220,38,38,0.1)', color: '#f87171', cursor: 'pointer', fontSize: 12 },
  center: { display: 'flex', justifyContent: 'center', padding: 60 },
  spinner: { width: 36, height: 36, border: '3px solid #3f3f46', borderTopColor: '#4ade80', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
  empty: { textAlign: 'center', color: '#71717a', padding: 60, fontSize: 15 },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 },
  modal: { background: '#18181b', border: '1px solid #3f3f46', borderRadius: 16, padding: '32px', width: '100%', maxWidth: 620, boxShadow: '0 24px 64px rgba(0,0,0,0.5)' },
  modalTitle: { margin: '0 0 24px', fontSize: 20, fontWeight: 700 },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 },
  formGroup: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 13, fontWeight: 600, color: '#a1a1aa' },
  input: { padding: '10px 12px', borderRadius: 8, border: '1px solid', background: '#09090b', color: '#f4f4f5', fontSize: 14, outline: 'none' },
  errorText: { fontSize: 12, color: '#f87171' },
  modalActions: { display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 28 },
  cancelBtn: { padding: '10px 20px', borderRadius: 10, border: '1px solid #3f3f46', background: 'transparent', color: '#a1a1aa', cursor: 'pointer', fontWeight: 600 },
  saveBtn: { padding: '10px 24px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#16a34a,#15803d)', color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: 14 },
};

export default AdminCropManager;
