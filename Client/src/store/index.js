import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { baseApi } from "../services/index";

// Configuration du store Redux
export const store = configureStore({
    reducer: {
        // Ajout du reducer de l'API RTK Query
        [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(baseApi.middleware),
});

// Configuration des listeners pour les requêtes auto-refresh
setupListeners(store.dispatch);
