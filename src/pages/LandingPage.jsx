import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div
      style={{
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        background: "#0a0f1e",
        color: "#fff",
        minHeight: "100vh",
      }}
    >
      {/* ===== NAVIGATION ===== */}
      <nav
        style={{
          padding: "16px 24px",
          borderBottom: "1px solid #1e2d4a",
          position: "sticky",
          top: 0,
          background: "#0a0f1e",
          zIndex: 1000,
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 28 }}>🅿️</span>
            <span
              style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px" }}
            >
              ParkPay
            </span>
          </div>

          {/* Desktop Navigation */}
          <div
            style={{
              display: "flex",
              gap: 12,
              alignItems: "center",
            }}
          >
            <button
              onClick={() => navigate("/attendant/login")}
              style={{
                background: "transparent",
                border: "1px solid #334",
                color: "#aab",
                padding: "10px 20px",
                borderRadius: 8,
                cursor: "pointer",
                fontSize: 14,
                transition: "all 0.2s",
                display: "none",
                "@media (min-width: 768px)": {
                  display: "block",
                },
              }}
            >
              Attendant Login
            </button>
            <button
              onClick={() => navigate("/attendant/login")}
              style={{
                background: "#2563eb",
                border: "none",
                color: "#fff",
                padding: "10px 24px",
                borderRadius: 8,
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 600,
                transition: "all 0.2s",
                display: "none",
                "@media (min-width: 768px)": {
                  display: "block",
                },
              }}
            >
              Get Started →
            </button>

            {/* Hamburger - visible on mobile */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={{
                background: "transparent",
                border: "1px solid #334",
                color: "#aab",
                padding: "8px 14px",
                borderRadius: 8,
                cursor: "pointer",
                fontSize: 24,
                lineHeight: 1,
                display: "block",
                "@media (min-width: 768px)": {
                  display: "none",
                },
              }}
            >
              {isMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              paddingTop: 20,
              paddingBottom: 10,
              borderTop: "1px solid #1e2d4a",
              marginTop: 16,
            }}
          >
            <button
              onClick={() => {
                navigate("/attendant/login");
                setIsMenuOpen(false);
              }}
              style={{
                background: "transparent",
                border: "1px solid #334",
                color: "#aab",
                padding: "14px",
                borderRadius: 8,
                cursor: "pointer",
                fontSize: 16,
                width: "100%",
                textAlign: "center",
              }}
            >
              Attendant Login
            </button>
            <button
              onClick={() => {
                navigate("/attendant/login");
                setIsMenuOpen(false);
              }}
              style={{
                background: "#2563eb",
                border: "none",
                color: "#fff",
                padding: "14px",
                borderRadius: 8,
                cursor: "pointer",
                fontSize: 16,
                fontWeight: 600,
                width: "100%",
                textAlign: "center",
              }}
            >
              Get Started →
            </button>
          </div>
        )}
      </nav>

      {/* ===== HERO SECTION ===== */}
      <section
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "80px 24px 60px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-block",
            background: "#1e2d4a",
            border: "1px solid #2563eb33",
            borderRadius: 40,
            padding: "6px 20px",
            fontSize: 13,
            color: "#60a5fa",
            marginBottom: 24,
            fontWeight: 600,
          }}
        >
          Built for Nigerian Parking Lots
        </div>

        <h1
          style={{
            fontSize: "clamp(36px, 8vw, 72px)",
            fontWeight: 900,
            lineHeight: 1.1,
            maxWidth: 800,
            margin: "0 auto 20px",
            letterSpacing: "-2px",
          }}
        >
          Park. Pay from your phone.
          <br />
          <span style={{ color: "#2563eb" }}>No booth. No queue.</span>
        </h1>

        <p
          style={{
            fontSize: "clamp(16px, 1.5vw, 20px)",
            color: "#7a8ba8",
            maxWidth: 540,
            margin: "0 auto 40px",
            lineHeight: 1.6,
          }}
        >
          Drivers scan a QR code, pay online, and exit in minutes. Parking lot
          owners get real-time revenue tracking and zero cash leakage.
        </p>

        <div
          style={{
            display: "flex",
            gap: 16,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => navigate("/attendant/login")}
            style={{
              background: "#2563eb",
              color: "#fff",
              border: "none",
              padding: "16px 40px",
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s",
              minWidth: "200px",
            }}
          >
            Start Free Trial →
          </button>
          <button
            onClick={() =>
              document
                .getElementById("how")
                .scrollIntoView({ behavior: "smooth" })
            }
            style={{
              background: "transparent",
              color: "#aab",
              border: "1px solid #334",
              padding: "16px 40px",
              borderRadius: 12,
              fontSize: 16,
              cursor: "pointer",
              transition: "all 0.2s",
              minWidth: "200px",
            }}
          >
            See How It Works
          </button>
        </div>

        {/* Stats - Responsive Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "clamp(20px, 3vw, 32px)",
            marginTop: "clamp(50px, 8vh, 80px)",
            maxWidth: 800,
            marginLeft: "auto",
            marginRight: "auto",
            "@media (min-width: 768px)": {
              gridTemplateColumns: "repeat(4, 1fr)",
            },
          }}
        >
          {[
            { number: "< 60s", label: "To pay and exit" },
            { number: "0%", label: "Cash leakage" },
            { number: "3", label: "Ways to pay" },
            { number: "100%", label: "Revenue visibility" },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                background: "#0d1525",
                border: "1px solid #1e2d4a",
                borderRadius: 12,
                padding: "clamp(16px, 2vw, 24px)",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "clamp(28px, 4vw, 40px)",
                  fontWeight: 900,
                  color: "#2563eb",
                }}
              >
                {stat.number}
              </div>
              <div
                style={{
                  fontSize: "clamp(12px, 1vw, 14px)",
                  color: "#7a8ba8",
                  marginTop: 4,
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== PROBLEM SECTION ===== */}
      <section style={{ background: "#060a14", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 36px)",
              fontWeight: 800,
              marginBottom: 16,
            }}
          >
            The problem with parking in Nigeria today
          </h2>
          <p
            style={{
              color: "#7a8ba8",
              maxWidth: 600,
              margin: "0 auto 60px",
              fontSize: "clamp(14px, 1.2vw, 16px)",
              lineHeight: 1.6,
            }}
          >
            Every parking lot runs the same broken system — cash, paper tickets,
            and staff who pocket revenue.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: 24,
              maxWidth: 960,
              margin: "0 auto",
            }}
          >
            {[
              {
                icon: "🚶",
                title: "Walk to the booth",
                desc: "Driver leaves their car, walks to pay, walks back. 5–15 minutes wasted every time.",
              },
              {
                icon: "💸",
                title: "Cash goes missing",
                desc: "Owners have no visibility. Attendants collect cash and pocket a percentage. No record.",
              },
              {
                icon: "📋",
                title: "Paper tickets get lost",
                desc: "No digital record of who parked, for how long, or what was collected.",
              },
            ].map((item) => (
              <div
                key={item.title}
                style={{
                  background: "#0d1525",
                  border: "1px solid #1e2d4a",
                  borderRadius: 16,
                  padding: "32px 24px",
                  textAlign: "left",
                }}
              >
                <div style={{ fontSize: 40, marginBottom: 16 }}>
                  {item.icon}
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
                  {item.title}
                </h3>
                <p style={{ color: "#7a8ba8", fontSize: 14, lineHeight: 1.6 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* How It Works - Solution 1 */}
      <section
        id="how"
        style={{ padding: "80px 24px", maxWidth: 1000, margin: "0 auto" }}
      >
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 36px)",
              fontWeight: 800,
              marginBottom: 12,
            }}
          >
            How ParkPay works
          </h2>
          <p style={{ color: "#7a8ba8", fontSize: "clamp(14px, 1.2vw, 16px)" }}>
            Four simple steps. No app download needed.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {[
            {
              step: "01",
              icon: "📱",
              title: "Scan the QR code at the gate",
              desc: "A permanent sign at the entrance has a QR code. Driver scans it — their phone opens ParkPay instantly in the browser. No app needed. No download.",
            },
            {
              step: "02",
              icon: "✅",
              title: "Attendant allows entry",
              desc: 'The attendant sees the request on their tablet dashboard and taps "Allow Entry". The timer starts. Driver parks.',
            },
            {
              step: "03",
              icon: "💳",
              title: "Driver pays when ready to leave",
              desc: 'When leaving, driver opens their session link and taps "Pay Now". They pay with card, bank transfer, or USSD — all supported.',
            },
            {
              step: "04",
              icon: "🚦",
              title: "Attendant confirms and opens gate",
              desc: 'Attendant sees "PAID" on their dashboard next to the session. They confirm exit and open the gate. Session closes automatically.',
            },
          ].map((item) => (
            <div
              key={item.step}
              style={{
                background: "#0d1525",
                border: "1px solid #1e2d4a",
                borderRadius: 16,
                padding: "24px",
                textAlign: "center",
                "@media (min-width: 768px)": {
                  textAlign: "left",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 20,
                  padding: "28px 32px",
                },
              }}
            >
              {/* Icon & Number - Stacked on mobile, side by side on desktop */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 12,
                  marginBottom: 12,
                  "@media (min-width: 768px)": {
                    flexDirection: "column",
                    minWidth: 70,
                    marginBottom: 0,
                    gap: 8,
                  },
                }}
              >
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 800,
                    color: "#2563eb",
                    background: "#1e2d4a",
                    padding: "4px 12px",
                    borderRadius: 20,
                    border: "1px solid #2563eb33",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.step}
                </div>
                <div style={{ fontSize: 32 }}>{item.icon}</div>
              </div>

              {/* Content */}
              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    fontSize: "clamp(16px, 1.5vw, 20px)",
                    fontWeight: 700,
                    marginBottom: 8,
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    color: "#7a8ba8",
                    fontSize: "clamp(14px, 1vw, 15px)",
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* ===== FALLBACK OPTIONS ===== */}
      <section style={{ background: "#060a14", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
          <h2
            style={{
              fontSize: "clamp(24px, 3.5vw, 32px)",
              fontWeight: 800,
              marginBottom: 12,
            }}
          >
            Works for everyone — even without a smartphone
          </h2>
          <p
            style={{
              color: "#7a8ba8",
              maxWidth: 560,
              margin: "0 auto 60px",
              fontSize: "clamp(14px, 1.2vw, 16px)",
              lineHeight: 1.6,
            }}
          >
            We designed for Nigeria's reality. Not everyone has a working camera
            or a smartphone.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 20,
              maxWidth: 960,
              margin: "0 auto",
            }}
          >
            {[
              {
                icon: "📷",
                label: "Can scan QR",
                method: "Scan → pay online",
                color: "#16a34a",
              },
              {
                icon: "🌐",
                label: "No QR scanner",
                method: "Type the short URL manually",
                color: "#2563eb",
              },
              {
                icon: "📟",
                label: "Feature phone",
                method: "Attendant sends SMS link",
                color: "#7c3aed",
              },
              {
                icon: "👴",
                label: "No phone at all",
                method: "Attendant logs manually",
                color: "#d97706",
              },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  background: "#0d1525",
                  border: `1px solid ${item.color}33`,
                  borderRadius: 14,
                  padding: "24px 16px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 40, marginBottom: 12 }}>
                  {item.icon}
                </div>
                <div
                  style={{ fontSize: 13, color: "#7a8ba8", marginBottom: 8 }}
                >
                  {item.label}
                </div>
                <div
                  style={{ fontSize: 14, fontWeight: 600, color: item.color }}
                >
                  {item.method}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== OPERATOR DASHBOARD ===== */}
      <section
        style={{ padding: "80px 24px", maxWidth: 1100, margin: "0 auto" }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 48,
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 13,
                color: "#2563eb",
                fontWeight: 700,
                letterSpacing: 1,
                marginBottom: 12,
              }}
            >
              FOR PARKING LOT OWNERS
            </div>
            <h2
              style={{
                fontSize: "clamp(28px, 3.5vw, 36px)",
                fontWeight: 800,
                lineHeight: 1.2,
                marginBottom: 20,
              }}
            >
              See every naira. In real time.
            </h2>
            <p
              style={{
                color: "#7a8ba8",
                fontSize: "clamp(14px, 1.2vw, 16px)",
                lineHeight: 1.7,
                marginBottom: 28,
              }}
            >
              Your attendant dashboard shows every active session, every
              payment, every exit. Revenue goes directly to your account — not
              through anyone's hands.
            </p>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {[
                "Live view of all parked cars",
                "Manual override for every situation",
                "Cash payment logging for offline fallback",
                "Daily, weekly, monthly revenue reports",
                "Offline mode — works without internet",
              ].map((point) => (
                <li
                  key={point}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    color: "#aab",
                    fontSize: "clamp(13px, 1vw, 15px)",
                  }}
                >
                  <span
                    style={{ color: "#16a34a", fontWeight: 800, fontSize: 18 }}
                  >
                    ✓
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </div>

          {/* Dashboard Preview */}
          <div
            style={{
              background: "#0d1525",
              border: "1px solid #1e2d4a",
              borderRadius: 20,
              padding: "28px 24px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
                flexWrap: "wrap",
                gap: 8,
              }}
            >
              <span style={{ fontSize: 13, color: "#7a8ba8", fontWeight: 600 }}>
                Live Dashboard — Today
              </span>
              <span
                style={{
                  fontSize: 12,
                  color: "#16a34a",
                  background: "#16a34a22",
                  padding: "4px 12px",
                  borderRadius: 20,
                }}
              >
                ● Live
              </span>
            </div>

            {[
              {
                token: "PRK-4B7X",
                status: "🚗 Parked",
                time: "1h 23min",
                amount: "₦450",
                color: "#2563eb",
              },
              {
                token: "PRK-9KQM",
                status: "✅ Paid",
                time: "45min",
                amount: "₦200",
                color: "#16a34a",
              },
              {
                token: "PRK-2RNP",
                status: "⏳ Waiting",
                time: "Just arrived",
                amount: "—",
                color: "#d97706",
              },
              {
                token: "PRK-7VTJ",
                status: "💵 Cash Paid",
                time: "2h 10min",
                amount: "₦650",
                color: "#7c3aed",
              },
            ].map((row) => (
              <div
                key={row.token}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 0",
                  borderBottom: "1px solid #1a2540",
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                <div>
                  <div
                    style={{ fontWeight: 700, letterSpacing: 1, fontSize: 14 }}
                  >
                    {row.token}
                  </div>
                  <div style={{ fontSize: 11, color: "#7a8ba8", marginTop: 2 }}>
                    {row.time}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{ fontSize: 12, color: row.color, fontWeight: 600 }}
                  >
                    {row.status}
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, marginTop: 2 }}>
                    {row.amount}
                  </div>
                </div>
              </div>
            ))}

            <div
              style={{
                marginTop: 20,
                padding: "14px 18px",
                background: "#0a0f1e",
                borderRadius: 10,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 8,
              }}
            >
              <span style={{ color: "#7a8ba8", fontSize: 13 }}>
                Today's Revenue
              </span>
              <span style={{ fontWeight: 800, fontSize: 20, color: "#16a34a" }}>
                ₦1,300
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section style={{ background: "#060a14", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
          <h2
            style={{
              fontSize: "clamp(28px, 3.5vw, 36px)",
              fontWeight: 800,
              marginBottom: 12,
            }}
          >
            Simple pricing
          </h2>
          <p
            style={{
              color: "#7a8ba8",
              fontSize: "clamp(14px, 1.2vw, 16px)",
              marginBottom: 48,
            }}
          >
            No monthly fees during MVP. We take a small cut per transaction.
          </p>

          <div
            style={{
              display: "inline-block",
              background: "#0d1525",
              border: "2px solid #2563eb",
              borderRadius: 20,
              padding: "40px 48px",
              maxWidth: 420,
              width: "100%",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 13,
                color: "#2563eb",
                fontWeight: 700,
                letterSpacing: 1,
                marginBottom: 8,
              }}
            >
              TRANSACTION FEE
            </div>
            <div style={{ fontSize: 64, fontWeight: 900, lineHeight: 1 }}>
              5%
            </div>
            <div
              style={{
                color: "#7a8ba8",
                marginTop: 8,
                marginBottom: 32,
                fontSize: 15,
              }}
            >
              per online payment processed
            </div>

            <ul
              style={{
                listStyle: "none",
                padding: 0,
                textAlign: "left",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {[
                "No setup fee",
                "No monthly subscription",
                "Cash payments are free",
                "Unlimited attendants",
                "Unlimited sessions",
              ].map((f) => (
                <li
                  key={f}
                  style={{
                    display: "flex",
                    gap: 10,
                    color: "#aab",
                    fontSize: "clamp(14px, 1vw, 15px)",
                  }}
                >
                  <span style={{ color: "#16a34a", fontWeight: 800 }}>✓</span>
                  {f}
                </li>
              ))}
            </ul>

            <button
              onClick={() => navigate("/attendant/login")}
              style={{
                width: "100%",
                marginTop: 32,
                background: "#2563eb",
                color: "#fff",
                border: "none",
                padding: "16px",
                borderRadius: 12,
                fontSize: 16,
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              Get Started Free →
            </button>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section style={{ padding: "80px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "clamp(28px, 5vw, 48px)",
              fontWeight: 900,
              marginBottom: 20,
              letterSpacing: "-1px",
            }}
          >
            Ready to modernise your parking lot?
          </h2>
          <p
            style={{
              color: "#7a8ba8",
              fontSize: "clamp(16px, 1.3vw, 18px)",
              maxWidth: 480,
              margin: "0 auto 40px",
              lineHeight: 1.6,
            }}
          >
            Set up takes less than 10 minutes. Print a QR code, create your
            attendant account, and you're live.
          </p>
          <button
            onClick={() => navigate("/attendant/login")}
            style={{
              background: "#2563eb",
              color: "#fff",
              border: "none",
              padding: "18px 52px",
              borderRadius: 14,
              fontSize: "clamp(16px, 1.3vw, 18px)",
              fontWeight: 800,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            Set Up My Parking Lot →
          </button>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer
        style={{
          borderTop: "1px solid #1e2d4a",
          padding: "32px 24px",
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
          color: "#7a8ba8",
          fontSize: 14,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span>🅿️</span>
          <span style={{ fontWeight: 700, color: "#aab" }}>ParkPay</span>
          <span>— Smart parking for Nigeria</span>
        </div>
        <div>© 2026 ParkPay. All rights reserved.</div>
      </footer>
    </div>
  );
}
