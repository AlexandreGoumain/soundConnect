# SoundConnect

Plateforme de réservation de studios.

-   Backend: Node.js/Express + MySQL (JWT via cookie httpOnly, CSRF). Voir `backend/README.md`.
-   Frontend: React + Vite (Axios `withCredentials`). Voir `frontend/README.md`.

## Structure

```
backend/   API Express (routes, services, models)
frontend/  App React (Vite)
start.sh   Sert le build frontend (`frontend/dist`)
```

## Démarrage rapide (dev)

-   Backend

    -   `cd backend && npm install`
    -   Copier `backend/.env.example` vers `backend/.env` et renseigner MySQL/JWT/FRONTEND_URL
    -   `npm run dev` (API sur `http://localhost:5000`)

-   Frontend
    -   `cd frontend && npm install`
    -   `npm run dev` (app sur `http://localhost:5173`)

Pour plus de détails (endpoints, variables d’environnement, uploads…), consultez:

-   `backend/README.md`
-   `frontend/README.md`
