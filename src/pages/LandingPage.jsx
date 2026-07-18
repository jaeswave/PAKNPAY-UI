import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: '#0a0f1e', color: '#fff', minHeight: '100vh' }}>

      {/* Nav */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, padding: 'clamp(14px, 4vw, 20px) clamp(16px, 5vw, 40px)', borderBottom: '1px solid #1e2d4a' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 28 }}>🅿️</span>
          <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px' }}>ParkPay</span>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/attendant/login')}
            style={{ background: 'transparent', border: '1px solid #334', color: '#aab', padding: '10px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13, whiteSpace: 'nowrap' }}
          >
            Attendant Login
          </button>
          <button
            onClick={() => navigate('/attendant/login')}
            style={{ background: '#2563eb', border: 'none', color: '#fff', padding: '10px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}
          >
            Get Started →
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ textAlign: 'center', padding: '100px 20px 60px' }}>
        <div style={{ display: 'inline-block', background: '#1e2d4a', border: '1px solid #2563eb33', borderRadius: 40, padding: '6px 18px', fontSize: 13, color: '#60a5fa', marginBottom: 24 }}>
          Built for Nigerian Parking Lots
        </div>
        <h1 style={{ fontSize: 'clamp(36px, 6vw, 68px)', fontWeight: 900, lineHeight: 1.1, maxWidth: 800, margin: '0 auto 24px', letterSpacing: '-1.5px' }}>
          Park. Pay from your phone.{' '}
          <span style={{ color: '#2563eb' }}>No booth. No queue.</span>
        </h1>
        <p style={{ fontSize: 18, color: '#7a8ba8', maxWidth: 540, margin: '0 auto 40px', lineHeight: 1.6 }}>
          Drivers scan a QR code, pay online, and exit in minutes. Parking lot owners get real-time revenue tracking and zero cash leakage.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/attendant/login')}
            style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '16px 36px', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: 'pointer' }}
          >
            Start Free Trial →
          </button>
          <button
            onClick={() => document.getElementById('how').scrollIntoView({ behavior: 'smooth' })}
            style={{ background: '#1e2d4a', color: '#aab', border: '1px solid #334', padding: '16px 36px', borderRadius: 12, fontSize: 16, cursor: 'pointer' }}
          >
            See How It Works
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 48, marginTop: 80, flexWrap: 'wrap' }}>
          {[
            { number: '< 60s', label: 'To pay and exit' },
            { number: '0%', label: 'Cash leakage' },
            { number: '3', label: 'Ways to pay (no phone needed)' },
            { number: '100%', label: 'Revenue visibility' },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 36, fontWeight: 900, color: '#2563eb' }}>{stat.number}</div>
              <div style={{ fontSize: 13, color: '#556', marginTop: 4 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Problem */}
      <section style={{ background: '#060a14', padding: '80px 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 16 }}>The problem with parking in Nigeria today</h2>
        <p style={{ color: '#7a8ba8', maxWidth: 600, margin: '0 auto 60px', fontSize: 16, lineHeight: 1.6 }}>
          Every parking lot runs the same broken system — cash, paper tickets, and staff who pocket revenue.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap', maxWidth: 900, margin: '0 auto' }}>
          {[
            { icon: '🚶', title: 'Walk to the booth', desc: 'Driver leaves their car, walks to pay, walks back. 5–15 minutes wasted every time.' },
            { icon: '💸', title: 'Cash goes missing', desc: 'Owners have no visibility. Attendants collect cash and pocket a percentage. No record.' },
            { icon: '📋', title: 'Paper tickets get lost', desc: 'No digital record of who parked, for how long, or what was collected.' },
          ].map((item) => (
            <div key={item.title} style={{ background: '#0d1525', border: '1px solid #1e2d4a', borderRadius: 16, padding: 32, maxWidth: 260, textAlign: 'left' }}>
              <div style={{ fontSize: 36, marginBottom: 16 }}>{item.icon}</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{item.title}</h3>
              <p style={{ color: '#7a8ba8', fontSize: 14, lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how" style={{ padding: '80px 20px', maxWidth: 860, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12 }}>How ParkPay works</h2>
          <p style={{ color: '#7a8ba8', fontSize: 16 }}>Four steps. No app download needed.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {[
            { step: '01', icon: '📱', title: 'Scan the QR code at the gate', desc: 'A permanent sign at the entrance has a QR code. Driver scans it — their phone opens ParkPay instantly in the browser. No app needed. No download.' },
            { step: '02', icon: '✅', title: 'Attendant allows entry', desc: 'The attendant sees the request on their tablet dashboard and taps "Allow Entry". The timer starts. Driver parks.' },
            { step: '03', icon: '💳', title: 'Driver pays when ready to leave', desc: 'When leaving, driver opens their session link and taps "Pay Now". They pay with card, bank transfer, or USSD — all supported. Payment is confirmed in seconds.' },
            { step: '04', icon: '🚦', title: 'Attendant confirms and opens gate', desc: 'Attendant sees "PAID" on their dashboard next to the session. They confirm exit and open the gate. Session closes automatically.' },
          ].map((item) => (
            <div key={item.step} style={{ display: 'flex', gap: 24, background: '#0d1525', border: '1px solid #1e2d4a', borderRadius: 16, padding: 28, alignItems: 'flex-start' }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#2563eb', minWidth: 32, paddingTop: 4 }}>{item.step}</div>
              <div style={{ fontSize: 36, minWidth: 48 }}>{item.icon}</div>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{item.title}</h3>
                <p style={{ color: '#7a8ba8', fontSize: 15, lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* No Phone Fallbacks */}
      <section style={{ background: '#060a14', padding: '80px 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>Works for everyone — even without a smartphone</h2>
        <p style={{ color: '#7a8ba8', maxWidth: 560, margin: '0 auto 52px', fontSize: 16, lineHeight: 1.6 }}>
          We designed for Nigeria's reality. Not everyone has a working camera or a smartphone.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap', maxWidth: 900, margin: '0 auto' }}>
          {[
            { icon: '📷', label: 'Can scan QR', method: 'Scan → pay online', color: '#16a34a' },
            { icon: '🌐', label: 'No QR scanner', method: 'Type the short URL manually', color: '#2563eb' },
            { icon: '📟', label: 'Feature phone', method: 'Attendant sends SMS payment link', color: '#7c3aed' },
            { icon: '👴', label: 'No phone at all', method: 'Attendant logs manually, pay cash', color: '#d97706' },
          ].map((item) => (
            <div key={item.label} style={{ background: '#0d1525', border: `1px solid ${item.color}33`, borderRadius: 14, padding: '28px 24px', width: 180, textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>{item.icon}</div>
              <div style={{ fontSize: 13, color: '#556', marginBottom: 10 }}>{item.label}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: item.color }}>{item.method}</div>
            </div>
          ))}
        </div>
      </section>

      {/* For Operators */}
      <section style={{ padding: '80px 20px', maxWidth: 860, margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: 280 }}>
            <div style={{ fontSize: 13, color: '#2563eb', fontWeight: 700, marginBottom: 12, letterSpacing: 1 }}>FOR PARKING LOT OWNERS</div>
            <h2 style={{ fontSize: 32, fontWeight: 800, lineHeight: 1.2, marginBottom: 20 }}>See every naira. In real time.</h2>
            <p style={{ color: '#7a8ba8', fontSize: 16, lineHeight: 1.7, marginBottom: 28 }}>
              Your attendant dashboard shows every active session, every payment, every exit. Revenue goes directly to your account — not through anyone's hands.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                'Live view of all parked cars',
                'Manual override for every situation',
                'Cash payment logging (for offline fallback)',
                'Daily, weekly, monthly revenue reports',
                'Offline mode — works without internet',
              ].map((point) => (
                <li key={point} style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#aab', fontSize: 15 }}>
                  <span style={{ color: '#16a34a', fontWeight: 800 }}>✓</span> {point}
                </li>
              ))}
            </ul>
          </div>
          <div style={{ flex: 1, minWidth: 280, background: '#0d1525', border: '1px solid #1e2d4a', borderRadius: 20, padding: 28 }}>
            <div style={{ fontSize: 13, color: '#556', marginBottom: 20 }}>Live Dashboard — Today</div>
            {[
              { token: 'PRK-4B7X', status: '🚗 Parked', time: '1h 23min', amount: '₦450', color: '#2563eb' },
              { token: 'PRK-9KQM', status: '✅ Paid', time: '45min', amount: '₦200', color: '#16a34a' },
              { token: 'PRK-2RNP', status: '⏳ Waiting', time: 'Just arrived', amount: '—', color: '#d97706' },
              { token: 'PRK-7VTJ', status: '💵 Cash Paid', time: '2h 10min', amount: '₦650', color: '#7c3aed' },
            ].map((row) => (
              <div key={row.token} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid #1a2540' }}>
                <div>
                  <div style={{ fontWeight: 700, letterSpacing: 2, fontSize: 14 }}>{row.token}</div>
                  <div style={{ fontSize: 12, color: '#556', marginTop: 3 }}>{row.time}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 12, color: row.color, fontWeight: 600 }}>{row.status}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, marginTop: 3 }}>{row.amount}</div>
                </div>
              </div>
            ))}
            <div style={{ marginTop: 20, padding: '14px 18px', background: '#0a0f1e', borderRadius: 10, display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#556', fontSize: 13 }}>Today's Revenue</span>
              <span style={{ fontWeight: 800, fontSize: 18, color: '#16a34a' }}>₦1,300</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section style={{ background: '#060a14', padding: '80px 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>Simple pricing</h2>
        <p style={{ color: '#7a8ba8', marginBottom: 48, fontSize: 16 }}>No monthly fees during MVP. We take a small cut per transaction.</p>
        <div style={{ display: 'inline-block', background: '#0d1525', border: '1px solid #2563eb', borderRadius: 20, padding: 'clamp(28px, 8vw, 48px) clamp(24px, 8vw, 64px)', maxWidth: 380, width: '100%', boxSizing: 'border-box' }}>
          <div style={{ fontSize: 13, color: '#2563eb', fontWeight: 700, marginBottom: 12 }}>TRANSACTION FEE</div>
          <div style={{ fontSize: 64, fontWeight: 900, lineHeight: 1 }}>5%</div>
          <div style={{ color: '#7a8ba8', marginTop: 8, marginBottom: 32, fontSize: 15 }}>per online payment processed</div>
          <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {['No setup fee', 'No monthly subscription', 'Cash payments are free', 'Unlimited attendants', 'Unlimited sessions'].map((f) => (
              <li key={f} style={{ display: 'flex', gap: 10, color: '#aab', fontSize: 15 }}>
                <span style={{ color: '#16a34a' }}>✓</span> {f}
              </li>
            ))}
          </ul>
          <button
            onClick={() => navigate('/attendant/login')}
            style={{ width: '100%', marginTop: 32, background: '#2563eb', color: '#fff', border: 'none', padding: '16px', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: 'pointer' }}
          >
            Get Started Free →
          </button>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '100px 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: 900, marginBottom: 20, letterSpacing: '-1px' }}>
          Ready to modernise your parking lot?
        </h2>
        <p style={{ color: '#7a8ba8', fontSize: 18, marginBottom: 40, maxWidth: 480, margin: '0 auto 40px' }}>
          Set up takes less than 10 minutes. Print a QR code, create your attendant account, and you're live.
        </p>
        <button
          onClick={() => navigate('/attendant/login')}
          style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '18px 48px', borderRadius: 14, fontSize: 18, fontWeight: 800, cursor: 'pointer' }}
        >
          Set Up My Parking Lot →
        </button>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #1e2d4a', padding: '32px 40px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, color: '#556', fontSize: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>🅿️</span>
          <span style={{ fontWeight: 700, color: '#aab' }}>ParkPay</span>
          <span>— Smart parking for Nigeria</span>
        </div>
        <div>© 2026 ParkPay. All rights reserved.</div>
      </footer>
    </div>
  );
}
