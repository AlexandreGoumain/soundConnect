import LoginForm from "../components/LoginForm.jsx";
import Home from "../features/client/home/Home.jsx";
import ClientLayout from "../layouts/ClientLayout.jsx";

export const clientRouter = {
    path: "/",
    element: <ClientLayout />,
    children: [
        { index: true, element: <Home /> },
        { path: "login", element: <LoginForm /> },

        // { path: "studios", element: <StudiosList /> },
        // { path: "studios/:id", element: <StudioDetails /> },
        // { path: "studios/owner/:ownerId", element: <StudioListByOwner /> },
        // { path: "register", element: <RegisterPage /> },
    ],
};
