import axios from "axios";

const registerAuthUser = async (data) => {
    try {
        // Convert role to uppercase for backend enum
        const role = (data.roles).toUpperCase();

        const payload = {
            username: data.username,
            name: data.name,
            email: data.email,
            password: data.password,
            roles: role,
        }
        console.log(payload)
        const res = await axios.post("http://localhost:7070/api/v1/users/register", payload);
        return res.data;
    } catch (error) {
        console.error("Error signing up:", error);
        console.error("Response data:", error.response?.data);
        console.error("Response status:", error.response?.status);

        // Display backend error message if available
        const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Cannot sign up. Please try again later.';
        throw new Error(errorMessage);
    }
};

const logout = async () => {

    try {
        // Lấy token để gửi kèm trong logout request
        const token = localStorage.getItem("token");
        console.log("🔴 [authService] Token found:", token ? "YES" : "NO");

        // Gọi logout endpoint với cookie và token để invalidate session

        const res = await axios.post(
            "http://localhost:7070/logout",
            {},
            {
                withCredentials: true, // Gửi cookie/session với request
                headers: {
                    "Content-Type": "application/json",
                    // Gửi Bearer token nếu backend yêu cầu
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
            }
        );

        return res.data;
    } catch (error) {
        // Nếu endpoint không tồn tại (404), không sao - vẫn clear local
        // Log error nhưng không throw để vẫn tiếp tục clear localStorage
        if (error.response?.status !== 404) {
            console.error("Error logging out:", error);
        } else {
            console.log("Logout endpoint not found (404), continuing anyway");
        }
        // Return success để frontend vẫn clear local storage
        return { message: "Local logout completed" };
    }
};

export { registerAuthUser, logout };
