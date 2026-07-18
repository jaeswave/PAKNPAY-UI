import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import adminApi from '../../utils/adminApi';
import toast from 'react-hot-toast';

export default function AdminCommissionsPage() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [records, setRecords] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem('parkpay_admin_token')) {
      navigate('/admin/login');
      return;
    }
    fetchAll();
  }, [page]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [summaryRes, ledgerRes] = await Promise.all([
        adminApi.get('/payments/commissions/summary'),
        adminApi.get(`/payments/commissions?page=${page}&limit=20`),
      ]);
      setSummary(summaryRes.data);
      setRecords(ledgerRes.data.records || []);
      setTotalPages(ledgerRes.data.totalPages || 1);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        toast.error('Session expired — please log in again');
        localStorage.removeItem('parkpay_admin_token');
        navigate('/admin/login');
      } else {
        toast.error('Failed to load commission data');
      }
    } finally { setLoading(false); }
  };

  const logout = () => {
    localStorage.removeItem('parkpay_admin_token');
    navigate('/admin/login');
  };

  const statCard = (label, value, count, color, bg) => (
    <div style={{ background: bg, border: `1px solid ${color}22`, borderRadius: 14, padding: '18px 16px' }}>
      <div style={{ fontSize: 12, color: '#64748b', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 800, color }}>₦{(value || 0).toLocaleString()}</div>
      {count !== undefined && <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>{count} transaction{count === 1 ? '' : 's'}</div>}
    </div>
  );

  if (loading && !summary) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
        <p style={{ color: '#64748b' }}>Loading commission data...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ background: '#0a2540', color: '#fff', padding: '0 clamp(12px, 4vw, 24px)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, padding: '16px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 22 }}>🛡️</span>
            <div style={{ fontWeight: 800, fontSize: 16 }}>Platform Commission Dashboard</div>
          </div>
          <button onClick={logout} style={{ background: 'transparent', color: '#8ab4f8', border: '1px solid #1e3a5f', padding: '8px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 12 }}>Logout</button>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: 'clamp(16px, 4vw, 24px)' }}>
        {/* Running totals */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 24 }}>
          {statCard('All-Time Total', summary?.allTimeTotal, summary?.allTimeCount, '#0a2540', '#eef2ff')}
          {statCard("Today", summary?.today?.total, summary?.today?.count, '#16a34a', '#f0fdf4')}
          {statCard('This Week', summary?.thisWeek?.total, summary?.thisWeek?.count, '#3b82f6', '#eff6ff')}
          {statCard('This Month', summary?.thisMonth?.total, summary?.thisMonth?.count, '#8b5cf6', '#f5f3ff')}
        </div>

        {/* Ledger table */}
        <div style={{ background: '#fff', borderRadius: 14, padding: 20, boxShadow: '0 1px 8px #0001' }}>
          <div style={{ fontWeight: 700, marginBottom: 16, fontSize: 15 }}>Commission Ledger</div>
          {records.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8' }}>No commission records yet</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                    {['Date', 'Lot', 'Session', 'Amount Charged', 'Fee %', 'Commission', 'Owner Payout', 'Reference'].map(h => (
                      <th key={h} style={{ padding: '10px 12px', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: 11, whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {records.map(r => (
                    <tr key={r._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '10px 12px', color: '#64748b', whiteSpace: 'nowrap' }}>{new Date(r.createdAt).toLocaleString('en-NG', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</td>
                      <td style={{ padding: '10px 12px' }}>{r.lotName}</td>
                      <td style={{ padding: '10px 12px', fontFamily: 'monospace', color: '#1e40af' }}>{r.sessionToken}</td>
                      <td style={{ padding: '10px 12px' }}>₦{r.amountCharged.toLocaleString()}</td>
                      <td style={{ padding: '10px 12px' }}>{r.commissionPercentage}%</td>
                      <td style={{ padding: '10px 12px', fontWeight: 700, color: '#16a34a' }}>₦{r.commissionAmount.toLocaleString()}</td>
                      <td style={{ padding: '10px 12px', color: '#64748b' }}>₦{r.ownerPayout.toLocaleString()}</td>
                      <td style={{ padding: '10px 12px', fontFamily: 'monospace', fontSize: 11, color: '#94a3b8' }}>{r.reference}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 20 }}>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: page === 1 ? 'not-allowed' : 'pointer', fontSize: 13 }}>← Prev</button>
              <span style={{ fontSize: 13, color: '#64748b', alignSelf: 'center' }}>Page {page} of {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: page === totalPages ? 'not-allowed' : 'pointer', fontSize: 13 }}>Next →</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
