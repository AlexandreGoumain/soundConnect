import { createBrowserRouter } from "react-router-dom";

import { clientRouter } from "./client-router.jsx";
import { studioRouter } from "./studio-router.jsx";

export const router = createBrowserRouter([clientRouter, studioRouter]);
