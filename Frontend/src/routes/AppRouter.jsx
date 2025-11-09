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
function AppRouter() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Protected routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route
          element={
            <RequireRole allowedRoles={[ROLES.ADMIN, ROLES.USER, ROLES.ORG]} />
          }
        >
          {/* Dashboard with persistent header and nested content */}
          <Route path="/dashboard" element={<DashboardShell />}>
            <Route index element={<Overview />} />
            <Route path="opportunities" element={<OpportunitiesTab />} />
            <Route path="activity" element={<Activity />} />
            <Route path="badges" element={<Badges />} />
            <Route path="notifications" element={<Notifications />} />
          </Route>
        </Route>
        <Route element={<RequireRole allowedRoles={[ROLES.ADMIN]} />}>
          <Route path="/admin" element={<AdminPage />} />
        </Route>

        <Route element={<RequireRole allowedRoles={[ROLES.USER]} />}>
          <Route path="/user" element={<UserPage />} />
        </Route>

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

// export default function AppRouter() {
//     return (
//       <Routes>
//         <Route path={ROUTES.LOGIN} element={<LoginPage />} />
//         <Route path={ROUTES.UNAUTHORIZED} element={<Unauthorized />} />

//         <Route element={<RequireAuth />}>
//           <Route element={<RequireRole allowedRoles={[ROLES.ADMIN]} />}>
//             <Route path={ROUTES.ADMIN} element={<AdminDashboard />} />
//           </Route>

//           <Route element={<RequireRole allowedRoles={[ROLES.MANAGER]} />}>
//             <Route path={ROUTES.MANAGER} element={<ManagerDashboard />} />
//           </Route>

//           <Route element={<RequireRole allowedRoles={[ROLES.VOLUNTEER]} />}>
//             <Route path={ROUTES.VOLUNTEER} element={<VolunteerDashboard />} />
//           </Route>
//         </Route>
//       </Routes>
//     );
//   }
