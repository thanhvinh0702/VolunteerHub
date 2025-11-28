import { create } from "zustand";
import { ROLES } from "../constant/role";

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
        return userData ? JSON.parse(userData) : { name: "Demo User", role: ROLES.ADMIN };
    } catch (err) {
        console.error("Lỗi khi đọc user từ localStorage:", err);
        return { name: "Demo User", role: ROLES.ADMIN };
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

    logout: () => {
        persistUser(null);
        localStorage.removeItem("token"); // Xóa token nếu có
        set({ user: null, error: null });
    },

    login: (role) => {
        const demoUser = { name: "Demo User", role };
        persistUser(demoUser);
        set({ user: demoUser });
    },

    hasRole: (role) => get().user?.role === role,
    hasAnyRole: (roles = []) => roles.includes(get().user?.role),
}));

