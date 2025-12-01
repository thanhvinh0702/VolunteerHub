import { create } from "zustand";
import { ROLES } from "../constant/role";
import { logout, logout as logoutService } from "../services/authService";

// helper lưu trữ user vào localStorage
const persistUser = (user) => {
    try {
        if (user) localStorage.setItem("user", JSON.stringify(user));
        else localStorage.removeItem("user");
    } catch (err) {
        console.error("Lỗi khi lưu user vào localStorage:", err);
    }
};

// Lấy user từ localStorage khi khởi tạo
const getInitialUser = () => {
    try {
        const userData = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        console.log("==== getInitialUser ====");
        console.log("localStorage user:", userData);
        console.log("localStorage token:", token ? "exists" : "null");

        // Chỉ load user nếu có cả user data VÀ token
        if (userData && token) {
            const parsed = JSON.parse(userData);
            console.log("Parsed user:", parsed);
            return parsed;
        }

        // Nếu không có token hoặc user → chưa login → return null
        console.log("No valid auth data, returning null");
        return null;
    } catch (err) {
        console.error("Lỗi khi đọc user từ localStorage:", err);
        return null;
    }
};

export const useAuthStore = create((set, get) => ({
    user: getInitialUser(),
    loading: false,
    error: null,

    setUser: (user) => {
        persistUser(user);
        set({ user });
    },

    logout: async () => {
        console.log("🟢 [authStore] logout() STARTED");
        try {
            // Gọi backend logout endpoint để invalidate session (gửi cookie)
            console.log("🟢 [authStore] Calling logoutService()...");
            await logout();
            console.log("🟢 [authStore] Done ????? - logoutService completed");
        } catch (error) {
            console.error("🟢 [authStore] Backend logout failed, clearing local data anyway:", error);
            // Continue với local logout dù backend fail
        }

        // Xóa tất cả auth data từ localStorage (always execute)
        console.log("🟢 [authStore] Clearing localStorage...");
        persistUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        // Clear state
        console.log("🟢 [authStore] Clearing Zustand state...");
        set({ user: null, error: null, loading: false });
        console.log("🟢 [authStore] Logout COMPLETED!");
    },

    login: (role) => {
        const demoUser = { name: "Demo User", role };
        persistUser(demoUser);
        set({ user: demoUser });
    },

    hasRole: (role) => get().user?.role === role,
    hasAnyRole: (roles = []) => roles.includes(get().user?.role),
}));

