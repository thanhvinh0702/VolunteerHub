// src/components/LoginPage.js
import { useAuth } from "../../hook/useAuth";
import { useNavigate } from "react-router-dom";
import { ROLES } from "../../constant/role";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (role) => {
    login(role);
    navigate("/"); // điều hướng sau đăng nhập
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Đăng nhập giả lập</h2>
      <p>Chọn vai trò để đăng nhập:</p>
      <button onClick={() => handleLogin(ROLES.ADMIN)}>Login as Admin</button>
      <button onClick={() => handleLogin(ROLES.USER)}>Login as User</button>
      <button onClick={() => handleLogin(ROLES.ORG)}>
        Login as Organization
      </button>
    </div>
  );
}
