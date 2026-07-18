import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(phone, pin);
      toast.success('Welcome back!');
      if (data.attendant.role === 'owner') {
        navigate('/owner/dashboard');
      } else {
        navigate('/attendant/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ width: '100%', maxWidth: 380, background: '#fff', borderRadius: 20, padding: 32, boxShadow: '0 8px 40px #0003' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🅿️</div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>ParkPay</h1>
          <p style={{ color: '#6b7280', fontSize: 14, margin: '8px 0 0' }}>Attendant / Owner Login</p>
        </div>
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Phone Number</label>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="08012345678" required style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: 10, padding: '12px 16px', fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>PIN</label>
            <input type="password" value={pin} onChange={e => setPin(e.target.value)} placeholder="••••" maxLength={4} required style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: 10, padding: '12px 16px', fontSize: 24, textAlign: 'center', letterSpacing: 8, outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <button type="submit" disabled={loading} style={{ width: '100%', background: '#1d4ed8', color: '#fff', border: 'none', padding: '14px', borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#6b7280' }}>
          New parking lot? <Link to="/attendant/signup" style={{ color: '#1d4ed8', fontWeight: 600 }}>Register here</Link>
        </p>
      </div>
    </div>
  );
}
