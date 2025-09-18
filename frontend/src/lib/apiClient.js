import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "/api";

export const apiClient = axios.create({
    baseURL: baseURL,
    withCredentials: true,
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

    config.headers = config.headers ?? {};

    if (config.data instanceof FormData) {
        delete config.headers["Content-Type"];
    }

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
    async uploadAvatar(id, file) {
        const formData = new FormData();
        formData.append("avatar", file);

        const { data } = await apiClient.post(
            `/uploads/users/${id}/avatar`,
            formData
        );

        return data;
    },
};

export const uploadsApi = {
    async uploadStudioImages(studioId, files) {
        if (!studioId || !files?.length) {
            throw new Error("Studio ID and files are required");
        }

        const formData = new FormData();
        files.forEach((file) => formData.append("images", file));

        const { data } = await apiClient.post(
            `/uploads/studios/${studioId}/images`,
            formData
        );

        return data;
    },

    async deleteStudioImage(studioId, filename) {
        if (!studioId || !filename) {
            throw new Error("Studio ID and filename are required");
        }

        const { data } = await apiClient.delete(
            `/uploads/studios/${studioId}/images/${encodeURIComponent(filename)}`
        );

        return data;
    },

    async reorderStudioImages(studioId, images) {
        if (!studioId || !Array.isArray(images) || images.length === 0) {
            throw new Error("Studio ID and images array are required");
        }

        const { data } = await apiClient.patch(
            `/uploads/studios/${studioId}/images/order`,
            { images }
        );

        return data;
    },

    async replaceStudioImage(studioId, filename, file) {
        if (!studioId || !filename || !file) {
            throw new Error("Studio ID, filename and file are required");
        }

        const formData = new FormData();
        formData.append("image", file);

        const { data } = await apiClient.put(
            `/uploads/studios/${studioId}/images/${encodeURIComponent(filename)}`,
            formData
        );

        return data;
    },
};
