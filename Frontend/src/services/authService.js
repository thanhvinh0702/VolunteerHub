import axios from "axios";

const useApi = axios.create({
    baseURL: "http://localhost:7070/api/v1/users",
    header: {
        "Content-Type": "application/json",
    },
    timeout: 5000,
})

const registerAuthUser = async (data) => {
    try {
        // Convert role to uppercase for backend enum
        const role = (data.role || "USER").toUpperCase();

        const payload = {
            username: data.username,
            name: data.name,
            email: data.email,
            password: data.password,
            roles: role,
        };

        console.log("Sending payload:", payload);
        const res = await useApi.post("/register", payload);
        return res.data;
    } catch (error) {
        console.error("Error signing up:", error);
        console.error("Response data:", error.response?.data);
        console.error("Response status:", error.response?.status);

        // Display backend error message if available
        const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Cannot sign up. Please try again later.';
        throw new Error(errorMessage);
    }
}

export { registerAuthUser };