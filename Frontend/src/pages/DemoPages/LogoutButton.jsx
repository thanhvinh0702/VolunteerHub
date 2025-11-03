import React from "react";
import { useAuth } from "../../hook/useAuth";
import { useNavigate } from "react-router-dom";

function LogoutButton() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <button onClick={handleLogout} style={{ marginTop: 20 }}>
      🚪 Logout
    </button>
  );
}

export default LogoutButton;
