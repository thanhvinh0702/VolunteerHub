// src/routes/AppRouter.jsx
import { Routes, Route } from "react-router-dom";
import RequireRole from "../components/Protected/RequireRole";
import AdminPage from "../pages/DemoPages/AdminPage";
import UserPage from "../pages/DemoPages/UserPage";
import OrganizationPage from "../pages/DemoPages/OrganizationPage";
import LoginPage from "../pages/DemoPages/LoginPage";
import Unauthorized from "../pages/DemoPages/Unauthorized";
import { ROLES } from "../constant/role";

function AppRouter() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Protected routes */}
      <Route element={<RequireRole allowedRoles={[ROLES.ADMIN]} />}>
        <Route path="/admin" element={<AdminPage />} />
      </Route>

      <Route element={<RequireRole allowedRoles={[ROLES.USER]} />}>
        <Route path="/user" element={<UserPage />} />
      </Route>

      <Route element={<RequireRole allowedRoles={[ROLES.ORG]} />}>
        <Route path="/organization" element={<OrganizationPage />} />
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
