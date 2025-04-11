import { baseApi } from "./baseApi";

// Exporter l'API de base pour la configuration du store Redux
export { baseApi };

// Exporter tous les hooks depuis les différents fichiers d'API
export {
    useCreateRoleMutation,
    useDeleteRoleMutation,
    useGetRolesQuery,
    useUpdateRoleMutation,
} from "./roles.api";

export {
    useCreateUserMutation,
    useGetUserByIdQuery,
    useGetUsersQuery,
    useUpdateUserMutation,
    useUpdateUserPasswordMutation,
} from "./users.api";

export { useLoginMutation } from "./auth.api";

export {
    useCreateStudioMutation,
    useDeleteStudioMutation,
    useGetStudioByIdQuery,
    useGetStudioByOwnerIdQuery,
    useGetStudioByTagQuery,
    useGetStudiosQuery,
    useSearchStudiosQuery,
    useUpdateStudioMutation,
} from "./studios.api";

export {
    useCreateReviewMutation,
    useGetReviewByIdQuery,
    useGetReviewsByStudioIdQuery,
    useGetReviewsByUserIdQuery,
    useGetReviewsQuery,
} from "./reviews.api";
