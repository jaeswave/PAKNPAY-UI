import { useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import toast from 'react-hot-toast';

// This page stands in for Paystack's real checkout page when the backend
// has no PAYSTACK_SECRET_KEY configured (test mode). It lets you test the
// entire payment flow — pay, verify, exit countdown — without a Paystack
// account, test keys, or an internet connection to Paystack's API.
//
// In production, once a real PAYSTACK_SECRET_KEY is set, initializePayment
// never hands out a /pay/simulate URL, so this page is simply unreachable —
// nothing to remove or guard on the frontend when you go live.
export default function SimulatedCheckoutPage() {
  const { token } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const reference = searchParams.get('reference');
  const amount = Number(searchParams.get('amount') || 0);

  const handleOutcome = async (outcome) => {
    setLoading(true);
    try {
      await api.post(`/payments/simulate/${reference}`, { outcome });
      if (outcome === 'success') {
        toast.success('Simulated payment successful');
        navigate(`/pay/verify?token=${token}&reference=${reference}`);
      } else {
        toast.error('Simulated payment failed');
        navigate(`/session/${token}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Simulation failed');
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ width: '100%', maxWidth: 400, background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 8px 40px #0004' }}>
        <div style={{ background: '#0a2540', padding: '20px 24px', textAlign: 'center', color: '#fff' }}>
          <div style={{ fontSize: 12, letterSpacing: 2, color: '#8ab4f8', marginBottom: 6 }}>TEST MODE — NOT A REAL PAYMENT</div>
          <div style={{ fontSize: 20, fontWeight: 800 }}>Simulated Checkout</div>
        </div>

        <div style={{ padding: 24 }}>
          <div style={{ background: '#f8fafc', borderRadius: 12, padding: 18, textAlign: 'center', marginBottom: 20 }}>
            <div style={{ fontSize: 12, color: '#64748b', marginBottom: 6 }}>Amount to pay</div>
            <div style={{ fontSize: 36, fontWeight: 900, color: '#1e293b' }}>₦{amount.toLocaleString()}</div>
            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 8, fontFamily: 'monospace' }}>Ref: {reference}</div>
          </div>

          <p style={{ fontSize: 13, color: '#64748b', textAlign: 'center', marginBottom: 20 }}>
            No Paystack key is configured on this server, so real payment can't happen. Pick an outcome below to simulate what would happen in production.
          </p>

          <button
            onClick={() => handleOutcome('success')}
            disabled={loading}
            style={{ width: '100%', background: loading ? '#86efac' : '#16a34a', color: '#fff', border: 'none', padding: '16px', borderRadius: 12, fontSize: 16, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', marginBottom: 10 }}
          >
            ✅ Simulate Successful Payment
          </button>
          <button
            onClick={() => handleOutcome('failed')}
            disabled={loading}
            style={{ width: '100%', background: 'transparent', color: '#dc2626', border: '2px solid #fca5a5', padding: '14px', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            ❌ Simulate Failed Payment
          </button>
        </div>
      </div>
    </div>
  );
}
