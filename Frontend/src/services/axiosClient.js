import axios from "axios";
// Import store để dùng hàm logout khi token hết hạn
import { useAuth } from "../hook/useAuth";
const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api", // Thay bằng URL API của bạn
    headers: {
        "Content-Type": "application/json",
    },
});

//REQUEST INTERCEPTOR
axiosClient.interceptors.request.use(
    (config) => {
        // Lấy token từ localStorage (giống cách bạn làm trong getInitialUser)
        const token = localStorage.getItem("token");
        console.log(token);
        if (token) {
            // Gắn token vào header Authorization theo chuẩn Bearer
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

//RESPONSE INTERCEPTOR (Nhận về)
axiosClient.interceptors.response.use(
    (response) => {
        return response.data;
    },
    async (error) => {
        const originalRequest = error.config;

        // Kiểm tra nếu lỗi là 401 (Unauthorized) và chưa từng retry request này
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            console.warn("Token hết hạn hoặc không hợp lệ. Đang logout...");

            // GỌI HÀM LOGOUT TỪ ZUSTAND STORE
            await useAuth.logout();

            //Điều hướng về trang landing
            window.location.href = "/";
        }

        return Promise.reject(error);
    }
);

export default axiosClient;