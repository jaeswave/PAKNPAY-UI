import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../utils/api";
import toast from "react-hot-toast";

export default function ValetBookingPage() {
  const { lotCode } = useParams();
  const [lot, setLot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    driverName: "",
    driverPhone: "",
    plateNumber: "",
  });

  useEffect(() => {
    api
      .get(`/lots/code/${lotCode}`)
      .then((res) => setLot(res.data.lot))
      .catch(() => toast.error("Parking lot not found"))
      .finally(() => setLoading(false));
  }, [lotCode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post("/valet/book", { lotCode, ...form });
      window.location.href = res.data.authorizationUrl;
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed");
      setSubmitting(false);
    }
  };

  if (loading)
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
        <p style={{ color: "#64748b" }}>Loading...</p>
      </div>
    );
  if (!lot)
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fef2f2",
        }}
      >
        <p style={{ color: "#dc2626" }}>Parking lot not found</p>
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
          maxWidth: 420,
          background: "#fff",
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: "0 4px 24px #0002",
        }}
      >
        <div
          style={{
            background: "#059669",
            padding: "28px 24px",
            textAlign: "center",
            color: "#fff",
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 8 }}>🎫</div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>
            Book Valet Parking
          </h1>
          <p style={{ margin: "6px 0 0", color: "#bbf7d0", fontSize: 13 }}>
            {lot.name} — pay now, hand over your car token on arrival
          </p>
        </div>
        <form onSubmit={handleSubmit} style={{ padding: 24 }}>
          <div
            style={{
              background: "#f0fdf4",
              borderRadius: 10,
              padding: 14,
              textAlign: "center",
              marginBottom: 20,
            }}
          >
            <div style={{ fontSize: 12, color: "#64748b" }}>Valet Fee</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: "#059669" }}>
              ₦{lot.valetFee?.toLocaleString()}
            </div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label
              style={{
                display: "block",
                fontSize: 13,
                fontWeight: 600,
                marginBottom: 5,
              }}
            >
              Full Name
            </label>
            <input
              required
              value={form.driverName}
              onChange={(e) => setForm({ ...form, driverName: e.target.value })}
              style={{
                width: "100%",
                border: "1px solid #d1d5db",
                borderRadius: 10,
                padding: "12px 14px",
                fontSize: 15,
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label
              style={{
                display: "block",
                fontSize: 13,
                fontWeight: 600,
                marginBottom: 5,
              }}
            >
              Phone Number
            </label>
            <input
              required
              type="tel"
              value={form.driverPhone}
              onChange={(e) =>
                setForm({ ...form, driverPhone: e.target.value })
              }
              placeholder="08012345678"
              style={{
                width: "100%",
                border: "1px solid #d1d5db",
                borderRadius: 10,
                padding: "12px 14px",
                fontSize: 15,
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label
              style={{
                display: "block",
                fontSize: 13,
                fontWeight: 600,
                marginBottom: 5,
              }}
            >
              Plate Number{" "}
              <span style={{ color: "#9ca3af", fontWeight: 400 }}>
                (optional)
              </span>
            </label>
            <input
              value={form.plateNumber}
              onChange={(e) =>
                setForm({ ...form, plateNumber: e.target.value.toUpperCase() })
              }
              style={{
                width: "100%",
                border: "1px solid #d1d5db",
                borderRadius: 10,
                padding: "12px 14px",
                fontSize: 15,
                textTransform: "uppercase",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            style={{
              width: "100%",
              background: "#059669",
              color: "#fff",
              border: "none",
              padding: "16px",
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 800,
              cursor: "pointer",
              opacity: submitting ? 0.7 : 1,
            }}
          >
            {submitting
              ? "Processing..."
              : `Pay ₦${lot.valetFee?.toLocaleString()} & Book →`}
          </button>
          <p
            style={{
              textAlign: "center",
              fontSize: 11,
              color: "#9ca3af",
              marginTop: 12,
            }}
          >
            You'll get a 6-digit token to show the attendant when you arrive
          </p>
        </form>
      </div>
    </div>
  );
}
