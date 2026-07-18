import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { attendant } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', address: '', phone: '', totalSpots: '', ratePerHour: '', minimumCharge: '', gracePeriodMinutes: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchLot(); }, []);

  const fetchLot = async () => {
    try {
      const res = await api.get(`/lots/${attendant?.lotId}`);
      const l = res.data.lot;
      setForm({ name: l.name, address: l.address, phone: l.phone || '', totalSpots: l.totalSpots, ratePerHour: l.ratePerHour, minimumCharge: l.minimumCharge, gracePeriodMinutes: l.gracePeriodMinutes });
    } catch { toast.error('Failed to load settings'); }
    finally { setLoading(false); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.patch(`/lots/${attendant?.lotId}`, { ...form, totalSpots: Number(form.totalSpots), ratePerHour: Number(form.ratePerHour), minimumCharge: Number(form.minimumCharge), gracePeriodMinutes: Number(form.gracePeriodMinutes) });
      toast.success('Settings saved!');
    } catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  const inputStyle = { width: '100%', border: '1px solid #d1d5db', borderRadius: 10, padding: '12px 14px', fontSize: 14, outline: 'none', boxSizing: 'border-box' };
  const labelStyle = { display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5 };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ background: '#1e40af', color: '#fff', padding: '0 24px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => navigate('/owner/dashboard')} style={{ background: 'transparent', border: 'none', color: '#93c5fd', cursor: 'pointer', fontSize: 20 }}>←</button>
            <span style={{ fontWeight: 700, fontSize: 16 }}>Lot Settings</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 700, margin: '32px auto', padding: '0 24px' }}>
        {loading ? <p>Loading...</p> : (
          <form onSubmit={handleSave} style={{ background: '#fff', borderRadius: 16, padding: 28, boxShadow: '0 1px 8px #0001' }}>
            <h2 style={{ margin: '0 0 24px', fontSize: 18, fontWeight: 700 }}>Parking Lot Information</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div><label style={labelStyle}>Lot Name</label><input style={inputStyle} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
              <div><label style={labelStyle}>Address</label><input style={inputStyle} value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} required /></div>
              <div><label style={labelStyle}>Contact Phone</label><input style={inputStyle} type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="08012345678" /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div><label style={labelStyle}>Total Parking Spots</label><input style={inputStyle} type="number" value={form.totalSpots} onChange={e => setForm({ ...form, totalSpots: e.target.value })} /></div>
                <div><label style={labelStyle}>Rate Per Hour (₦)</label><input style={inputStyle} type="number" value={form.ratePerHour} onChange={e => setForm({ ...form, ratePerHour: e.target.value })} required /></div>
                <div><label style={labelStyle}>Minimum Charge (₦)</label><input style={inputStyle} type="number" value={form.minimumCharge} onChange={e => setForm({ ...form, minimumCharge: e.target.value })} /></div>
                <div><label style={labelStyle}>Free Minutes on Entry</label><input style={inputStyle} type="number" value={form.gracePeriodMinutes} onChange={e => setForm({ ...form, gracePeriodMinutes: e.target.value })} /></div>
              </div>
            </div>
            <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
              <button type="button" onClick={() => navigate('/owner/dashboard')} style={{ flex: 1, background: '#f1f5f9', color: '#374151', border: 'none', padding: '13px', borderRadius: 10, cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
              <button type="submit" disabled={saving} style={{ flex: 2, background: '#1e40af', color: '#fff', border: 'none', padding: '13px', borderRadius: 10, cursor: 'pointer', fontWeight: 700, fontSize: 15, opacity: saving ? 0.7 : 1 }}>
                {saving ? 'Saving...' : '💾 Save Changes'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
