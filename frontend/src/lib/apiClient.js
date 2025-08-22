import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "";

export const apiClient = axios.create({
    baseURL: baseURL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

export const authApi = {
    async login(credentials) {
        const { data } = await apiClient.post("/auth/login", credentials);
        return data;
    },
    async register(payload) {
        const { data } = await apiClient.post("/auth/register", payload);
        return data;
    },
    async logout() {
        const { data } = await apiClient.post("/auth/logout");
        return data;
    },
    async profile() {
        const { data } = await apiClient.get("/auth/profile");
        return data;
    },
};
