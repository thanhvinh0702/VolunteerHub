// demo not real
import { api } from "../utils/api";
import storage from "../utils/storage";

export const authService = {
    login: async (email, password) => {
        const data = await api.post("/auth/login", { email, password });
        if (data.token) storage.setToken(data.token);
        return data;
    },
    logout: () => storage.clearUser()
}