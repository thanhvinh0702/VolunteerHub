import axios from "axios";

// demo fix later

const useApi = axios.create({
    baseURL: "http://localhost:8081/api/v1/users",
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 5000,
})

const createUserProfile = async (data) => {
    try {
        const res = await useApi.post("/users", {
            authProvider: "local",
            name: data.name,
            email: data.email,
            password: data.password,
            confirmPassword: data.confirmPassword,
            role: data.role || "USER",
            bio: data.bio || "https://api.dicebear.com/7.x/avataaars/svg?seed=b",
            avatarUrl: data.avatarUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=b",
            preferences: data.preferences ? JSON.parse(data.preferences) : {},
        });
        return res.data;
    } catch (error) {
        console.error("Error creating user profile:", error);
        throw new Error('Cannot create user profile. Please try again later.');
    }
}

export { createUserProfile };