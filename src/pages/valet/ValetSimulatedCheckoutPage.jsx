import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import api from "../../utils/api";
import toast from "react-hot-toast";

export default function ValetSimulatedCheckoutPage() {
  const { bookingId } = useParams();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [confirmedToken, setConfirmedToken] = useState(null);

  const reference = searchParams.get("reference");
  const amount = Number(searchParams.get("amount") || 0);

  const handleOutcome = async (outcome) => {
    setLoading(true);
    try {
      const res = await api.post(`/valet/simulate/${bookingId}`, { outcome });
      if (outcome === "success") {
        toast.success("Simulated valet payment successful");
        setConfirmedToken(res.data.booking.token);
      } else {
        toast.error("Simulated payment failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Simulation failed");
    } finally {
      setLoading(false);
    }
  };

  if (confirmedToken) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f0fdf4",
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
            maxWidth: 380,
            background: "#fff",
            borderRadius: 20,
            padding: 32,
            textAlign: "center",
            boxShadow: "0 4px 24px #0002",
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 8 }}>🎉</div>
          <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 800 }}>
            Booking Confirmed!
          </h2>
          <p style={{ color: "#6b7280", fontSize: 13, marginBottom: 20 }}>
            Show this code to the attendant when you arrive
          </p>
          <div
            style={{
              background: "#f0fdf4",
              border: "2px dashed #059669",
              borderRadius: 14,
              padding: 20,
              marginBottom: 10,
            }}
          >
            <div
              style={{
                fontSize: 40,
                fontWeight: 900,
                letterSpacing: 8,
                color: "#059669",
                fontFamily: "monospace",
              }}
            >
              {confirmedToken}
            </div>
          </div>
          <p style={{ fontSize: 11, color: "#9ca3af" }}>
            Take a screenshot — you'll need this at the gate
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0f1e",
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
          maxWidth: 400,
          background: "#fff",
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: "0 8px 40px #0004",
        }}
      >
        <div
          style={{
            background: "#0a2540",
            padding: "20px 24px",
            textAlign: "center",
            color: "#fff",
          }}
        >
          <div
            style={{
              fontSize: 12,
              letterSpacing: 2,
              color: "#8ab4f8",
              marginBottom: 6,
            }}
          >
            TEST MODE — NOT A REAL PAYMENT
          </div>
          <div style={{ fontSize: 20, fontWeight: 800 }}>
            Simulated Valet Checkout
          </div>
        </div>
        <div style={{ padding: 24 }}>
          <div
            style={{
              background: "#f8fafc",
              borderRadius: 12,
              padding: 18,
              textAlign: "center",
              marginBottom: 20,
            }}
          >
            <div style={{ fontSize: 12, color: "#64748b", marginBottom: 6 }}>
              Valet Fee
            </div>
            <div style={{ fontSize: 36, fontWeight: 900, color: "#1e293b" }}>
              ₦{amount.toLocaleString()}
            </div>
            <div
              style={{
                fontSize: 11,
                color: "#94a3b8",
                marginTop: 8,
                fontFamily: "monospace",
              }}
            >
              Ref: {reference}
            </div>
          </div>
          <button
            onClick={() => handleOutcome("success")}
            disabled={loading}
            style={{
              width: "100%",
              background: loading ? "#86efac" : "#16a34a",
              color: "#fff",
              border: "none",
              padding: "16px",
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 800,
              cursor: loading ? "not-allowed" : "pointer",
              marginBottom: 10,
            }}
          >
            ✅ Simulate Successful Payment
          </button>
          <button
            onClick={() => handleOutcome("failed")}
            disabled={loading}
            style={{
              width: "100%",
              background: "transparent",
              color: "#dc2626",
              border: "2px solid #fca5a5",
              padding: "14px",
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            ❌ Simulate Failed Payment
          </button>
        </div>
      </div>
    </div>
  );
}
