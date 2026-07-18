import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function ReceiptPage() {
  const { token } = useParams();
  const [searchParams] = useSearchParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const reference = searchParams.get('reference');
    const sessionToken = searchParams.get('token') || token;
    if (reference) verifyAndLoad(reference, sessionToken);
    else loadSession(sessionToken);
  }, []);

  useEffect(() => {
    if (!session?.exitWindowStart) return;
    const tick = setInterval(() => {
      const end = new Date(session.exitWindowStart).getTime() + 10 * 60 * 1000;
      const rem = end - Date.now();
      if (rem <= 0) { setTimeLeft('Expired'); clearInterval(tick); return; }
      const m = Math.floor(rem / 60000);
      const s = Math.floor((rem % 60000) / 1000);
      setTimeLeft(`${m}:${s.toString().padStart(2, '0')}`);
    }, 1000);
    return () => clearInterval(tick);
  }, [session?.exitWindowStart]);

  const verifyAndLoad = async (reference, sessionToken) => {
    try {
      await api.get(`/payments/verify?reference=${reference}&token=${sessionToken}`);
      await loadSession(sessionToken);
    } catch { toast.error('Payment verification failed'); setLoading(false); }
  };

  const loadSession = async (sessionToken) => {
    try {
      const res = await api.get(`/sessions/token/${sessionToken}`);
      setSession(res.data.session);
    } catch { toast.error('Session not found'); }
    finally { setLoading(false); }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 40, height: 40, border: '4px solid #16a34a', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
    </div>
  );

  const isPaid = ['paid', 'cash-paid', 'waived', 'completed'].includes(session?.status);

  return (
    <div style={{ minHeight: '100vh', background: isPaid ? '#f0fdf4' : '#fff7ed', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 16, fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ width: '100%', maxWidth: 420, background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 24px #0002' }}>
        {/* Header */}
        <div style={{ background: isPaid ? '#16a34a' : '#f97316', padding: '32px 24px', textAlign: 'center', color: '#fff' }}>
          <div style={{ fontSize: 56, marginBottom: 8 }}>{isPaid ? '✅' : '⚠️'}</div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>{isPaid ? 'Payment Successful!' : 'Payment Pending'}</h1>
          <p style={{ margin: '8px 0 0', opacity: 0.85, fontSize: 14 }}>{isPaid ? 'Drive to the exit now' : 'Contact the attendant'}</p>
        </div>

        <div style={{ padding: '24px 20px' }}>
          {/* Exit countdown */}
          {session?.exitWindowStart && timeLeft && timeLeft !== 'Expired' && (
            <div style={{ background: '#fff7ed', border: '2px solid #fb923c', borderRadius: 14, padding: 16, textAlign: 'center', marginBottom: 16 }}>
              <p style={{ margin: '0 0 4px', fontSize: 13, fontWeight: 700, color: '#ea580c' }}>⏰ Time left to exit</p>
              <p style={{ margin: 0, fontSize: 40, fontWeight: 900, color: '#dc2626', fontFamily: 'monospace' }}>{timeLeft}</p>
              <p style={{ margin: '4px 0 0', fontSize: 12, color: '#9a3412' }}>Drive to the exit gate now!</p>
            </div>
          )}
          {timeLeft === 'Expired' && (
            <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 12, padding: 14, textAlign: 'center', marginBottom: 16 }}>
              <p style={{ margin: 0, fontWeight: 700, color: '#dc2626' }}>⛔ Exit window expired</p>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>Please contact the attendant</p>
            </div>
          )}

          {/* Receipt details */}
          <div style={{ background: '#f8fafc', borderRadius: 12, padding: 16, marginBottom: 16 }}>
            {[
              { label: 'Session Code', value: session?.sessionToken, mono: true, highlight: '#1d4ed8' },
              { label: 'Location', value: session?.lotName },
              session?.spotNumber && { label: 'Spot', value: `Spot ${session.spotNumber}` },
              { label: 'Time Parked', value: session?.duration },
              { label: 'Payment Method', value: session?.paymentMethod },
            ].filter(Boolean).map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: 13, color: '#64748b' }}>{item.label}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: item.highlight || '#1e293b', fontFamily: item.mono ? 'monospace' : 'inherit', letterSpacing: item.mono ? 2 : 0, textTransform: 'capitalize' }}>{item.value}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0 0' }}>
              <span style={{ fontSize: 15, fontWeight: 700 }}>Amount Paid</span>
              <span style={{ fontSize: 20, fontWeight: 900, color: session?.amountPaid === 0 ? '#16a34a' : '#1d4ed8' }}>
                {session?.amountPaid === 0 ? 'FREE' : `₦${(session?.amountPaid || 0).toLocaleString()}`}
              </span>
            </div>
          </div>

          <div style={{ background: '#eff6ff', borderRadius: 12, padding: 14, textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#1e40af' }}>Show this screen to the attendant at the exit gate</p>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
