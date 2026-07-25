import { useAuth } from "../context/AuthContext";

export default function PendingApprovalPage() {
  const { attendant, logout } = useAuth();
  const rejected = attendant?.lotApprovalStatus === "rejected";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
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
          maxWidth: 420,
          background: "#fff",
          borderRadius: 20,
          padding: 36,
          textAlign: "center",
          boxShadow: "0 4px 24px #0001",
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 12 }}>
          {rejected ? "❌" : "⏳"}
        </div>
        <h2
          style={{
            margin: "0 0 8px",
            fontSize: 20,
            fontWeight: 800,
            color: rejected ? "#dc2626" : "#1e40af",
          }}
        >
          {rejected ? "Application Not Approved" : "Waiting for Approval"}
        </h2>
        <p
          style={{
            color: "#6b7280",
            fontSize: 14,
            lineHeight: 1.6,
            marginBottom: 24,
          }}
        >
          {rejected
            ? "Your parking lot's registration was not approved. Please contact support for details."
            : "Your parking lot is under review. Once our team approves it, you'll be able to access your dashboard and start accepting drivers. This usually doesn't take long — check back shortly."}
        </p>
        <button
          onClick={logout}
          style={{
            background: "#f1f5f9",
            color: "#374151",
            border: "none",
            padding: "12px 24px",
            borderRadius: 10,
            fontWeight: 600,
            cursor: "pointer",
            fontSize: 14,
          }}
        >
          Log Out
        </button>
      </div>
    </div>
  );
}
