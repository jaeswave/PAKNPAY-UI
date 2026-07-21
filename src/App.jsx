import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";

import LandingPage from "./pages/LandingPage";
import ScanPage from "./pages/driver/ScanPage";
import SessionPage from "./pages/driver/SessionPage";
import SimulatedCheckoutPage from "./pages/driver/SimulatedCheckoutPage";
import ReceiptPage from "./pages/driver/ReceiptPage";
import LoginPage from "./pages/attendant/LoginPage";
import SignupPage from "./pages/attendant/SignupPage";
import DashboardPage from "./pages/attendant/DashboardPage";
import ManualEntryPage from "./pages/attendant/ManualEntryPage";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import SettingsPage from "./pages/owner/SettingsPage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminCommissionsPage from "./pages/admin/AdminCommissionsPage";
import AdminSettlementsPage from "./pages/admin/AdminSettlementsPage";
import ValetBookingPage from "./pages/valet/ValetBookingPage";
import ValetSimulatedCheckoutPage from "./pages/valet/ValetSimulatedCheckoutPage";
import ValetVerifyPage from "./pages/valet/ValetVerifyPage";

const ProtectedRoute = ({ children, ownerOnly = false }) => {
  const { attendant, loading } = useAuth();
  if (loading)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          fontSize: 16,
          color: "#64748b",
        }}
      >
        Loading...
      </div>
    );
  if (!attendant) return <Navigate to="/attendant/login" />;
  if (ownerOnly && attendant.role !== "owner")
    return <Navigate to="/attendant/dashboard" />;
  return children;
};

const ProtectedAdminRoute = ({ children }) => {
  const token = localStorage.getItem("parkpay_admin_token");
  if (!token) return <Navigate to="/admin/login" />;
  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/park/:lotCode" element={<ScanPage />} />
          <Route path="/session/:token" element={<SessionPage />} />
          <Route
            path="/pay/simulate/:token"
            element={<SimulatedCheckoutPage />}
          />
          <Route path="/pay/verify" element={<ReceiptPage />} />
          <Route path="/receipt/:token" element={<ReceiptPage />} />

          <Route path="/valet/:lotCode" element={<ValetBookingPage />} />
          <Route
            path="/valet/simulate/:bookingId"
            element={<ValetSimulatedCheckoutPage />}
          />
          <Route path="/valet/verify" element={<ValetVerifyPage />} />

          <Route path="/attendant/login" element={<LoginPage />} />
          <Route path="/attendant/signup" element={<SignupPage />} />

          <Route
            path="/attendant/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/attendant/manual"
            element={
              <ProtectedRoute>
                <ManualEntryPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/owner/dashboard"
            element={
              <ProtectedRoute ownerOnly>
                <OwnerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/settings"
            element={
              <ProtectedRoute ownerOnly>
                <SettingsPage />
              </ProtectedRoute>
            }
          />

          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin/commissions"
            element={
              <ProtectedAdminRoute>
                <AdminCommissionsPage />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/settlements"
            element={
              <ProtectedAdminRoute>
                <AdminSettlementsPage />
              </ProtectedAdminRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
