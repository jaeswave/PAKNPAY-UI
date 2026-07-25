import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import toast from "react-hot-toast";

export default function OwnerDashboard() {
  const { attendant, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [lot, setLot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("overview");
  const [unlocked, setUnlocked] = useState(
    sessionStorage.getItem("parkpay_owner_unlocked") === "true",
  );
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    if (unlocked) fetchAll();
  }, [unlocked]);

  const handlePinSubmit = async (e) => {
    e.preventDefault();
    setVerifying(true);
    setPinError("");
    try {
      await api.post("/attendants/verify-dashboard-pin", { pin: pinInput });
      sessionStorage.setItem("parkpay_owner_unlocked", "true");
      setUnlocked(true);
    } catch (err) {
      setPinError(err.response?.data?.message || "Incorrect PIN");
      setPinInput("");
    } finally {
      setVerifying(false);
    }
  };

  const fetchAll = async () => {
    try {
      const lotId = attendant?.lotId;
      if (!lotId) return;
      const [lotRes, statsRes, sessionsRes] = await Promise.all([
        api.get(`/lots/${lotId}`),
        api.get(`/lots/${lotId}/stats`),
        api.get(`/sessions/lot/${lotId}/history?limit=50`),
      ]);
      setLot(lotRes.data.lot);
      setStats(statsRes.data);
      setSessions(sessionsRes.data.sessions || []);
    } catch (err) {
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const driverUrl = lot
    ? `${window.location.origin}/park/${lot.shortCode}`
    : "";

  const STATUS_COLORS = {
    pending: "#f59e0b",
    active: "#3b82f6",
    "pending-payment": "#8b5cf6",
    paid: "#10b981",
    "cash-paid": "#14b8a6",
    completed: "#6b7280",
    waived: "#f97316",
  };

  const c = {
    card: {
      background: "#fff",
      borderRadius: 14,
      padding: 20,
      boxShadow: "0 1px 8px #0001",
    },
  };

  // Dashboard PIN gate — shown before ANYTHING else on this page, even
  // if the device is already logged in as the owner.
  if (!unlocked) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0f172a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
          fontFamily: "'Segoe UI', sans-serif",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 340,
            background: "#fff",
            borderRadius: 20,
            padding: 32,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 8 }}>🔒</div>
          <h2 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 800 }}>
            Owner Dashboard
          </h2>
          <p style={{ color: "#6b7280", fontSize: 13, marginBottom: 20 }}>
            Enter your dashboard PIN to continue
          </p>
          <form onSubmit={handlePinSubmit}>
            <input
              type="password"
              maxLength={4}
              autoFocus
              value={pinInput}
              onChange={(e) => {
                setPinInput(e.target.value);
                setPinError("");
              }}
              placeholder="••••"
              style={{
                width: "100%",
                textAlign: "center",
                letterSpacing: 12,
                fontSize: 24,
                border: pinError ? "1px solid #dc2626" : "1px solid #d1d5db",
                borderRadius: 10,
                padding: "14px",
                outline: "none",
                boxSizing: "border-box",
                marginBottom: 8,
              }}
            />
            {pinError && (
              <p style={{ color: "#dc2626", fontSize: 12, marginBottom: 12 }}>
                {pinError}
              </p>
            )}
            <button
              type="submit"
              disabled={verifying || pinInput.length !== 4}
              style={{
                width: "100%",
                background: "#1e40af",
                color: "#fff",
                border: "none",
                padding: "13px",
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                opacity: verifying || pinInput.length !== 4 ? 0.6 : 1,
                marginTop: 4,
              }}
            >
              {verifying ? "Checking..." : "Unlock"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loading)
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f8fafc",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 40,
              height: 40,
              border: "4px solid #3b82f6",
              borderTopColor: "transparent",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 16px",
            }}
          />
          <p style={{ color: "#64748b" }}>Loading dashboard...</p>
        </div>
      </div>
    );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      <div
        style={{
          background: "#1e40af",
          color: "#fff",
          padding: "0 clamp(12px, 4vw, 24px)",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 10,
            padding: "12px 0",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 24 }}>🅿️</span>
            <div>
              <div style={{ fontWeight: 800, fontSize: 16 }}>
                {lot?.name || "ParkPay"}
              </div>
              <div style={{ fontSize: 11, color: "#93c5fd" }}>
                Owner Dashboard
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button
              onClick={() => navigate("/attendant/dashboard")}
              style={{
                background: "#2563eb",
                color: "#fff",
                border: "none",
                padding: "8px 12px",
                borderRadius: 8,
                cursor: "pointer",
                fontSize: 12,
                whiteSpace: "nowrap",
              }}
            >
              Attendant View
            </button>
            <button
              onClick={() => navigate("/owner/settings")}
              style={{
                background: "#1e3a8a",
                color: "#fff",
                border: "none",
                padding: "8px 12px",
                borderRadius: 8,
                cursor: "pointer",
                fontSize: 12,
                whiteSpace: "nowrap",
              }}
            >
              ⚙️ Settings
            </button>
            <button
              onClick={logout}
              style={{
                background: "transparent",
                color: "#93c5fd",
                border: "1px solid #3b5fc0",
                padding: "8px 12px",
                borderRadius: 8,
                cursor: "pointer",
                fontSize: 12,
                whiteSpace: "nowrap",
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div style={{ background: "#fff", borderBottom: "1px solid #e2e8f0" }}>
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "flex",
            gap: 0,
            overflowX: "auto",
          }}
        >
          {["overview", "sessions", "attendants", "commission"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: "14px 20px",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: tab === t ? 700 : 400,
                color: tab === t ? "#1e40af" : "#64748b",
                borderBottom:
                  tab === t ? "2px solid #1e40af" : "2px solid transparent",
                textTransform: "capitalize",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "clamp(16px, 4vw, 24px)",
        }}
      >
        {tab === "overview" && (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 16,
                marginBottom: 24,
              }}
            >
              {[
                {
                  label: "Today's Revenue",
                  value: `₦${(stats?.today?.revenue || 0).toLocaleString()}`,
                  sub: `${stats?.today?.sessions || 0} sessions`,
                  color: "#10b981",
                  bg: "#f0fdf4",
                },
                {
                  label: "This Week",
                  value: `₦${(stats?.week?.revenue || 0).toLocaleString()}`,
                  sub: `${stats?.week?.sessions || 0} sessions`,
                  color: "#3b82f6",
                  bg: "#eff6ff",
                },
                {
                  label: "This Month",
                  value: `₦${(stats?.month?.revenue || 0).toLocaleString()}`,
                  sub: `${stats?.month?.sessions || 0} sessions`,
                  color: "#8b5cf6",
                  bg: "#f5f3ff",
                },
                {
                  label: "Currently Parked",
                  value: stats?.activeSessions || 0,
                  sub: "active sessions",
                  color: "#f59e0b",
                  bg: "#fffbeb",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  style={{
                    ...c.card,
                    background: s.bg,
                    border: `1px solid ${s.color}22`,
                  }}
                >
                  <div
                    style={{ fontSize: 13, color: "#64748b", marginBottom: 8 }}
                  >
                    {s.label}
                  </div>
                  <div
                    style={{ fontSize: 28, fontWeight: 800, color: s.color }}
                  >
                    {s.value}
                  </div>
                  <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>
                    {s.sub}
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                ...c.card,
                marginBottom: 24,
                background: "#eff6ff",
                border: "1px solid #bfdbfe",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 12,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#1e40af",
                      marginBottom: 4,
                    }}
                  >
                    Driver Parking URL
                  </div>
                  <div
                    style={{
                      fontFamily: "monospace",
                      fontSize: 15,
                      color: "#1e3a8a",
                    }}
                  >
                    {driverUrl}
                  </div>
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
                    Share this link or generate a QR code from it
                  </div>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(driverUrl);
                      toast.success("Copied!");
                    }}
                    style={{
                      background: "#1e40af",
                      color: "#fff",
                      border: "none",
                      padding: "10px 18px",
                      borderRadius: 8,
                      cursor: "pointer",
                      fontWeight: 600,
                      fontSize: 13,
                    }}
                  >
                    Copy URL
                  </button>
                  <a
                    href={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(driverUrl)}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      background: "#fff",
                      color: "#1e40af",
                      border: "1px solid #bfdbfe",
                      padding: "10px 18px",
                      borderRadius: 8,
                      cursor: "pointer",
                      fontWeight: 600,
                      fontSize: 13,
                      textDecoration: "none",
                      display: "inline-block",
                    }}
                  >
                    View QR Code
                  </a>
                </div>
              </div>
            </div>

            {stats?.dailyRevenue?.length > 0 && (
              <div style={{ ...c.card, marginBottom: 24 }}>
                <div
                  style={{ fontWeight: 700, marginBottom: 16, fontSize: 15 }}
                >
                  Revenue — Last 7 Days
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    gap: 8,
                    height: 100,
                  }}
                >
                  {stats.dailyRevenue.map((d) => {
                    const max = Math.max(
                      ...stats.dailyRevenue.map((x) => x.revenue),
                    );
                    const h = max > 0 ? (d.revenue / max) * 80 : 4;
                    return (
                      <div
                        key={d._id}
                        style={{
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <div style={{ fontSize: 10, color: "#64748b" }}>
                          ₦{(d.revenue / 1000).toFixed(0)}k
                        </div>
                        <div
                          style={{
                            width: "100%",
                            height: h,
                            background: "#3b82f6",
                            borderRadius: 4,
                            minHeight: 4,
                          }}
                        />
                        <div style={{ fontSize: 10, color: "#94a3b8" }}>
                          {d._id.slice(5)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div style={{ ...c.card }}>
              <div style={{ fontWeight: 700, marginBottom: 16, fontSize: 15 }}>
                Lot Information
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: 12,
                }}
              >
                {[
                  { label: "Name", value: lot?.name },
                  { label: "Address", value: lot?.address },
                  { label: "Total Spots", value: lot?.totalSpots },
                  { label: "Rate Per Hour", value: `₦${lot?.ratePerHour}` },
                  { label: "Minimum Charge", value: `₦${lot?.minimumCharge}` },
                  {
                    label: "Free Minutes",
                    value: `${lot?.gracePeriodMinutes} mins`,
                  },
                  { label: "Short Code", value: lot?.shortCode },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      background: "#f8fafc",
                      borderRadius: 8,
                      padding: "10px 14px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        color: "#94a3b8",
                        marginBottom: 2,
                      }}
                    >
                      {item.label}
                    </div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => navigate("/owner/settings")}
                style={{
                  marginTop: 16,
                  background: "#f1f5f9",
                  color: "#1e40af",
                  border: "none",
                  padding: "10px 18px",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: 13,
                }}
              >
                Edit Settings →
              </button>
            </div>
          </>
        )}

        {tab === "sessions" && (
          <div style={c.card}>
            <div style={{ fontWeight: 700, marginBottom: 16, fontSize: 15 }}>
              Session History
            </div>
            {sessions.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px 0",
                  color: "#94a3b8",
                }}
              >
                No sessions yet
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: 14,
                  }}
                >
                  <thead>
                    <tr style={{ borderBottom: "2px solid #e2e8f0" }}>
                      {[
                        "Token",
                        "Plate",
                        "Spot",
                        "Entry",
                        "Duration",
                        "Amount",
                        "Method",
                        "Status",
                      ].map((h) => (
                        <th
                          key={h}
                          style={{
                            padding: "10px 12px",
                            textAlign: "left",
                            color: "#64748b",
                            fontWeight: 600,
                            fontSize: 12,
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sessions.map((s) => (
                      <tr
                        key={s._id}
                        style={{ borderBottom: "1px solid #f1f5f9" }}
                      >
                        <td
                          style={{
                            padding: "12px",
                            fontWeight: 700,
                            letterSpacing: 1,
                            color: "#1e40af",
                            fontFamily: "monospace",
                          }}
                        >
                          {s.sessionToken}
                        </td>
                        <td style={{ padding: "12px", color: "#64748b" }}>
                          {s.plateNumber || "—"}
                        </td>
                        <td style={{ padding: "12px", color: "#64748b" }}>
                          {s.spotNumber || "—"}
                        </td>
                        <td
                          style={{
                            padding: "12px",
                            color: "#64748b",
                            fontSize: 12,
                          }}
                        >
                          {new Date(s.entryTime).toLocaleString("en-NG", {
                            day: "2-digit",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td style={{ padding: "12px" }}>
                          {s.exitTime
                            ? `${Math.floor((new Date(s.exitTime) - new Date(s.entryTime)) / 60000)}min`
                            : "—"}
                        </td>
                        <td style={{ padding: "12px", fontWeight: 700 }}>
                          ₦{(s.amountPaid || 0).toLocaleString()}
                        </td>
                        <td
                          style={{
                            padding: "12px",
                            textTransform: "capitalize",
                            color: "#64748b",
                            fontSize: 12,
                          }}
                        >
                          {s.paymentMethod || "—"}
                        </td>
                        <td style={{ padding: "12px" }}>
                          <span
                            style={{
                              background: STATUS_COLORS[s.status] + "22",
                              color: STATUS_COLORS[s.status],
                              padding: "3px 10px",
                              borderRadius: 20,
                              fontSize: 11,
                              fontWeight: 700,
                              textTransform: "capitalize",
                            }}
                          >
                            {s.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {tab === "attendants" && <AttendantsTab lotId={attendant?.lotId} />}

        {tab === "commission" && <CommissionTab />}
      </div>
    </div>
  );
}

function AttendantsTab({ lotId }) {
  const [attendants, setAttendants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", phone: "", pin: "" });
  const [adding, setAdding] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchAttendants();
  }, []);

  const fetchAttendants = async () => {
    try {
      const res = await api.get(`/attendants/lot/${lotId}`);
      setAttendants(res.data.attendants || []);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (form.pin.length !== 4) return toast.error("PIN must be 4 digits");
    setAdding(true);
    try {
      await api.post("/attendants/add", form);
      toast.success("Attendant added!");
      setForm({ name: "", phone: "", pin: "" });
      setShowForm(false);
      fetchAttendants();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally {
      setAdding(false);
    }
  };

  const handleRemove = async (id, name) => {
    if (!window.confirm(`Remove ${name}?`)) return;
    try {
      await api.patch(`/attendants/${id}/remove`);
      toast.success("Attendant removed");
      fetchAttendants();
    } catch {
      toast.error("Failed");
    }
  };

  const s = {
    width: "100%",
    border: "1px solid #d1d5db",
    borderRadius: 8,
    padding: "10px 14px",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 14,
        padding: 24,
        boxShadow: "0 1px 8px #0001",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 15 }}>
          Attendants ({attendants.length})
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            background: "#1e40af",
            color: "#fff",
            border: "none",
            padding: "10px 18px",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: 600,
            fontSize: 13,
          }}
        >
          {showForm ? "Cancel" : "+ Add Attendant"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleAdd}
          style={{
            background: "#f8fafc",
            borderRadius: 12,
            padding: 20,
            marginBottom: 20,
            border: "1px solid #e2e8f0",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: 12,
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 600,
                  marginBottom: 4,
                }}
              >
                Full Name
              </label>
              <input
                style={s}
                placeholder="John Doe"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 600,
                  marginBottom: 4,
                }}
              >
                Phone
              </label>
              <input
                style={s}
                type="tel"
                placeholder="08012345678"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 600,
                  marginBottom: 4,
                }}
              >
                PIN (4 digits)
              </label>
              <input
                style={{ ...s, textAlign: "center", letterSpacing: 6 }}
                type="password"
                maxLength={4}
                placeholder="••••"
                value={form.pin}
                onChange={(e) => setForm({ ...form, pin: e.target.value })}
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={adding}
            style={{
              marginTop: 14,
              background: "#10b981",
              color: "#fff",
              border: "none",
              padding: "10px 24px",
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            {adding ? "Adding..." : "Add Attendant"}
          </button>
        </form>
      )}

      {loading ? (
        <p style={{ color: "#94a3b8", textAlign: "center", padding: 24 }}>
          Loading...
        </p>
      ) : attendants.length === 0 ? (
        <div
          style={{ textAlign: "center", padding: "40px 0", color: "#94a3b8" }}
        >
          <div style={{ fontSize: 40, marginBottom: 8 }}>👤</div>
          <p>No attendants yet — add one above</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {attendants.map((a) => (
            <div
              key={a._id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "#f8fafc",
                borderRadius: 10,
                padding: "14px 16px",
                border: "1px solid #e2e8f0",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "#dbeafe",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    color: "#1e40af",
                    fontSize: 14,
                  }}
                >
                  {a.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{a.name}</div>
                  <div style={{ fontSize: 12, color: "#64748b" }}>
                    {a.phone}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span
                  style={{
                    background: "#dbeafe",
                    color: "#1e40af",
                    padding: "3px 10px",
                    borderRadius: 20,
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "capitalize",
                  }}
                >
                  {a.role}
                </span>
                <button
                  onClick={() => handleRemove(a._id, a.name)}
                  style={{
                    background: "#fee2e2",
                    color: "#dc2626",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CommissionTab() {
  const [summary, setSummary] = useState(null);
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSettle, setShowSettle] = useState(false);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [summaryRes, settlementsRes] = await Promise.all([
        api.get("/payments/commissions/mine"),
        api.get("/settlements/mine"),
      ]);

      console.log("hello world",summaryRes)
      setSummary(summaryRes.data);
      setSettlements(settlementsRes.data.settlements || []);
    } catch {
      toast.error("Failed to load commission data");
    } finally {
      setLoading(false);
    }
  };

  const STATUS_COLORS = {
    pending_review: "#f59e0b",
    confirmed: "#10b981",
    rejected: "#dc2626",
  };

  if (loading)
    return (
      <p style={{ textAlign: "center", color: "#94a3b8", padding: 40 }}>
        Loading...
      </p>
    );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div
        style={{
          background: "#fff7ed",
          border: "1px solid #fed7aa",
          borderRadius: 14,
          padding: 24,
        }}
      >
        <div style={{ fontSize: 13, color: "#9a3412", marginBottom: 6 }}>
          Commission you owe the platform
        </div>
        <div style={{ fontSize: 34, fontWeight: 900, color: "#c2410c" }}>
          ₦{(summary?.amountOwed || 0).toLocaleString()}
        </div>
        <div style={{ fontSize: 12, color: "#9a3412", marginTop: 4 }}>
          from {summary?.unsettledCount || 0} unsettled online payment
          {summary?.unsettledCount === 1 ? "" : "s"}
        </div>
        {summary?.amountOwed > 0 && (
          <button
            onClick={() => setShowSettle(true)}
            style={{
              marginTop: 16,
              background: "#c2410c",
              color: "#fff",
              border: "none",
              padding: "12px 22px",
              borderRadius: 10,
              cursor: "pointer",
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            💳 Settle Now
          </button>
        )}
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: 14,
          padding: 20,
          boxShadow: "0 1px 8px #0001",
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: 16, fontSize: 15 }}>
          Settlement History
        </div>
        {settlements.length === 0 ? (
          <div
            style={{ textAlign: "center", padding: "30px 0", color: "#94a3b8" }}
          >
            No settlements submitted yet
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {settlements.map((s) => (
              <div
                key={s._id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "#f8fafc",
                  borderRadius: 10,
                  padding: "14px 16px",
                  border: "1px solid #e2e8f0",
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                <div>
                  <div style={{ fontWeight: 700 }}>
                    ₦{s.amount.toLocaleString()}
                  </div>
                  <div style={{ fontSize: 12, color: "#64748b" }}>
                    {new Date(s.createdAt).toLocaleDateString("en-NG", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                </div>
                <span
                  style={{
                    background: STATUS_COLORS[s.status] + "22",
                    color: STATUS_COLORS[s.status],
                    padding: "4px 12px",
                    borderRadius: 20,
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "capitalize",
                  }}
                >
                  {s.status.replace("_", " ")}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {showSettle && (
        <SettleModal
          onClose={() => setShowSettle(false)}
          onSuccess={() => {
            setShowSettle(false);
            fetchAll();
          }}
        />
      )}
    </div>
  );
}

function SettleModal({ onClose, onSuccess }) {
  const [receiptImage, setReceiptImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024)
      return toast.error("Image too large — please use a file under 5MB");
    const reader = new FileReader();
    reader.onload = () => {
      setReceiptImage(reader.result);
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!receiptImage)
      return toast.error("Please attach your transfer receipt");
    setSubmitting(true);
    try {
      await api.post("/settlements", { receiptImage, transferNote: note });
      toast.success("Settlement submitted — awaiting confirmation");
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#0008",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        zIndex: 100,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: 24,
          width: "100%",
          maxWidth: 420,
          maxHeight: "90vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 4 }}>
          Settle Commission
        </div>
        <p style={{ fontSize: 13, color: "#64748b", marginBottom: 18 }}>
          Transfer the amount owed to the platform's account, then upload proof
          of transfer below.
        </p>
        <div
          style={{
            background: "#f0f9ff",
            border: "1px solid #bae6fd",
            borderRadius: 10,
            padding: 14,
            marginBottom: 18,
            fontSize: 13,
          }}
        >
          {/* TODO: replace with your real bank details */}
          <div>
            <strong>Bank:</strong> [Your Bank Name Here]
          </div>
          <div>
            <strong>Account Name:</strong> [Your Account Name Here]
          </div>
          <div>
            <strong>Account Number:</strong> [Your Account Number Here]
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <label
            style={{
              display: "block",
              fontSize: 13,
              fontWeight: 600,
              marginBottom: 6,
            }}
          >
            Upload Receipt
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            style={{ marginBottom: 12, width: "100%" }}
            required
          />
          {preview && (
            <img
              src={preview}
              alt="Receipt preview"
              style={{
                width: "100%",
                borderRadius: 10,
                marginBottom: 14,
                maxHeight: 200,
                objectFit: "contain",
                background: "#f8fafc",
              }}
            />
          )}
          <label
            style={{
              display: "block",
              fontSize: 13,
              fontWeight: 600,
              marginBottom: 6,
            }}
          >
            Note (optional)
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Transfer reference, date, bank used"
            rows={3}
            style={{
              width: "100%",
              border: "1px solid #d1d5db",
              borderRadius: 10,
              padding: 12,
              fontSize: 14,
              outline: "none",
              boxSizing: "border-box",
              marginBottom: 16,
              fontFamily: "inherit",
            }}
          />
          <div style={{ display: "flex", gap: 10 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                background: "#f1f5f9",
                color: "#374151",
                border: "none",
                padding: "12px",
                borderRadius: 10,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              style={{
                flex: 2,
                background: "#1e40af",
                color: "#fff",
                border: "none",
                padding: "12px",
                borderRadius: 10,
                fontWeight: 700,
                cursor: "pointer",
                opacity: submitting ? 0.7 : 1,
              }}
            >
              {submitting ? "Submitting..." : "Submit for Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
