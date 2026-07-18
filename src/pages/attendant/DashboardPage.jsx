import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useOffline } from '../../hooks/useOffline';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const STATUS_COLORS = { pending: '#f59e0b', active: '#3b82f6', 'pending-payment': '#8b5cf6', paid: '#10b981', 'cash-paid': '#14b8a6', completed: '#6b7280', waived: '#f97316' };
const STATUS_LABELS = { pending: '⏳ Waiting Entry', active: '🚗 Parked', 'pending-payment': '💳 Paying...', paid: '✅ Paid — Exit', 'cash-paid': '💵 Cash Paid', completed: '✔ Done', waived: '🆓 Waived' };

export default function DashboardPage() {
  const { attendant, logout } = useAuth();
  const { syncOfflineSessions, offlineCount, syncing } = useOffline();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [selected, setSelected] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [spotInput, setSpotInput] = useState('');
  const [simulating, setSimulating] = useState(false);

  useEffect(() => {
    fetchSessions();
    const interval = setInterval(fetchSessions, 15000);
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => { clearInterval(interval); window.removeEventListener('online', onOnline); window.removeEventListener('offline', onOffline); };
  }, []);

  const fetchSessions = async () => {
    try {
      const lotId = attendant?.lotId;
      if (!lotId) return;
      const res = await api.get(`/sessions/lot/${lotId}/active`);
      setSessions(res.data.sessions || []);
    } catch { } finally { setLoading(false); }
  };

  const handleAction = async (action, sessionId) => {
    setActionLoading(true);
    try {
      if (action === 'allow') await api.patch(`/sessions/${sessionId}/allow`, { spotNumber: spotInput || null });
      else if (action === 'cash') await api.patch(`/sessions/${sessionId}/cash-paid`, { notes: 'Cash collected' });
      else if (action === 'waive') await api.patch(`/sessions/${sessionId}/waive`, { notes: 'Fee waived by attendant' });
      else if (action === 'exit') await api.patch(`/sessions/${sessionId}/confirm-exit`);
      toast.success(action === 'allow' ? 'Entry allowed!' : action === 'cash' ? 'Marked as cash paid' : action === 'waive' ? 'Fee waived' : 'Exit confirmed');
      setSelected(null);
      setSpotInput('');
      fetchSessions();
    } catch (err) { toast.error(err.response?.data?.message || 'Action failed'); }
    finally { setActionLoading(false); }
  };

  const handleSync = async () => {
    try { const r = await syncOfflineSessions(); toast.success(`Synced ${r.synced} sessions`); fetchSessions(); }
    catch { toast.error('Sync failed'); }
  };

  // Testing convenience: simulates a driver scanning the QR code and
  // starting a session, without needing a second phone/tab open. It calls
  // the exact same public endpoint a real driver's phone would call.
  const handleSimulateCar = async () => {
    setSimulating(true);
    try {
      const plates = ['LND', 'ABJ', 'KAN', 'PHC', 'IBD'];
      const randomPlate = `${plates[Math.floor(Math.random() * plates.length)]}-${Math.floor(100 + Math.random() * 900)}-${['AA','BB','CC','DD'][Math.floor(Math.random()*4)]}`;
      await api.post('/sessions/init', { lotId: attendant.lotId, plateNumber: randomPlate });
      toast.success(`Simulated car "${randomPlate}" arriving — check the list below`);
      fetchSessions();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Simulation failed');
    } finally { setSimulating(false); }
  };

  const pending = sessions.filter(s => s.status === 'pending');
  const active = sessions.filter(s => ['active', 'pending-payment'].includes(s.status));
  const readyToExit = sessions.filter(s => ['paid', 'cash-paid'].includes(s.status));

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Header */}
      <div style={{ background: '#1e40af', color: '#fff', padding: '10px clamp(10px, 4vw, 16px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 22 }}>🅿️</span>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15 }}>ParkPay</div>
            <div style={{ fontSize: 11, color: '#93c5fd' }}>{attendant?.name}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: isOnline ? '#4ade80' : '#f87171', flexShrink: 0 }} />
          {offlineCount() > 0 && (
            <button onClick={handleSync} disabled={syncing || !isOnline} style={{ background: '#fbbf24', color: '#78350f', border: 'none', padding: '6px 10px', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
              {syncing ? 'Syncing...' : `Sync (${offlineCount()})`}
            </button>
          )}
          <button onClick={handleSimulateCar} disabled={simulating} style={{ background: '#7c3aed', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: simulating ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap' }}>
            {simulating ? '...' : '🚗 Simulate Car'}
          </button>
          <button onClick={() => navigate('/attendant/manual')} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>+ Manual</button>
          {attendant?.role === 'owner' && (
            <button onClick={() => navigate('/owner/dashboard')} style={{ background: '#1e3a8a', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: 8, fontSize: 11, cursor: 'pointer', whiteSpace: 'nowrap' }}>Owner View</button>
          )}
          <button onClick={logout} style={{ background: 'transparent', color: '#93c5fd', border: '1px solid #3b5fc0', padding: '6px 10px', borderRadius: 8, fontSize: 11, cursor: 'pointer', whiteSpace: 'nowrap' }}>Logout</button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, padding: '14px 14px 0' }}>
        {[
          { label: 'Waiting', count: pending.length, color: '#f59e0b', bg: '#fffbeb' },
          { label: 'Parked', count: active.length, color: '#3b82f6', bg: '#eff6ff' },
          { label: 'Ready Exit', count: readyToExit.length, color: '#10b981', bg: '#f0fdf4' },
        ].map(s => (
          <div key={s.label} style={{ background: s.bg, borderRadius: 12, padding: '12px 8px', textAlign: 'center', border: `1px solid ${s.color}33` }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.count}</div>
            <div style={{ fontSize: 11, color: s.color }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Sessions */}
      <div style={{ padding: 14 }}>
        <div style={{ fontWeight: 700, color: '#374151', marginBottom: 10, fontSize: 14 }}>Active Sessions</div>
        {loading && <div style={{ textAlign: 'center', padding: 32, color: '#94a3b8' }}>Loading...</div>}
        {!loading && sessions.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 0', color: '#94a3b8' }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>🅿️</div>
            <p>No active sessions — waiting for drivers</p>
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {sessions.map(s => (
            <div key={s.id} onClick={() => setSelected(selected?.id === s.id ? null : s)} style={{ background: '#fff', borderRadius: 14, padding: 16, cursor: 'pointer', border: selected?.id === s.id ? '2px solid #3b82f6' : '1px solid #e2e8f0', boxShadow: '0 1px 4px #0001' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: 2, color: '#1e40af', fontFamily: 'monospace' }}>{s.sessionToken}</span>
                <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 700, background: STATUS_COLORS[s.status] + '22', color: STATUS_COLORS[s.status] }}>{STATUS_LABELS[s.status]}</span>
              </div>
              <div style={{ display: 'flex', gap: 12, fontSize: 13, color: '#64748b' }}>
                <span>⏱ {s.duration || '—'}</span>
                {s.spotNumber && <span>📍 Spot {s.spotNumber}</span>}
                {s.plateNumber && <span>🚗 {s.plateNumber}</span>}
                {s.currentAmount > 0 && <span style={{ marginLeft: 'auto', fontWeight: 700, color: '#374151' }}>₦{s.currentAmount?.toLocaleString()}</span>}
              </div>

              {selected?.id === s.id && (
                <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid #e2e8f0' }} onClick={e => e.stopPropagation()}>
                  {s.status === 'pending' && (
                    <>
                      <input value={spotInput} onChange={e => setSpotInput(e.target.value)} placeholder="Spot number (optional, e.g. A12)" style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: 8, padding: '10px 12px', fontSize: 14, marginBottom: 10, boxSizing: 'border-box', outline: 'none' }} />
                      <button onClick={() => handleAction('allow', s.id)} disabled={actionLoading} style={{ width: '100%', background: '#1d4ed8', color: '#fff', border: 'none', padding: '13px', borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>✅ Allow Entry</button>
                    </>
                  )}
                  {['active', 'pending-payment'].includes(s.status) && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <button onClick={() => handleAction('cash', s.id)} disabled={actionLoading} style={{ background: '#0d9488', color: '#fff', border: 'none', padding: '12px', borderRadius: 10, fontWeight: 700, cursor: 'pointer' }}>💵 Cash Paid</button>
                      <button onClick={() => handleAction('waive', s.id)} disabled={actionLoading} style={{ background: '#f97316', color: '#fff', border: 'none', padding: '12px', borderRadius: 10, fontWeight: 700, cursor: 'pointer' }}>🆓 Waive Fee</button>
                    </div>
                  )}
                  {['paid', 'cash-paid'].includes(s.status) && (
                    <button onClick={() => handleAction('exit', s.id)} disabled={actionLoading} style={{ width: '100%', background: '#16a34a', color: '#fff', border: 'none', padding: '13px', borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>🚦 Confirm Exit & Close</button>
                  )}
                  {s.notes && <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 8, fontStyle: 'italic' }}>{s.notes}</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
