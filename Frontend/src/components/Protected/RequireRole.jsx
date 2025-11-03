import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hook/useAuth";

const RequireRole = ({ allowedRoles }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return allowedRoles.includes(user.role) ? (
    <Outlet />
  ) : (
    <Navigate to="/unauthorized" replace />
  );
};

export default RequireRole;
