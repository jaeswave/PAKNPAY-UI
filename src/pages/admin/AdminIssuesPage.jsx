import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import adminApi from '../../utils/adminApi';
import toast from 'react-hot-toast';

const CATEGORY_LABELS = { barrier: '🚧 Barrier', payment: '💳 Payment', app_bug: '🐞 App Bug', session: '🚗 Session', other: '❓ Other' };

export default function AdminIssuesPage() {
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);
  const [filter, setFilter] = useState('open');
  const [lotNameFilter, setLotNameFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [resolutionNote, setResolutionNote] = useState('');
  const [resolving, setResolving] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('parkpay_admin_token')) { navigate('/admin/login'); return; }
    fetchIssues();
  }, [filter]);

  useEffect(() => {
    const timer = setTimeout(fetchIssues, 400);
    return () => clearTimeout(timer);
  }, [lotNameFilter]);

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const lotNameQuery = lotNameFilter.trim() ? `&lotName=${encodeURIComponent(lotNameFilter.trim())}` : '';
      const res = await adminApi.get(`/issues?status=${filter}${lotNameQuery}`);
      setIssues(res.data.issues || []);
    } catch { toast.error('Failed to load issues'); }
    finally { setLoading(false); }
  };

  const handleResolve = async (id) => {
    setResolving(true);
    try {
      await adminApi.patch(`/issues/${id}/resolve`, { resolutionNote });
      toast.success('Marked resolved');
      setSelected(null);
      setResolutionNote('');
      fetchIssues();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setResolving(false); }
  };

  const logout = () => { localStorage.removeItem('parkpay_admin_token'); navigate('/admin/login'); };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ background: '#0a2540', color: '#fff', padding: '0 clamp(12px, 4vw, 24px)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, padding: '16px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 22 }}>🚩</span>
            <div style={{ fontWeight: 800, fontSize: 16 }}>Reported Issues</div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button onClick={() => navigate('/admin/commissions')} style={{ background: 'transparent', color: '#8ab4f8', border: '1px solid #1e3a5f', padding: '8px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 12 }}>Commissions</button>
            <button onClick={() => navigate('/admin/lots')} style={{ background: 'transparent', color: '#8ab4f8', border: '1px solid #1e3a5f', padding: '8px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 12 }}>Lot Approvals</button>
            <button onClick={logout} style={{ background: 'transparent', color: '#8ab4f8', border: '1px solid #1e3a5f', padding: '8px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 12 }}>Logout</button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: 'clamp(16px, 4vw, 24px)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {['open', 'resolved'].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{ padding: '8px 16px', borderRadius: 20, border: filter === f ? 'none' : '1px solid #e2e8f0', background: filter === f ? '#0a2540' : '#fff', color: filter === f ? '#fff' : '#64748b', fontSize: 12, fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize' }}>
                {f}
              </button>
            ))}
          </div>
          <input
            value={lotNameFilter}
            onChange={e => setLotNameFilter(e.target.value)}
            placeholder="Filter by lot name..."
            style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: '8px 12px', fontSize: 13, outline: 'none', width: 220 }}
          />
        </div>

        <div style={{ background: '#fff', borderRadius: 14, padding: 20, boxShadow: '0 1px 8px #0001' }}>
          {loading ? (
            <p style={{ textAlign: 'center', color: '#94a3b8', padding: 40 }}>Loading...</p>
          ) : issues.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#94a3b8', padding: 40 }}>No {filter} issues</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {issues.map(issue => (
                <div key={issue._id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: '14px 16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ background: '#dbeafe', color: '#1e40af', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>{CATEGORY_LABELS[issue.category] || issue.category}</span>
                        <span style={{ fontWeight: 700, fontSize: 13 }}>{issue.lotName}</span>
                      </div>
                      <p style={{ fontSize: 14, color: '#374151', margin: '6px 0' }}>{issue.message}</p>
                      <div style={{ fontSize: 11, color: '#94a3b8' }}>
                        Reported by {issue.reportedByName} · {new Date(issue.createdAt).toLocaleString('en-NG', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </div>
                      {issue.resolutionNote && (
                        <div style={{ fontSize: 12, color: '#16a34a', marginTop: 6 }}>✔ Resolved: {issue.resolutionNote}</div>
                      )}
                    </div>
                    {issue.status === 'open' && (
                      <button onClick={() => setSelected(selected === issue._id ? null : issue._id)} style={{ background: '#0a2540', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: 8, fontSize: 12, cursor: 'pointer', fontWeight: 600, whiteSpace: 'nowrap' }}>
                        Resolve
                      </button>
                    )}
                  </div>

                  {selected === issue._id && (
                    <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px dashed #e2e8f0' }}>
                      <textarea
                        value={resolutionNote}
                        onChange={e => setResolutionNote(e.target.value)}
                        placeholder="Optional note on how this was resolved"
                        rows={2}
                        style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: 8, padding: 10, fontSize: 13, outline: 'none', boxSizing: 'border-box', marginBottom: 10, fontFamily: 'inherit' }}
                      />
                      <button onClick={() => handleResolve(issue._id)} disabled={resolving} style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>
                        {resolving ? 'Saving...' : '✔ Mark Resolved'}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}