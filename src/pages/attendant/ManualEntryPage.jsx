import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useOffline } from '../../hooks/useOffline';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function ManualEntryPage() {
  const { attendant } = useAuth();
  const { saveOfflineSession } = useOffline();
  const navigate = useNavigate();
  const [form, setForm] = useState({ plateNumber: '', spotNumber: '', driverPhone: '', notes: '' });
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    setLoading(true);
    try {
      if (navigator.onLine) {
        await api.post('/sessions/manual', { lotId: attendant.lotId, ...form, plateNumber: form.plateNumber || null, spotNumber: form.spotNumber || null, driverPhone: form.driverPhone || null });
        toast.success('Session created!');
      } else {
        saveOfflineSession({ lotId: attendant.lotId, ...form, status: 'active', entryTime: new Date().toISOString(), paymentMethod: 'cash', notes: form.notes || 'Offline manual entry' });
        toast.success('Saved offline — will sync when back online');
      }
      navigate('/attendant/dashboard');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  const s = { width: '100%', border: '1px solid #d1d5db', borderRadius: 10, padding: '12px 14px', fontSize: 15, outline: 'none', boxSizing: 'border-box' };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ background: '#1e40af', color: '#fff', padding: '0 16px', display: 'flex', alignItems: 'center', height: 56 }}>
        <button onClick={() => navigate('/attendant/dashboard')} style={{ background: 'transparent', border: 'none', color: '#93c5fd', cursor: 'pointer', fontSize: 22, marginRight: 12 }}>←</button>
        <span style={{ fontWeight: 700, fontSize: 16 }}>Manual Entry</span>
      </div>
      <div style={{ maxWidth: 480, margin: '24px auto', padding: '0 16px' }}>
        <div style={{ background: '#fef3c7', border: '1px solid #fbbf24', borderRadius: 12, padding: 14, marginBottom: 16, fontSize: 13, color: '#92400e' }}>
          ⚠️ Use this when a driver can't scan the QR code or has no phone
        </div>
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 1px 8px #0001' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Plate Number <span style={{ color: '#9ca3af' }}>(optional)</span></label>
              <input style={{ ...s, textTransform: 'uppercase', letterSpacing: 2 }} placeholder="LND-234-KJA or skip" value={form.plateNumber} onChange={e => setForm({ ...form, plateNumber: e.target.value.toUpperCase() })} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Spot Number <span style={{ color: '#9ca3af' }}>(optional)</span></label>
              <input style={s} placeholder="e.g. A12 or Slot 5" value={form.spotNumber} onChange={e => setForm({ ...form, spotNumber: e.target.value })} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Driver Phone <span style={{ color: '#9ca3af' }}>(optional)</span></label>
              <input style={s} type="tel" placeholder="08012345678" value={form.driverPhone} onChange={e => setForm({ ...form, driverPhone: e.target.value })} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Notes</label>
              <textarea style={{ ...s, resize: 'vertical' }} rows={2} placeholder="Any notes about this vehicle..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
            </div>
          </div>
          <button onClick={handleCreate} disabled={loading} style={{ width: '100%', marginTop: 20, background: '#1d4ed8', color: '#fff', border: 'none', padding: '14px', borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Creating...' : '➕ Start Session'}
          </button>
          {!navigator.onLine && <p style={{ textAlign: 'center', fontSize: 12, color: '#f97316', marginTop: 10 }}>📴 Offline — session saved locally, will sync later</p>}
        </div>
      </div>
    </div>
  );
}
