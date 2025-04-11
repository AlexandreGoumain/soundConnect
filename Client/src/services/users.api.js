import { baseApi } from "./baseApi";

// Extension de l'API pour les endpoints liés aux utilisateurs
export const usersApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
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
    }),
});

// Export des hooks générés automatiquement
export const {
    useCreateUserMutation,
    useGetUsersQuery,
    useGetUserByIdQuery,
    useUpdateUserMutation,
    useUpdateUserPasswordMutation,
} = usersApi;
