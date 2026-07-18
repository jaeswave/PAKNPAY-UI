import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import adminApi from '../../utils/adminApi';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [secret, setSecret] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await adminApi.post('/admin/login', { secret });
      localStorage.setItem('parkpay_admin_token', res.data.token);
      toast.success('Welcome, admin');
      navigate('/admin/commissions');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ width: '100%', maxWidth: 380, background: '#fff', borderRadius: 20, padding: 32, boxShadow: '0 8px 40px #0003' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🛡️</div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>Platform Admin</h1>
          <p style={{ color: '#6b7280', fontSize: 13, margin: '8px 0 0' }}>Commission dashboard — restricted access</p>
        </div>
        <form onSubmit={handleLogin}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Admin Secret</label>
          <input
            type="password"
            value={secret}
            onChange={e => setSecret(e.target.value)}
            placeholder="Enter admin secret"
            required
            style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: 10, padding: '12px 16px', fontSize: 15, outline: 'none', boxSizing: 'border-box', marginBottom: 20 }}
          />
          <button type="submit" disabled={loading} style={{ width: '100%', background: '#0a2540', color: '#fff', border: 'none', padding: '14px', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Checking...' : 'Enter Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}
