import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function ScanPage() {
  const { lotCode } = useParams();
  const navigate = useNavigate();
  const [lot, setLot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [plateNumber, setPlateNumber] = useState('');
  const [driverPhone, setDriverPhone] = useState('');

  useEffect(() => { fetchLot(); }, [lotCode]);

  const fetchLot = async () => {
    try {
      const res = await api.get(`/lots/code/${lotCode}`);
      setLot(res.data.lot);
    } catch { toast.error('Parking lot not found'); }
    finally { setLoading(false); }
  };

  const handleStart = async () => {
    setSubmitting(true);
    try {
      const res = await api.post('/sessions/init', { lotId: lot._id, plateNumber: plateNumber || null, driverPhone: driverPhone || null });
      localStorage.setItem('parkpay_session', res.data.session.sessionToken);
      navigate(`/session/${res.data.session.sessionToken}`);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to start session'); }
    finally { setSubmitting(false); }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#eff6ff' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 40, height: 40, border: '4px solid #2563eb', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto 12px', animation: 'spin 1s linear infinite' }} />
        <p style={{ color: '#64748b' }}>Loading parking info...</p>
      </div>
    </div>
  );

  if (!lot) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fef2f2', padding: 20 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>❌</div>
        <h2 style={{ color: '#dc2626' }}>Parking lot not found</h2>
        <p style={{ color: '#64748b' }}>Please scan the QR code again or type the URL manually</p>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#eff6ff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 16, fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ width: '100%', maxWidth: 420, background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 24px #0002' }}>
        <div style={{ background: '#1d4ed8', padding: '32px 24px', textAlign: 'center', color: '#fff' }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🅿️</div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>ParkPay</h1>
          <p style={{ margin: '6px 0 0', color: '#bfdbfe', fontSize: 13 }}>Pay from your phone — no booth needed</p>
        </div>

        <div style={{ padding: '20px 20px 8px', borderBottom: '1px solid #f1f5f9' }}>
          <h2 style={{ margin: '0 0 4px', fontSize: 18, fontWeight: 800 }}>{lot.name}</h2>
          <p style={{ margin: '0 0 14px', fontSize: 13, color: '#64748b' }}>📍 {lot.address}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            <div style={{ background: '#eff6ff', borderRadius: 10, padding: 12, textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: '#64748b' }}>Per Hour</div>
              <div style={{ fontWeight: 800, color: '#1d4ed8', fontSize: 16 }}>₦{lot.ratePerHour}</div>
            </div>
            <div style={{ background: '#f0fdf4', borderRadius: 10, padding: 12, textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: '#64748b' }}>Free First</div>
              <div style={{ fontWeight: 800, color: '#16a34a', fontSize: 16 }}>{lot.gracePeriodMinutes}min</div>
            </div>
            <div style={{ background: '#fff7ed', borderRadius: 10, padding: 12, textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: '#64748b' }}>Min Fee</div>
              <div style={{ fontWeight: 800, color: '#ea580c', fontSize: 16 }}>₦{lot.minimumCharge}</div>
            </div>
          </div>
        </div>

        <div style={{ padding: '20px 20px 24px' }}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Plate Number <span style={{ color: '#9ca3af', fontWeight: 400 }}>(optional)</span></label>
            <input type="text" value={plateNumber} onChange={e => setPlateNumber(e.target.value.toUpperCase())} placeholder="e.g. LND-234-KJA (skip if faded)" style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: 10, padding: '12px 14px', fontSize: 15, textTransform: 'uppercase', letterSpacing: 2, outline: 'none', boxSizing: 'border-box' }} />
            <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>Leave blank if plate is unreadable — session code will identify you</p>
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Phone Number <span style={{ color: '#9ca3af', fontWeight: 400 }}>(for SMS receipt)</span></label>
            <input type="tel" value={driverPhone} onChange={e => setDriverPhone(e.target.value)} placeholder="08012345678" style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: 10, padding: '12px 14px', fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <button onClick={handleStart} disabled={submitting} style={{ width: '100%', background: submitting ? '#93c5fd' : '#1d4ed8', color: '#fff', border: 'none', padding: '16px', borderRadius: 12, fontSize: 16, fontWeight: 800, cursor: submitting ? 'not-allowed' : 'pointer' }}>
            {submitting ? 'Starting...' : '🚗 Start Parking Session'}
          </button>
          <p style={{ textAlign: 'center', fontSize: 11, color: '#9ca3af', marginTop: 12 }}>By starting, you agree to pay the parking fee before exiting</p>
        </div>
      </div>

      <div style={{ marginTop: 16, textAlign: 'center' }}>
        <p style={{ fontSize: 12, color: '#64748b' }}>Can't scan? Type this in your browser:</p>
        <p style={{ fontFamily: 'monospace', fontWeight: 700, color: '#1d4ed8', fontSize: 14 }}>{window.location.origin}/park/{lotCode}</p>
      </div>
    </div>
  );
}
