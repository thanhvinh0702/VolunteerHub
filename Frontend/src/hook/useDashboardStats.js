// src/hook/useDashboardStats.js
import { useQueries } from "@tanstack/react-query";
import axiosClient from "../services/axiosClient";
import { dashboardConfig } from "../constant/dashboardConfig";
// --- 1. ĐỊNH NGHĨA DỮ LIỆU GIẢ ---
const MOCK_API_RESPONSES = {
    // USER
    "/api/v1/users/users/me": { value: 150, unit: " hrs" },
    "/api/v1/users/users/me/events-completed": { value: 25 },

    "/api/v1/users/users/me/this-month": { value: 12 },

    // MANAGER
    "/api/v1/users/users/me/total-events": { value: 8 },
    "/api/v1/users/users/me/active-events": { value: 3 },
    "/api/v1/users/users/me/total-volunteers": { value: 42 },
    "/api/v1/users/users/me/pending-applications": { value: 7 },

    // ADMIN
    "/api/v1/users/admin/all-users": { value: 1024 },
    "/api/v1/users/admin/active-organizations": { value: 45 },
    "/api/v1/users/admin/active-events": { value: 12 },
};

// --- 2. HÀM FETCH THÔNG MINH (Chuyển đổi giữa Mock và Real) ---
const fetchCardData = async (endpoint) => {
    const USE_MOCK = true; // <--- Đổi thành false khi có API thật

    if (USE_MOCK) {
        // Giả lập độ trễ mạng (Network Delay) 1.5 giây để test Skeleton
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const data = MOCK_API_RESPONSES[endpoint];

                // Giả lập lỗi ngẫu nhiên (Optional - để test Error State)
                //if (Math.random() > 0.1) reject(new Error("Lỗi mạng giả lập"));

                if (data) {
                    resolve(data);
                } else {
                    // Fallback nếu quên chưa định nghĩa mock cho endpoint nào đó
                    resolve({ value: 0 });
                }
            }, 1500);
        });
    }

    // Khi USE_MOCK = false, nó sẽ gọi axios thật
    return await axiosClient.get(endpoint);
};

// --- 3. HOOK CHÍNH (Giữ nguyên logic cũ) ---
export const useDashboardStats = (role) => {
    const roleConfig = dashboardConfig[role?.toUpperCase()] || [];

    const queryResults = useQueries({
        queries: roleConfig.map((card) => ({
            // Dùng endpoint làm key luôn cho tiện
            queryKey: ["dashboard", role, card.endpoint],
            queryFn: () => fetchCardData(card.endpoint),
            staleTime: 5 * 60 * 1000,

            // Select dữ liệu: Ưu tiên lấy value từ API
            select: (data) => data?.value ?? data,
        })),
    });

    const mergedData = roleConfig.map((cardConfig, index) => {
        const result = queryResults[index];

        return {
            ...cardConfig,
            value: result.data, // Dữ liệu từ Mock hoặc API
            isLoading: result.isLoading,
            isError: result.isError,
            error: result.error,
            refetch: result.refetch,
        };
    });

    return mergedData;
};