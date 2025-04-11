import { baseApi } from "./baseApi";

// Extension de l'API pour les endpoints liés aux studios
export const studiosApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
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
    }),
});

// Export des hooks générés automatiquement
export const {
    useGetStudiosQuery,
    useGetStudioByIdQuery,
    useCreateStudioMutation,
    useUpdateStudioMutation,
    useDeleteStudioMutation,
    useGetStudioByOwnerIdQuery,
    useGetStudioByTagQuery,
    useSearchStudiosQuery,
} = studiosApi;
