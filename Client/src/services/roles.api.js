import { baseApi } from "./baseApi";

// Extension de l'API pour les endpoints liés aux rôles
export const rolesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
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
    }),
});

// Export des hooks générés automatiquement
export const {
    useCreateRoleMutation,
    useGetRolesQuery,
    useDeleteRoleMutation,
    useUpdateRoleMutation,
} = rolesApi;
