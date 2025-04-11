import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Configuration de base de l'API avec RTK Query
export const baseApi = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL || "http://localhost:5000",
        prepareHeaders: (headers) => {
            // Récupérer le token du state ou du localStorage
            const token = localStorage.getItem("token");

            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }

            return headers;
        },
    }),
    tagTypes: ["Studios", "Artists", "Reviews", "Roles", "Users"],
    endpoints: () => ({}),
});
