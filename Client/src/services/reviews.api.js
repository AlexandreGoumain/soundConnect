import { baseApi } from "./baseApi";

// Extension de l'API pour les endpoints liés aux avis
export const reviewsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
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
    useGetReviewByIdQuery,
    useGetReviewsQuery,
    useGetReviewsByStudioIdQuery,
    useGetReviewsByUserIdQuery,
    useCreateReviewMutation,
} = reviewsApi;
