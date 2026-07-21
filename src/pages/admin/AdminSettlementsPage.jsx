import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import adminApi from "../../utils/adminApi";
import toast from "react-hot-toast";

export default function AdminSettlementsPage() {
  const navigate = useNavigate();
  const [settlements, setSettlements] = useState([]);
  const [filter, setFilter] = useState("pending_review");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const [reviewNote, setReviewNote] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("parkpay_admin_token")) {
      navigate("/admin/login");
      return;
    }
    fetchSettlements();
  }, [filter]);

  const fetchSettlements = async () => {
    setLoading(true);
    try {
      const res = await adminApi.get(`/settlements?status=${filter}`);
      setSettlements(res.data.settlements || []);
    } catch {
      toast.error("Failed to load settlements");
    } finally {
      setLoading(false);
    }
  };

  const openDetail = async (id) => {
    setLoadingDetail(true);
    try {
      const res = await adminApi.get(`/settlements/${id}`);
      setSelected(res.data.settlement);
      setReviewNote("");
    } catch {
      toast.error("Failed to load settlement");
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleReview = async (decision) => {
    setReviewing(true);
    try {
      await adminApi.patch(`/settlements/${selected._id}/review`, {
        decision,
        reviewNote,
      });
      toast.success(`Settlement ${decision}`);
      setSelected(null);
      fetchSettlements();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally {
      setReviewing(false);
    }
  };

  const STATUS_COLORS = {
    pending_review: "#f59e0b",
    confirmed: "#10b981",
    rejected: "#dc2626",
  };

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
          background: "#0a2540",
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
            padding: "16px 0",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 22 }}>🛡️</span>
            <div style={{ fontWeight: 800, fontSize: 16 }}>Settlements</div>
          </div>
          <button
            onClick={() => navigate("/admin/commissions")}
            style={{
              background: "transparent",
              color: "#8ab4f8",
              border: "1px solid #1e3a5f",
              padding: "8px 14px",
              borderRadius: 8,
              cursor: "pointer",
              fontSize: 12,
            }}
          >
            ← Commissions
          </button>
        </div>
      </div>

      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "clamp(16px, 4vw, 24px)",
        }}
      >
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {["pending_review", "confirmed", "rejected"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "8px 16px",
                borderRadius: 20,
                border: filter === f ? "none" : "1px solid #e2e8f0",
                background: filter === f ? "#0a2540" : "#fff",
                color: filter === f ? "#fff" : "#64748b",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                textTransform: "capitalize",
              }}
            >
              {f.replace("_", " ")}
            </button>
          ))}
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: 14,
            padding: 20,
            boxShadow: "0 1px 8px #0001",
          }}
        >
          {loading ? (
            <p style={{ textAlign: "center", color: "#94a3b8", padding: 40 }}>
              Loading...
            </p>
          ) : settlements.length === 0 ? (
            <p style={{ textAlign: "center", color: "#94a3b8", padding: 40 }}>
              No {filter.replace("_", " ")} settlements
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {settlements.map((s) => (
                <button
                  key={s._id}
                  onClick={() => openDetail(s._id)}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: 10,
                    padding: "14px 16px",
                    cursor: "pointer",
                    textAlign: "left",
                    flexWrap: "wrap",
                    gap: 8,
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700 }}>{s.lotName}</div>
                    <div style={{ fontSize: 12, color: "#64748b" }}>
                      {new Date(s.createdAt).toLocaleString("en-NG", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <div style={{ fontWeight: 800, fontSize: 16 }}>
                      ₦{s.amount.toLocaleString()}
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
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {(selected || loadingDetail) && (
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
          onClick={() => setSelected(null)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: 24,
              width: "100%",
              maxWidth: 440,
              maxHeight: "90vh",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {loadingDetail ? (
              <p style={{ textAlign: "center", padding: 40, color: "#94a3b8" }}>
                Loading...
              </p>
            ) : (
              selected && (
                <>
                  <div
                    style={{ fontWeight: 800, fontSize: 17, marginBottom: 4 }}
                  >
                    {selected.lotName}
                  </div>
                  <div
                    style={{
                      fontSize: 24,
                      fontWeight: 900,
                      color: "#0a2540",
                      marginBottom: 14,
                    }}
                  >
                    ₦{selected.amount.toLocaleString()}
                  </div>
                  {selected.transferNote && (
                    <div
                      style={{
                        background: "#f8fafc",
                        borderRadius: 10,
                        padding: 12,
                        fontSize: 13,
                        marginBottom: 14,
                      }}
                    >
                      <strong>Note:</strong> {selected.transferNote}
                    </div>
                  )}
                  {selected.receiptImage && (
                    <img
                      src={selected.receiptImage}
                      alt="Receipt"
                      style={{
                        width: "100%",
                        borderRadius: 10,
                        marginBottom: 16,
                        maxHeight: 320,
                        objectFit: "contain",
                        background: "#f8fafc",
                      }}
                    />
                  )}
                  {selected.status === "pending_review" ? (
                    <>
                      <textarea
                        value={reviewNote}
                        onChange={(e) => setReviewNote(e.target.value)}
                        placeholder="Optional note (e.g. reason for rejection)"
                        rows={2}
                        style={{
                          width: "100%",
                          border: "1px solid #d1d5db",
                          borderRadius: 10,
                          padding: 10,
                          fontSize: 13,
                          outline: "none",
                          boxSizing: "border-box",
                          marginBottom: 14,
                          fontFamily: "inherit",
                        }}
                      />
                      <div style={{ display: "flex", gap: 10 }}>
                        <button
                          onClick={() => handleReview("rejected")}
                          disabled={reviewing}
                          style={{
                            flex: 1,
                            background: "#fee2e2",
                            color: "#dc2626",
                            border: "none",
                            padding: "12px",
                            borderRadius: 10,
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleReview("confirmed")}
                          disabled={reviewing}
                          style={{
                            flex: 1,
                            background: "#16a34a",
                            color: "#fff",
                            border: "none",
                            padding: "12px",
                            borderRadius: 10,
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          Confirm Received
                        </button>
                      </div>
                    </>
                  ) : (
                    <div
                      style={{
                        textAlign: "center",
                        padding: 10,
                        color: STATUS_COLORS[selected.status],
                        fontWeight: 700,
                        textTransform: "capitalize",
                      }}
                    >
                      {selected.status.replace("_", " ")}
                    </div>
                  )}
                </>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
