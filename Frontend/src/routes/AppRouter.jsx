// src/routes/AppRouter.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import RequireRole from "../components/Protected/RequireRole";
import AdminPage from "../pages/DemoPages/AdminPage";
import UserPage from "../pages/DemoPages/UserPage";
import OrganizationPage from "../pages/DemoPages/OrganizationPage";
import LoginPage from "../pages/DemoPages/LoginPage";
import Unauthorized from "../pages/DemoPages/Unauthorized";
import { ROLES } from "../constant/role";
import MainLayout from "../Layout/MainLayout";
import DashboardShell from "../pages/DashBoard/DashboardShell";
import Overview from "../pages/DashBoard/Overview";
import OpportunitiesTab from "../pages/DashBoard/Opportunities";
import Activity from "../pages/DashBoard/Activity";
import Badges from "../pages/DashBoard/Badges";
import Notifications from "../pages/DashBoard/Notifications";
import OpportunitiesEvent from "../pages/Opportunities/Opportunities";
import OpportunitiePageDetail from "../pages/EventPage/EventLayout";
import EventLayout from "../pages/EventPage/EventLayout";

function AppRouter() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Protected routes */}
      <Route element={<MainLayout />}>
        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Shared protected area */}
        <Route
          element={
            <RequireRole allowedRoles={[ROLES.ADMIN, ROLES.USER, ROLES.ORG]} />
          }
        >
          {/* Dashboard (with nested tabs) */}
          <Route path="/dashboard" element={<DashboardShell />}>
            <Route index element={<Overview />} />
            <Route path="opportunities" element={<OpportunitiesTab />} />
            <Route path="activity" element={<Activity />} />
            <Route path="badges" element={<Badges />} />
            <Route path="notifications" element={<Notifications />} />
          </Route>

          {/* opportunities */}
          <Route path="/opportunities" element={<OpportunitiesEvent />} />
          <Route path="/opportunities/:id" element={<EventLayout />} />
        </Route>

        {/* Admin-only route */}
        <Route element={<RequireRole allowedRoles={[ROLES.ADMIN]} />}>
          <Route path="/admin" element={<AdminPage />} />
        </Route>

        {/* User-only route */}
        <Route element={<RequireRole allowedRoles={[ROLES.USER]} />}>
          <Route path="/user" element={<UserPage />} />
        </Route>

        {/* Organization-only route */}
        <Route element={<RequireRole allowedRoles={[ROLES.ORG]} />}>
          <Route path="/organization" element={<OrganizationPage />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Unauthorized />} />
    </Routes>
  );
}

export default AppRouter;
