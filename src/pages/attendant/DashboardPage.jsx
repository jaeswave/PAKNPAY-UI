import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useOffline } from "../../hooks/useOffline";
import api from "../../utils/api";
import toast from "react-hot-toast";

const STATUS_COLORS = {
  pending: "#f59e0b",
  active: "#3b82f6",
  "pending-payment": "#8b5cf6",
  paid: "#10b981",
  "cash-paid": "#14b8a6",
  completed: "#6b7280",
  waived: "#f97316",
};
const STATUS_LABELS = {
  pending: "⏳ Waiting Entry",
  active: "🚗 Parked",
  "pending-payment": "💳 Paying...",
  paid: "✅ Paid — Exit",
  "cash-paid": "💵 Cash Paid",
  completed: "✔ Done",
  waived: "🆓 Waived",
};

export default function DashboardPage() {
  const { attendant, logout } = useAuth();
  const { syncOfflineSessions, offlineCount, syncing } = useOffline();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [barrierLoading, setBarrierLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [selected, setSelected] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [spotInput, setSpotInput] = useState("");
  const [simulating, setSimulating] = useState(false);
  // const [showValet, setShowValet] = useState(false);
  const [showValet, setShowValet] = useState(false);
  const [lot, setLot] = useState(null);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    fetchSessions();
    fetchLot();
    const interval = setInterval(fetchSessions, 15000);
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      clearInterval(interval);
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  const fetchSessions = async () => {
    try {
      const lotId = attendant?.lotId;
      if (!lotId) return;
      const res = await api.get(`/sessions/lot/${lotId}/active`);
      setSessions(res.data.sessions || []);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const fetchLot = async () => {
    try {
      const lotId = attendant?.lotId;
      if (!lotId) return;
      const res = await api.get(`/lots/${lotId}`);
      setLot(res.data.lot);
    } catch {}
  };

  const handleBarrier = async (action) => {
    setBarrierLoading(true);
    try {
      const res = await api.patch(`/lots/${attendant.lotId}/barrier/${action}`);
      toast.success(
        res.data.hardwareConnected
          ? `Barrier ${action}ed`
          : `${action === "open" ? "Open" : "Close"} command sent (no hardware connected yet)`,
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Barrier command failed");
    } finally {
      setBarrierLoading(false);
    }
  };

  // const handleAction = async (action, sessionId) => {
  //   setActionLoading(true);
  //   try {
  //     if (action === "allow")
  //       await api.patch(`/sessions/${sessionId}/allow`, {
  //         spotNumber: spotInput || null,
  //       });
  //     else if (action === "cash")
  //       await api.patch(`/sessions/${sessionId}/cash-paid`, {
  //         notes: "Cash collected",
  //       });
  //     else if (action === "waive")
  //       await api.patch(`/sessions/${sessionId}/waive`, {
  //         notes: "Fee waived by attendant",
  //       });
  //     else if (action === "exit")
  //       await api.patch(`/sessions/${sessionId}/confirm-exit`);
  //     toast.success(
  //       action === "allow"
  //         ? "Entry allowed!"
  //         : action === "cash"
  //           ? "Marked as cash paid"
  //           : action === "waive"
  //             ? "Fee waived"
  //             : "Exit confirmed",
  //     );
  //     setSelected(null);
  //     setSpotInput("");
  //     fetchSessions();
  //   } catch (err) {
  //     toast.error(err.response?.data?.message || "Action failed");
  //   } finally {
  //     setActionLoading(false);
  //   }
  // };

  const handleAction = async (action, sessionId) => {
    setActionLoading(true);
    try {
      if (action === "allow")
        await api.patch(`/sessions/${sessionId}/allow`, {
          spotNumber: spotInput || null,
        });
      else if (action === "exit")
        await api.patch(`/sessions/${sessionId}/confirm-exit`);
      toast.success(action === "allow" ? "Entry allowed!" : "Exit confirmed");
      setSelected(null);
      setSpotInput("");
      fetchSessions();
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSync = async () => {
    try {
      const r = await syncOfflineSessions();
      toast.success(`Synced ${r.synced} sessions`);
      fetchSessions();
    } catch {
      toast.error("Sync failed");
    }
  };

  const handleSimulateCar = async () => {
    setSimulating(true);
    try {
      const plates = ["LND", "ABJ", "KAN", "PHC", "IBD"];
      const randomPlate = `${plates[Math.floor(Math.random() * plates.length)]}-${Math.floor(100 + Math.random() * 900)}-${["AA", "BB", "CC", "DD"][Math.floor(Math.random() * 4)]}`;
      await api.post("/sessions/init", {
        lotId: attendant.lotId,
        plateNumber: randomPlate,
      });
      toast.success(
        `Simulated car "${randomPlate}" arriving — check the list below`,
      );
      fetchSessions();
    } catch (err) {
      toast.error(err.response?.data?.message || "Simulation failed");
    } finally {
      setSimulating(false);
    }
  };

  const pending = sessions.filter((s) => s.status === "pending");
  const active = sessions.filter((s) =>
    ["active", "pending-payment"].includes(s.status),
  );
  const readyToExit = sessions.filter((s) =>
    ["paid", "cash-paid"].includes(s.status),
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
          padding: "10px clamp(10px, 4vw, 16px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 22 }}>🅿️</span>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15 }}>ParkPay</div>
            <div style={{ fontSize: 11, color: "#93c5fd" }}>
              {attendant?.name}
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: isOnline ? "#4ade80" : "#f87171",
              flexShrink: 0,
            }}
          />
          {offlineCount() > 0 && (
            <button
              onClick={handleSync}
              disabled={syncing || !isOnline}
              style={{
                background: "#fbbf24",
                color: "#78350f",
                border: "none",
                padding: "6px 10px",
                borderRadius: 8,
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {syncing ? "Syncing..." : `Sync (${offlineCount()})`}
            </button>
          )}

          <button
            onClick={() => navigate("/attendant/manual")}
            style={{
              background: "#2563eb",
              color: "#fff",
              border: "none",
              padding: "6px 10px",
              borderRadius: 8,
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            + Manual
          </button>
          {/* <button
            onClick={() => setShowValet(true)}
            style={{
              background: "#059669",
              color: "#fff",
              border: "none",
              padding: "6px 10px",
              borderRadius: 8,
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            🎫 Check In Valet
          </button> */}

          <button
            onClick={() => setShowQR(true)}
            style={{
              background: "#f97316",
              color: "#fff",
              border: "none",
              padding: "6px 10px",
              borderRadius: 8,
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            📱 Driver QR
          </button>
          <button
            onClick={() => handleBarrier("open")}
            disabled={barrierLoading}
            style={{
              background: "#16a34a",
              color: "#fff",
              border: "none",
              padding: "6px 10px",
              borderRadius: 8,
              fontSize: 11,
              fontWeight: 700,
              cursor: barrierLoading ? "not-allowed" : "pointer",
              whiteSpace: "nowrap",
            }}
          >
            🔓 Open Barrier
          </button>
          <button
            onClick={() => handleBarrier("close")}
            disabled={barrierLoading}
            style={{
              background: "#dc2626",
              color: "#fff",
              border: "none",
              padding: "6px 10px",
              borderRadius: 8,
              fontSize: 11,
              fontWeight: 700,
              cursor: barrierLoading ? "not-allowed" : "pointer",
              whiteSpace: "nowrap",
            }}
          >
            🔒 Close Barrier
          </button>
          <button
            onClick={() => setShowValet(true)}
            style={{
              background: "#059669",
              color: "#fff",
              border: "none",
              padding: "6px 10px",
              borderRadius: 8,
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            🎫 Check In Valet
          </button>
          <button
            onClick={() => navigate("/owner/dashboard")}
            style={{
              background: "#1e3a8a",
              color: "#fff",
              border: "none",
              padding: "6px 10px",
              borderRadius: 8,
              fontSize: 11,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            🔒 Owner Dashboard
          </button>
          <button
            onClick={logout}
            style={{
              background: "transparent",
              color: "#93c5fd",
              border: "1px solid #3b5fc0",
              padding: "6px 10px",
              borderRadius: 8,
              fontSize: 11,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 10,
          padding: "14px 14px 0",
        }}
      >
        {[
          {
            label: "Waiting",
            count: pending.length,
            color: "#f59e0b",
            bg: "#fffbeb",
          },
          {
            label: "Parked",
            count: active.length,
            color: "#3b82f6",
            bg: "#eff6ff",
          },
          {
            label: "Ready Exit",
            count: readyToExit.length,
            color: "#10b981",
            bg: "#f0fdf4",
          },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              background: s.bg,
              borderRadius: 12,
              padding: "12px 8px",
              textAlign: "center",
              border: `1px solid ${s.color}33`,
            }}
          >
            <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>
              {s.count}
            </div>
            <div style={{ fontSize: 11, color: s.color }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ padding: 14 }}>
        <div
          style={{
            fontWeight: 700,
            color: "#374151",
            marginBottom: 10,
            fontSize: 14,
          }}
        >
          Active Sessions
        </div>
        {loading && (
          <div style={{ textAlign: "center", padding: 32, color: "#94a3b8" }}>
            Loading...
          </div>
        )}
        {!loading && sessions.length === 0 && (
          <div
            style={{ textAlign: "center", padding: "48px 0", color: "#94a3b8" }}
          >
            <div style={{ fontSize: 40, marginBottom: 8 }}>🅿️</div>
            <p>No active sessions — waiting for drivers</p>
          </div>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {sessions.map((s) => (
            <div
              key={s.id}
              onClick={() => setSelected(selected?.id === s.id ? null : s)}
              style={{
                background: "#fff",
                borderRadius: 14,
                padding: 16,
                cursor: "pointer",
                border:
                  selected?.id === s.id
                    ? "2px solid #3b82f6"
                    : "1px solid #e2e8f0",
                boxShadow: "0 1px 4px #0001",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <span
                  style={{
                    fontWeight: 800,
                    fontSize: 18,
                    letterSpacing: 2,
                    color: "#1e40af",
                    fontFamily: "monospace",
                  }}
                >
                  {s.sessionToken}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    padding: "3px 10px",
                    borderRadius: 20,
                    fontWeight: 700,
                    background: STATUS_COLORS[s.status] + "22",
                    color: STATUS_COLORS[s.status],
                  }}
                >
                  {STATUS_LABELS[s.status]}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  fontSize: 13,
                  color: "#64748b",
                }}
              >
                <span>⏱ {s.duration || "—"}</span>
                {s.spotNumber && <span>📍 Spot {s.spotNumber}</span>}
                {s.plateNumber && <span>🚗 {s.plateNumber}</span>}
                {s.currentAmount > 0 && (
                  <span
                    style={{
                      marginLeft: "auto",
                      fontWeight: 700,
                      color: "#374151",
                    }}
                  >
                    ₦{s.currentAmount?.toLocaleString()}
                  </span>
                )}
              </div>

              {selected?.id === s.id && (
                <div
                  style={{
                    marginTop: 14,
                    paddingTop: 14,
                    borderTop: "1px solid #e2e8f0",
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {s.status === "pending" && (
                    <>
                      <input
                        value={spotInput}
                        onChange={(e) => setSpotInput(e.target.value)}
                        placeholder="Spot number (optional, e.g. A12)"
                        style={{
                          width: "100%",
                          border: "1px solid #d1d5db",
                          borderRadius: 8,
                          padding: "10px 12px",
                          fontSize: 14,
                          marginBottom: 10,
                          boxSizing: "border-box",
                          outline: "none",
                        }}
                      />
                      <button
                        onClick={() => handleAction("allow", s.id)}
                        disabled={actionLoading}
                        style={{
                          width: "100%",
                          background: "#1d4ed8",
                          color: "#fff",
                          border: "none",
                          padding: "13px",
                          borderRadius: 10,
                          fontWeight: 700,
                          fontSize: 15,
                          cursor: "pointer",
                        }}
                      >
                        ✅ Allow Entry
                      </button>
                    </>
                  )}

                  {["paid", "cash-paid"].includes(s.status) && (
                    <button
                      onClick={() => handleAction("exit", s.id)}
                      disabled={actionLoading}
                      style={{
                        width: "100%",
                        background: "#16a34a",
                        color: "#fff",
                        border: "none",
                        padding: "13px",
                        borderRadius: 10,
                        fontWeight: 700,
                        fontSize: 15,
                        cursor: "pointer",
                      }}
                    >
                      🚦 Confirm Exit & Close
                    </button>
                  )}
                  {s.notes && (
                    <p
                      style={{
                        fontSize: 12,
                        color: "#94a3b8",
                        marginTop: 8,
                        fontStyle: "italic",
                      }}
                    >
                      {s.notes}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {showValet && (
        <ValetCheckInModal
          onClose={() => setShowValet(false)}
          onSuccess={() => {
            setShowValet(false);
            fetchSessions();
          }}
        />
      )}
      {showQR && <DriverQRModal lot={lot} onClose={() => setShowQR(false)} />}
    </div>
  );
}

function DriverQRModal({ lot, onClose }) {
  const driverUrl = lot
    ? `${window.location.origin}/park/${lot.shortCode}`
    : "";
  const valetUrl = lot
    ? `${window.location.origin}/valet/${lot.shortCode}`
    : "";

  if (!lot) {
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
            textAlign: "center",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <p style={{ color: "#64748b" }}>Loading lot info...</p>
        </div>
      </div>
    );
  }

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
          maxWidth: 360,
          textAlign: "center",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 4 }}>
          {lot.name}
        </div>
        <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 16 }}>
          Show this to drivers who can't scan the printed sign
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 12,
          }}
        >
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(driverUrl)}`}
            alt="Parking QR code"
            style={{
              width: 200,
              height: 200,
              borderRadius: 12,
              border: "1px solid #e2e8f0",
            }}
          />
        </div>

        <div
          style={{
            background: "#f8fafc",
            borderRadius: 8,
            padding: "10px 12px",
            marginBottom: 10,
          }}
        >
          <div
            style={{
              fontFamily: "monospace",
              fontSize: 12,
              color: "#1e40af",
              wordBreak: "break-all",
            }}
          >
            {driverUrl}
          </div>
        </div>
        <button
          onClick={() => {
            navigator.clipboard.writeText(driverUrl);
            toast.success("Copied!");
          }}
          style={{
            background: "#1d4ed8",
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: 600,
            fontSize: 13,
            marginBottom: 16,
          }}
        >
          Copy Parking Link
        </button>

        <div style={{ borderTop: "1px dashed #e2e8f0", paddingTop: 14 }}>
          <div style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>
            Prefer valet? Share this link instead:
          </div>
          <div
            style={{
              background: "#f0fdf4",
              borderRadius: 8,
              padding: "8px 10px",
              marginBottom: 10,
            }}
          >
            <div
              style={{
                fontFamily: "monospace",
                fontSize: 11,
                color: "#059669",
                wordBreak: "break-all",
              }}
            >
              {valetUrl}
            </div>
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(valetUrl);
              toast.success("Copied!");
            }}
            style={{
              background: "#059669",
              color: "#fff",
              border: "none",
              padding: "8px 16px",
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 12,
            }}
          >
            Copy Valet Link
          </button>
        </div>

        <button
          onClick={onClose}
          style={{
            display: "block",
            width: "100%",
            background: "transparent",
            color: "#64748b",
            border: "none",
            padding: "12px",
            fontSize: 13,
            cursor: "pointer",
            marginTop: 12,
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}

function ValetCheckInModal({ onClose, onSuccess }) {
  const [token, setToken] = useState("");
  const [booking, setBooking] = useState(null);
  const [spotInput, setSpotInput] = useState("");
  const [looking, setLooking] = useState(false);
  const [checking, setChecking] = useState(false);

  const handleLookup = async (e) => {
    e.preventDefault();
    setLooking(true);
    setBooking(null);
    try {
      const res = await api.get(`/valet/token/${token.trim()}`);
      setBooking(res.data.booking);
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking not found");
    } finally {
      setLooking(false);
    }
  };

  const handleCheckIn = async () => {
    setChecking(true);
    try {
      await api.patch(`/valet/token/${token.trim()}/check-in`, {
        spotNumber: spotInput || null,
      });
      toast.success("Valet checked in!");
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || "Check-in failed");
    } finally {
      setChecking(false);
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
          maxWidth: 380,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 16 }}>
          🎫 Check In Valet Booking
        </div>

        {!booking ? (
          <form onSubmit={handleLookup}>
            <label
              style={{
                display: "block",
                fontSize: 13,
                fontWeight: 600,
                marginBottom: 6,
              }}
            >
              6-Digit Booking Token
            </label>
            <input
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="123456"
              maxLength={6}
              style={{
                width: "100%",
                textAlign: "center",
                letterSpacing: 6,
                fontSize: 20,
                border: "1px solid #d1d5db",
                borderRadius: 10,
                padding: "12px",
                outline: "none",
                boxSizing: "border-box",
                marginBottom: 14,
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
                disabled={looking || token.length !== 6}
                style={{
                  flex: 2,
                  background: "#059669",
                  color: "#fff",
                  border: "none",
                  padding: "12px",
                  borderRadius: 10,
                  fontWeight: 700,
                  cursor: "pointer",
                  opacity: looking || token.length !== 6 ? 0.6 : 1,
                }}
              >
                {looking ? "Looking up..." : "Find Booking"}
              </button>
            </div>
          </form>
        ) : (
          <>
            <div
              style={{
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                borderRadius: 10,
                padding: 14,
                marginBottom: 14,
              }}
            >
              <div style={{ fontWeight: 700 }}>{booking.driverName}</div>
              <div style={{ fontSize: 13, color: "#64748b" }}>
                {booking.driverPhone}
                {booking.plateNumber ? ` • ${booking.plateNumber}` : ""}
              </div>
              <div style={{ fontSize: 13, marginTop: 6 }}>
                Payment:{" "}
                <strong
                  style={{
                    color:
                      booking.paymentStatus === "paid" ? "#16a34a" : "#dc2626",
                  }}
                >
                  {booking.paymentStatus === "paid" ? "✅ Paid" : "❌ Not paid"}
                </strong>
              </div>
              <div style={{ fontSize: 13 }}>
                Status: <strong>{booking.status}</strong>
              </div>
            </div>
            {booking.paymentStatus === "paid" && booking.status === "booked" ? (
              <>
                <input
                  value={spotInput}
                  onChange={(e) => setSpotInput(e.target.value)}
                  placeholder="Spot number (optional)"
                  style={{
                    width: "100%",
                    border: "1px solid #d1d5db",
                    borderRadius: 8,
                    padding: "10px 12px",
                    fontSize: 14,
                    marginBottom: 12,
                    boxSizing: "border-box",
                    outline: "none",
                  }}
                />
                <button
                  onClick={handleCheckIn}
                  disabled={checking}
                  style={{
                    width: "100%",
                    background: "#059669",
                    color: "#fff",
                    border: "none",
                    padding: "13px",
                    borderRadius: 10,
                    fontWeight: 700,
                    fontSize: 15,
                    cursor: "pointer",
                  }}
                >
                  {checking ? "Checking in..." : "✅ Confirm Check-In"}
                </button>
              </>
            ) : (
              <p
                style={{ fontSize: 13, color: "#dc2626", textAlign: "center" }}
              >
                {booking.status !== "booked"
                  ? "This booking has already been used."
                  : "Driver has not completed payment yet."}
              </p>
            )}
            <button
              onClick={() => setBooking(null)}
              style={{
                width: "100%",
                background: "transparent",
                color: "#64748b",
                border: "none",
                padding: "10px",
                fontSize: 13,
                cursor: "pointer",
                marginTop: 8,
              }}
            >
              ← Try another token
            </button>
          </>
        )}
      </div>
    </div>
  );
}
