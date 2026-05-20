import { Routes, Route } from "react-router-dom";
import LandingPage from "../features/landing/pages/LandingPage";
import LoginPage from "../features/auth/pages/LoginPage";
import SignupPages from "../features/auth/pages/SignupPages";
import ResetPasswordPage from "../features/auth/pages/ResetPasswordPage";
import DashboardHome from "../features/dashboard/pages/DashboardHome";
import AqariStorePage from "../features/aqari-store/pages/AqariStorePage";
import ShowPropertyPage from "../features/aqari-store/pages/ShowPropertyPage";
import OwnersPage from "../features/dashboard/pages/OwnersPage";
import PropertyPage from "../features/dashboard/pages/PropertyPage";
import ProtectedRoute from "../features/auth/components/ProtectedRoute";
import MessagesPage from "../features/dashboard/pages/MessagesPage";
import DashboardLayout from "../shared/layout/DashboardLayout";
import PublicLayout from "../shared/layout/PublicLayout";
import AdminProfilePage from "../features/dashboard/pages/AdminProfilePage";
import AddPropertyPage from "../features/properties/pages/AddPropertyPage";
import LeadsPage from "../features/leads/pages/LeadsPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPages />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      <Route path="/" element={<PublicLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="aqari-store" element={<AqariStorePage />} />
        <Route path="property/:id" element={<ShowPropertyPage />} />
        <Route path="add-property" element={<AddPropertyPage />} />
      </Route>

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="owners" element={<OwnersPage />} />
        <Route path="property" element={<PropertyPage />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="leads" element={<LeadsPage />} />
        <Route path="profile" element={<AdminProfilePage />} />
      </Route>
    </Routes>
  );
}
