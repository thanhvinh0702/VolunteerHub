import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { LOGIN_LINK } from "../../constant/constNavigate";
import { ROLES } from "../../constant/role";
import storage from "../../utils/storage";

export default function OAuth2Callback() {
  const [searchParams] = useSearchParams();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const [hasProcessed, setHasProcessed] = useState(false);

  useEffect(() => {
    // Prevent multiple executions (React Strict Mode)
    if (hasProcessed) {
      return;
    }

    const handleCallback = async () => {
      setHasProcessed(true);
      const code = searchParams.get("code");
      const errorParam = searchParams.get("error");

      // Check for OAuth2 error
      if (errorParam) {
        setError(`Authentication failed: ${errorParam}`);
        setLoading(false);
        setTimeout(() => (window.location.href = LOGIN_LINK), 3000);
        return;
      }

      // Check for authorization code
      if (!code) {
        setError("No authorization code received");
        setLoading(false);
        setTimeout(() => (window.location.href = LOGIN_LINK), 3000);
        return;
      }

      try {
        console.log("Exchanging authorization code for token...");

        // Exchange code for token
        const tokenResponse = await fetch(
          "http://localhost:7070/oauth2/token",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              // Basic Auth: base64(client_id:client_secret)
              Authorization:
                "Basic " +
                btoa(
                  "7fcdbb6c-fc1d-4921-a52d-0466557b6132:f584278e-be8a-4f55-9c64-8e7be8f9e846"
                ),
            },
            body: new URLSearchParams({
              grant_type: "authorization_code",
              code: code,
              redirect_uri:
                "http://localhost:3000/login/oauth2/code/volunteerhub",
            }),
          }
        );

        if (!tokenResponse.ok) {
          const errorData = await tokenResponse.json();
          console.error("Token exchange failed:", errorData);
          throw new Error(
            errorData.error_description || "Failed to exchange code for token"
          );
        }

        const tokenData = await tokenResponse.json();
        console.log("Token received successfully");

        // Save tokens using storage utility
        storage.setToken(tokenData.access_token);
        if (tokenData.refresh_token) {
          localStorage.setItem("refresh_token", tokenData.refresh_token);
        }

        // Decode JWT to get user info
        const userInfo = parseJwt(tokenData.access_token);
        console.log("User info from token:", userInfo);

        // Extract role from authorities array
        const role = userInfo.roles?.[0]?.role;

        // Validate role - only allow ADMIN, USER, MANAGER
        const allowedRoles = [ROLES.ADMIN, ROLES.USER, ROLES.MANAGER];
        if (!role || !allowedRoles.includes(role)) {
          console.error("Invalid or unauthorized role:", role);
          throw new Error("Unauthorized role. Only ADMIN, USER, and MANAGER roles are allowed.");
        }

        // Update auth store
        const user = {
          id: userInfo.user_id || userInfo.sub,
          name: userInfo.name,
          email: userInfo.email,
          role: role,
        };
        console.log(user);

        console.log("==== DEBUG: Setting user to Zustand ====");
        console.log("User object:", user);
        console.log("User role:", user.role);

        setUser(user);

        console.log("User logged in:", user);

        // Redirect to dashboard
        setTimeout(() => {
          navigate("/dashboard");
        }, 500);
      } catch (err) {
        console.error("OAuth2 callback error:", err);
        setError(
          err.message || "Failed to complete authentication. Please try again."
        );
        setLoading(false);
        setTimeout(() => (window.location.href = LOGIN_LINK), 3000);
      }
    };

    handleCallback();
  }, [searchParams, navigate, setUser, hasProcessed]);

  // Helper to decode JWT
  const parseJwt = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        window
          .atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error("Error parsing JWT:", e);
      return {};
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
        {error ? (
          <div className="text-center">
            <div className="mb-4">
              <svg
                className="mx-auto h-16 w-16 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Authentication Error
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <p className="text-sm text-gray-500">Redirecting to login...</p>
          </div>
        ) : loading ? (
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <svg
                className="animate-spin h-16 w-16 text-indigo-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Completing Sign In...
            </h2>
            <p className="text-gray-600">Please wait while we log you in</p>
          </div>
        ) : (
          <div className="text-center">
            <div className="mb-4">
              <svg
                className="mx-auto h-16 w-16 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Success!
            </h2>
            <p className="text-gray-600">Redirecting to dashboard...</p>
          </div>
        )}
      </div>
    </div>
  );
}
