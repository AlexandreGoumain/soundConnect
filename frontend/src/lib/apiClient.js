import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "/api";

export const apiClient = axios.create({
    baseURL: baseURL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// CSRF token management
let csrfToken = null;
let csrfFetching = null;

async function ensureCsrfToken() {
    if (csrfToken) return csrfToken;

    if (!csrfFetching) {
        csrfFetching = apiClient
            .get("/csrf-token")
            .then((res) => {
                csrfToken = res?.data?.data?.csrfToken || null;
                return csrfToken;
            })
            .finally(() => {
                csrfFetching = null;
            });
    }

    return csrfFetching;
}

// Attach CSRF token automatically for mutating requests
apiClient.interceptors.request.use(async (config) => {
    const method = (config.method || "get").toLowerCase();
    const needsCsrf = ["post", "put", "patch", "delete"].includes(method);

    if (needsCsrf && !config.headers["X-CSRF-Token"]) {
        const token = await ensureCsrfToken();
        if (token) {
            config.headers["X-CSRF-Token"] = token;
        }
    }
    return config;
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
    async updateProfile(payload) {
        const { data } = await apiClient.put("/auth/profile", payload);
        return data;
    },
    async changePassword(id, payload) {
        const { data } = await apiClient.put(`/users/${id}/password`, payload);
        return data;
    },
};
