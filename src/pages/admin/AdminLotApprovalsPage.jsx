import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import adminApi from "../../utils/adminApi";
import toast from "react-hot-toast";

export default function AdminLotApprovalsPage() {
  const navigate = useNavigate();
  const [lots, setLots] = useState([]);
  const [filter, setFilter] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [reviewing, setReviewing] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("parkpay_admin_token")) {
      navigate("/admin/login");
      return;
    }
    fetchLots();
  }, [filter]);

  const fetchLots = async () => {
    setLoading(true);
    try {
      const res = await adminApi.get(`/lots/admin/all?status=${filter}`);
      setLots(res.data.lots || []);
    } catch {
      toast.error("Failed to load lots");
      console.log()
    } finally {
      setLoading(false);
    }
  };``

  const handleReview = async (id, decision) => {
    setReviewing(true);
    try {
      await adminApi.patch(`/lots/${id}/review`, {
        decision,
        rejectionReason: decision === "rejected" ? rejectionReason : "",
      });
      toast.success(`Lot ${decision}`);
      setSelected(null);
      setRejectionReason("");
      fetchLots();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally {
      setReviewing(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("parkpay_admin_token");
    navigate("/admin/login");
  };

  const STATUS_COLORS = {
    pending: "#f59e0b",
    approved: "#10b981",
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
            <div style={{ fontWeight: 800, fontSize: 16 }}>Lot Approvals</div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
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
              Commissions
            </button>
            <button
              onClick={() => navigate("/admin/settlements")}
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
              Settlements
            </button>
            <button
              onClick={logout}
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
              Logout
            </button>
          </div>
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
          {["pending", "approved", "rejected"].map((f) => (
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
              {f}
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
          ) : lots.length === 0 ? (
            <p style={{ textAlign: "center", color: "#94a3b8", padding: 40 }}>
              No {filter} lots
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {lots.map((lot) => (
                <div
                  key={lot._id}
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: 10,
                    padding: "14px 16px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: 8,
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700 }}>{lot.name}</div>
                      <div style={{ fontSize: 12, color: "#64748b" }}>
                        {lot.address}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "#64748b",
                          fontFamily: "monospace",
                          marginTop: 4,
                        }}
                      >
                        Code: {lot.shortCode} • ₦{lot.ratePerHour}/hr •{" "}
                        {lot.totalSpots} spots
                      </div>
                      <div
                        style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}
                      >
                        Applied{" "}
                        {new Date(lot.createdAt).toLocaleDateString("en-NG", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                      {lot.rejectionReason && (
                        <div
                          style={{
                            fontSize: 12,
                            color: "#dc2626",
                            marginTop: 4,
                          }}
                        >
                          Reason: {lot.rejectionReason}
                        </div>
                      )}
                    </div>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
                    >
                      <span
                        style={{
                          background: STATUS_COLORS[lot.approvalStatus] + "22",
                          color: STATUS_COLORS[lot.approvalStatus],
                          padding: "4px 12px",
                          borderRadius: 20,
                          fontSize: 11,
                          fontWeight: 700,
                          textTransform: "capitalize",
                        }}
                      >
                        {lot.approvalStatus}
                      </span>
                      {lot.approvalStatus === "pending" && (
                        <button
                          onClick={() =>
                            setSelected(selected === lot._id ? null : lot._id)
                          }
                          style={{
                            background: "#0a2540",
                            color: "#fff",
                            border: "none",
                            padding: "8px 14px",
                            borderRadius: 8,
                            fontSize: 12,
                            cursor: "pointer",
                            fontWeight: 600,
                          }}
                        >
                          Review
                        </button>
                      )}
                    </div>
                  </div>

                  {selected === lot._id && (
                    <div
                      style={{
                        marginTop: 14,
                        paddingTop: 14,
                        borderTop: "1px dashed #e2e8f0",
                      }}
                    >
                      <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Rejection reason (only needed if rejecting)"
                        rows={2}
                        style={{
                          width: "100%",
                          border: "1px solid #d1d5db",
                          borderRadius: 8,
                          padding: 10,
                          fontSize: 13,
                          outline: "none",
                          boxSizing: "border-box",
                          marginBottom: 10,
                          fontFamily: "inherit",
                        }}
                      />
                      <div style={{ display: "flex", gap: 10 }}>
                        <button
                          onClick={() => handleReview(lot._id, "rejected")}
                          disabled={reviewing}
                          style={{
                            flex: 1,
                            background: "#fee2e2",
                            color: "#dc2626",
                            border: "none",
                            padding: "10px",
                            borderRadius: 8,
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleReview(lot._id, "approved")}
                          disabled={reviewing}
                          style={{
                            flex: 1,
                            background: "#16a34a",
                            color: "#fff",
                            border: "none",
                            padding: "10px",
                            borderRadius: 8,
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          ✅ Approve
                        </button>
                      </div>
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
