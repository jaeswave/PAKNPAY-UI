import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../utils/api";
import toast from "react-hot-toast";

export default function ValetVerifyPage() {
  const [searchParams] = useSearchParams();
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const reference = searchParams.get("reference");
    const bookingId = searchParams.get("bookingId");
    api
      .get("/valet/verify", { params: { reference, bookingId } })
      .then((res) => setBooking(res.data.booking))
      .catch(() => {
        setError(true);
        toast.error("Payment verification failed");
      });
  }, []);

  if (error)
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fef2f2",
          padding: 16,
        }}
      >
        <p style={{ color: "#dc2626" }}>
          Could not verify payment. Please contact the parking lot.
        </p>
      </div>
    );

  if (!booking)
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f0fdf4",
        }}
      >
        <p style={{ color: "#64748b" }}>Confirming payment...</p>
      </div>
    );

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
            {booking.token}
          </div>
        </div>
        <p style={{ fontSize: 11, color: "#9ca3af" }}>
          Take a screenshot — you'll need this at the gate
        </p>
      </div>
    </div>
  );
}
