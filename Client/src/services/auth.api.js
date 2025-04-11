import { baseApi } from "./baseApi";

// Extension de l'API pour les endpoints liés à l'authentification
export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
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
    }),
});

// Export des hooks générés automatiquement
export const { useLoginMutation } = authApi;
