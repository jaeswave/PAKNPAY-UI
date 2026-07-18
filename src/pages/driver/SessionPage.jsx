import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function SessionPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [elapsed, setElapsed] = useState('');

  useEffect(() => {
    fetchSession();
    const interval = setInterval(fetchSession, 20000);
    return () => clearInterval(interval);
  }, [token]);

  useEffect(() => {
    if (!session?.entryTime || !['active', 'pending-payment'].includes(session?.status)) return;
    const tick = setInterval(() => {
      const diff = Date.now() - new Date(session.entryTime).getTime();
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setElapsed(h > 0 ? `${h}h ${m}m ${s}s` : `${m}m ${s}s`);
    }, 1000);
    return () => clearInterval(tick);
  }, [session?.entryTime, session?.status]);

  const fetchSession = async () => {
    try {
      const res = await api.get(`/sessions/token/${token}`);
      setSession(res.data.session);
      if (['paid', 'cash-paid', 'completed', 'waived'].includes(res.data.session.status)) {
        navigate(`/receipt/${token}`);
      }
    } catch { toast.error('Session not found'); }
    finally { setLoading(false); }
  };

  const handlePay = async () => {
    setPaying(true);
    try {
      await api.post(`/sessions/token/${token}/pay`);
      const res = await api.post('/payments/initialize', { sessionToken: token, email: `park_${token}@parkpay.ng` });
      if (res.data.free) { toast.success('Free exit — within grace period!'); navigate(`/receipt/${token}`); return; }
      window.location.href = res.data.authorizationUrl;
    } catch (err) { toast.error(err.response?.data?.message || 'Payment failed'); }
    finally { setPaying(false); }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 40, height: 40, border: '4px solid #2563eb', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
    </div>
  );

  if (!session) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48 }}>⚠️</div>
        <h2>Session not found</h2>
        <p style={{ color: '#64748b' }}>Check your session code and try again</p>
      </div>
    </div>
  );

  const isPending = session.status === 'pending';
  const isActive = session.status === 'active';

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 16, fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Session Code */}
        <div style={{ background: '#fff', borderRadius: 16, padding: '20px 24px', marginBottom: 12, textAlign: 'center', boxShadow: '0 1px 8px #0001' }}>
          <p style={{ margin: '0 0 4px', fontSize: 12, color: '#94a3b8' }}>Your Session Code</p>
          <h1 style={{ margin: 0, fontSize: 36, fontWeight: 900, letterSpacing: 4, color: '#1d4ed8', fontFamily: 'monospace' }}>{token}</h1>
          <p style={{ margin: '6px 0 0', fontSize: 11, color: '#94a3b8' }}>Show this to the attendant if needed</p>
        </div>

        {/* Status */}
        <div style={{ background: '#fff', borderRadius: 16, padding: 20, marginBottom: 12, boxShadow: '0 1px 8px #0001' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: isPending ? '#fbbf24' : '#22c55e', animation: 'pulse 2s infinite' }} />
            <span style={{ fontWeight: 700, color: isPending ? '#92400e' : '#15803d', fontSize: 15 }}>
              {isPending ? 'Waiting for attendant to allow entry...' : 'You are parked — timer running'}
            </span>
          </div>

          {isPending && (
            <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: 14, fontSize: 13, color: '#92400e' }}>
              The attendant will see your request and open the gate. Please wait at the entrance.
            </div>
          )}

          {isActive && (
            <>
              <p style={{ margin: '0 0 14px', fontSize: 13, color: '#64748b' }}>📍 {session.lotName} {session.spotNumber && `· Spot ${session.spotNumber}`}</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
                <div style={{ background: '#f8fafc', borderRadius: 12, padding: 16, textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>Time Parked</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#1e293b', fontFamily: 'monospace' }}>{elapsed || session.duration}</div>
                </div>
                <div style={{ background: '#eff6ff', borderRadius: 12, padding: 16, textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>Amount Due</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#1d4ed8' }}>₦{(session.currentAmount || 0).toLocaleString()}</div>
                </div>
              </div>
              <button onClick={handlePay} disabled={paying} style={{ width: '100%', background: paying ? '#86efac' : '#16a34a', color: '#fff', border: 'none', padding: '16px', borderRadius: 12, fontSize: 17, fontWeight: 800, cursor: paying ? 'not-allowed' : 'pointer' }}>
                {paying ? 'Processing...' : '💳 Pay Now & Exit'}
              </button>
              <p style={{ textAlign: 'center', fontSize: 11, color: '#94a3b8', marginTop: 10 }}>After payment you have 10 minutes to exit</p>
            </>
          )}
        </div>

        {/* Rate Info */}
        <div style={{ background: '#fff', borderRadius: 12, padding: '12px 16px', textAlign: 'center', fontSize: 13, color: '#64748b', boxShadow: '0 1px 4px #0001' }}>
          ₦{session.ratePerHour}/hr · Min ₦{session.minimumCharge || 200} · First {session.gracePeriodMinutes || 10}min free
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } } @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }`}</style>
    </div>
  );
}
