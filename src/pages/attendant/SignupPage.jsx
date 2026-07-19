import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function SignupPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState({ name: '', phone: '', pin: '', confirmPin: '' });
  const [lot, setLot] = useState({ name: '', address: '', totalSpots: '', ratePerHour: '', minimumCharge: '200', gracePeriodMinutes: '10', shortCode: '' });
  const [driverUrl, setDriverUrl] = useState('');

  const s = { width: '100%', border: '1px solid #d1d5db', borderRadius: 10, padding: '12px 16px', fontSize: 15, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' };

  const handleStep0 = (e) => {
    e.preventDefault();
    if (account.pin !== account.confirmPin) return toast.error('PINs do not match');
    if (account.pin.length !== 4) return toast.error('PIN must be 4 digits');
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Single call — the backend creates the lot and the owner attendant
      // together, in the right order, so there's never a temporary/fake
      // lotId involved.
      const res = await api.post('/attendants/signup', {
        name: account.name,
        phone: account.phone,
        pin: account.pin,
        lot: {
          name: lot.name,
          address: lot.address,
          totalSpots: lot.totalSpots,
          ratePerHour: lot.ratePerHour,
          minimumCharge: lot.minimumCharge,
          gracePeriodMinutes: lot.gracePeriodMinutes,
          shortCode: lot.shortCode.toUpperCase().replace(/\s/g, ''),
        },
      });

      console.log("hello world",res)

      localStorage.setItem('parkpay_token', res.data.token);
      localStorage.setItem('parkpay_attendant', JSON.stringify(res.data.attendant));
      setDriverUrl(`${window.location.origin}/park/${res.data.lot.shortCode}`);
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4ff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ width: '100%', maxWidth: 480, background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 32px #0002' }}>
        <div style={{ background: '#1d4ed8', padding: 'clamp(20px, 6vw, 28px) clamp(16px, 6vw, 32px)', color: '#fff', textAlign: 'center' }}>
          <div style={{ fontSize: 32 }}>🅿️</div>
          <h1 style={{ margin: '8px 0 4px', fontSize: 22, fontWeight: 800 }}>ParkPay</h1>
          <p style={{ margin: 0, color: '#bfdbfe', fontSize: 13 }}>Set up your parking lot in 2 minutes</p>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: 20, flexWrap: 'wrap' }}>
            {['Account', 'Parking Lot', 'Done'].map((label, i) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 26, height: 26, borderRadius: '50%', background: i <= step ? '#fff' : '#3b5fc0', color: i <= step ? '#1d4ed8' : '#bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, flexShrink: 0 }}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span style={{ fontSize: 12, color: i <= step ? '#fff' : '#93c5fd' }}>{label}</span>
                {i < 2 && <div style={{ width: 16, height: 1, background: '#3b5fc0' }} />}
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding: 'clamp(18px, 5vw, 28px)' }}>
          {step === 0 && (
            <form onSubmit={handleStep0}>
              <h2 style={{ margin: '0 0 20px', fontSize: 18, fontWeight: 700 }}>Create your account</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div><label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Full Name</label><input style={s} placeholder="John Adeyemi" value={account.name} onChange={e => setAccount({ ...account, name: e.target.value })} required /></div>
                <div><label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Phone Number</label><input style={s} type="tel" placeholder="08012345678" value={account.phone} onChange={e => setAccount({ ...account, phone: e.target.value })} required /></div>
                <div><label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5 }}>4-Digit PIN</label><input style={{ ...s, textAlign: 'center', letterSpacing: 8, fontSize: 20 }} type="password" placeholder="••••" maxLength={4} value={account.pin} onChange={e => setAccount({ ...account, pin: e.target.value })} required /><p style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>Used to log in every day</p></div>
                <div><label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Confirm PIN</label><input style={{ ...s, textAlign: 'center', letterSpacing: 8, fontSize: 20 }} type="password" placeholder="••••" maxLength={4} value={account.confirmPin} onChange={e => setAccount({ ...account, confirmPin: e.target.value })} required /></div>
              </div>
              <button type="submit" style={{ width: '100%', marginTop: 20, background: '#1d4ed8', color: '#fff', border: 'none', padding: '14px', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>Next: Parking Lot →</button>
            </form>
          )}
          {step === 1 && (
            <form onSubmit={handleSubmit}>
              <h2 style={{ margin: '0 0 20px', fontSize: 18, fontWeight: 700 }}>Your parking lot</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div><label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Lot Name</label><input style={s} placeholder="Ikeja City Mall Parking" value={lot.name} onChange={e => setLot({ ...lot, name: e.target.value })} required /></div>
                <div><label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Address</label><input style={s} placeholder="12 Obafemi Awolowo Way, Ikeja" value={lot.address} onChange={e => setLot({ ...lot, address: e.target.value })} required /></div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12 }}>
                  <div><label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Total Spots</label><input style={s} type="number" placeholder="50" value={lot.totalSpots} onChange={e => setLot({ ...lot, totalSpots: e.target.value })} required /></div>
                  <div><label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Rate/Hour (₦)</label><input style={s} type="number" placeholder="300" value={lot.ratePerHour} onChange={e => setLot({ ...lot, ratePerHour: e.target.value })} required /></div>
                  <div><label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Min Charge (₦)</label><input style={s} type="number" placeholder="200" value={lot.minimumCharge} onChange={e => setLot({ ...lot, minimumCharge: e.target.value })} /></div>
                  <div><label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Free Minutes</label><input style={s} type="number" placeholder="10" value={lot.gracePeriodMinutes} onChange={e => setLot({ ...lot, gracePeriodMinutes: e.target.value })} /></div>
                </div>
                <div><label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Short Code</label><input style={{ ...s, textTransform: 'uppercase', letterSpacing: 2 }} placeholder="IKEJA01" value={lot.shortCode} onChange={e => setLot({ ...lot, shortCode: e.target.value.toUpperCase() })} required /><p style={{ fontSize: 11, color: '#9ca3af', marginTop: 4, wordBreak: 'break-all' }}>Driver URL: {window.location.origin}/park/{lot.shortCode || 'YOURCODE'}</p></div>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                <button type="button" onClick={() => setStep(0)} style={{ flex: 1, background: '#f3f4f6', color: '#374151', border: 'none', padding: '13px', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>← Back</button>
                <button type="submit" disabled={loading} style={{ flex: 2, background: '#1d4ed8', color: '#fff', border: 'none', padding: '13px', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>{loading ? 'Setting up...' : '🚀 Create My Parking Lot'}</button>
              </div>
            </form>
          )}
          {step === 2 && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 56, marginBottom: 12 }}>🎉</div>
              <h2 style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 800, color: '#16a34a' }}>You're all set!</h2>
              <p style={{ color: '#6b7280', marginBottom: 24 }}>Your parking lot is live. Share this URL with drivers.</p>
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, padding: 16, marginBottom: 16, textAlign: 'left' }}>
                <p style={{ margin: '0 0 6px', fontSize: 12, fontWeight: 700, color: '#15803d' }}>Driver Parking URL</p>
                <p style={{ margin: '0 0 10px', fontFamily: 'monospace', fontSize: 13, wordBreak: 'break-all', color: '#166534' }}>{driverUrl}</p>
                <button onClick={() => { navigator.clipboard.writeText(driverUrl); toast.success('Copied!'); }} style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: 8, fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>Copy Link</button>
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button onClick={() => navigate('/attendant/dashboard')} style={{ flex: '1 1 140px', background: '#f1f5f9', color: '#1d4ed8', border: '1px solid #bfdbfe', padding: '13px', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Attendant View</button>
                <button onClick={() => navigate('/owner/dashboard')} style={{ flex: '1 1 140px', background: '#1d4ed8', color: '#fff', border: 'none', padding: '13px', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Owner Dashboard →</button>
              </div>
            </div>
          )}
          {step < 2 && (
            <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: '#6b7280' }}>
              Already have an account? <Link to="/attendant/login" style={{ color: '#1d4ed8', fontWeight: 600 }}>Log in</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
