import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hook/useAuth";

const RequireRole = ({ allowedRoles }) => {
  const { user } = useAuth();

  console.log("==== RequireRole Check ====");
  console.log("User:", user);
  console.log("User role:", user?.role);
  console.log("Allowed roles:", allowedRoles);
  console.log("Role match:", allowedRoles?.includes(user?.role));

  if (!user) {
    console.log("No user found, redirecting to landing page");
    return <Navigate to="/" replace />;
  }

  const hasAccess = allowedRoles.includes(user.role);

  if (!hasAccess) {
    console.log("Access denied! Redirecting to unauthorized");
  }

  return hasAccess ? <Outlet /> : <Navigate to="/" replace />;
};

export default RequireRole;
