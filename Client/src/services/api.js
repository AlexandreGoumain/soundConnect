import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Création de l'API avec RTK Query
export const api = createApi({
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
    endpoints: (builder) => ({
        // Roles
        createRole: builder.mutation({
            query: (role) => ({
                url: "/roles",
                method: "POST",
                body: role,
            }),
            invalidatesTags: ["Roles"],
        }),
        getRoles: builder.query({
            query: () => "/roles",
            transformResponse: (response) => response.roles || [],
            providesTags: ["Roles"],
        }),
        deleteRole: builder.mutation({
            query: (id) => ({
                url: `/roles/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Roles"],
        }),
        updateRole: builder.mutation({
            query: ({ id, ...role }) => ({
                url: `/roles/${id}`,
                method: "PUT",
                body: role,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "Roles", id }],
        }),

        // Users
        createUser: builder.mutation({
            query: (user) => ({
                url: "/users",
                method: "POST",
                body: user,
            }),
            invalidatesTags: ["Users"],
        }),
        getUsers: builder.query({
            query: () => "/users",
            transformResponse: (response) => response.users || [],
            providesTags: ["Users"],
        }),
        getUserById: builder.query({
            query: (id) => `/users/${id}`,
            transformResponse: (response) => response.user || null,
            providesTags: (result, error, id) => [{ type: "Users", id }],
        }),
        updateUser: builder.mutation({
            query: ({ id, ...user }) => ({
                url: `/users/${id}`,
                method: "PUT",
                body: user,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "Users", id }],
        }),
        updateUserPassword: builder.mutation({
            query: ({ id, ...passwordData }) => ({
                url: `/users/${id}/password`,
                method: "PUT",
                body: passwordData,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "Users", id }],
        }),

        // Auth
        login: builder.mutation({
            query: (credentials) => ({
                url: "/auth/login",
                method: "POST",
                body: credentials,
            }),
            // Gestion des erreurs et transformation de la réponse
            transformResponse: (response) => {
                // S'assurer que la réponse contient un token
                if (!response || !response.token) {
                    throw new Error("Réponse de connexion invalide");
                }

                // Transformer/normaliser la réponse si nécessaire
                return {
                    token: response.token,
                    user: response.user || null,
                };
            },
            // Gestion des erreurs
            transformErrorResponse: (response) => {
                console.error("Erreur de login:", response);
                return response;
            },
        }),

        // Studios
        getStudios: builder.query({
            query: () => "/studios",
            transformResponse: (response) => response.studios || [],
            providesTags: ["Studios"],
        }),
        getStudioById: builder.query({
            query: (id) => `/studios/${id}`,
            transformResponse: (response) => response.studio || null,
            providesTags: (result, error, id) => [{ type: "Studios", id }],
        }),
        createStudio: builder.mutation({
            query: (studio) => ({
                url: "/studios",
                method: "POST",
                body: studio,
            }),
            invalidatesTags: ["Studios"],
        }),
        updateStudio: builder.mutation({
            query: ({ id, ...studio }) => ({
                url: `/studios/${id}`,
                method: "PUT",
                body: studio,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "Studios", id },
            ],
        }),
        deleteStudio: builder.mutation({
            query: (id) => ({
                url: `/studios/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Studios"],
        }),
        getStudioByOwnerId: builder.query({
            query: (ownerId) => `/studios/owner/${ownerId}`,
            transformResponse: (response) => response.studios || [],
            providesTags: ["Studios"],
        }),
        getStudioByTag: builder.query({
            query: (tag) => `/studios/tag/${tag}`,
            transformResponse: (response) => response.studios || [],
            providesTags: ["Studios"],
        }),
        searchStudios: builder.query({
            query: (searchTerm) =>
                `/studios/search?q=${encodeURIComponent(searchTerm)}`,
            transformResponse: (response) => response.studios || [],
            providesTags: ["Studios"],
        }),

        // Reviews
        getReviewById: builder.query({
            query: (id) => `/reviews/${id}`,
            transformResponse: (response) => response.review || null,
            providesTags: (result, error, id) => [{ type: "Reviews", id }],
        }),
        getReviews: builder.query({
            query: () => "/reviews",
            transformResponse: (response) => response.reviews || [],
            providesTags: ["Reviews"],
        }),
        getReviewsByStudioId: builder.query({
            query: (studioId) => `/reviews/studio/${studioId}`,
            transformResponse: (response) => response.reviews || [],
            providesTags: ["Reviews"],
        }),
        getReviewsByUserId: builder.query({
            query: (userId) => `/reviews/user/${userId}`,
            transformResponse: (response) => response.reviews || [],
            providesTags: ["Reviews"],
        }),
        createReview: builder.mutation({
            query: (review) => ({
                url: "/reviews",
                method: "POST",
                body: review,
            }),
            invalidatesTags: ["Reviews"],
        }),
    }),
});

// Export des hooks générés automatiquement
export const {
    // Roles
    useCreateRoleMutation,
    useGetRolesQuery,
    useDeleteRoleMutation,
    useUpdateRoleMutation,

    // Users
    useCreateUserMutation,
    useGetUsersQuery,
    useGetUserByIdQuery,
    useUpdateUserMutation,
    useUpdateUserPasswordMutation,

    // Auth
    useLoginMutation,

    // Studios
    useGetStudiosQuery,
    useGetStudioByIdQuery,
    useCreateStudioMutation,
    useUpdateStudioMutation,
    useDeleteStudioMutation,
    useGetStudioByOwnerIdQuery,
    useGetStudioByTagQuery,
    useSearchStudiosQuery,

    // Reviews
    useGetReviewByIdQuery,
    useGetReviewsQuery,
    useGetReviewsByStudioIdQuery,
    useGetReviewsByUserIdQuery,
    useCreateReviewMutation,
} = api;
