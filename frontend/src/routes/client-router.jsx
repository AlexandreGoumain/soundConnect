import Home from "../features/client/home/Home.jsx";
import LoginForm from "../features/client/login/LoginForm.jsx";
import Profile from "../features/client/profile/Profile.jsx";
import ChangePassword from "../features/client/profile/ChangePassword.jsx";
import RegisterForm from "../features/client/register/RegisterForm.jsx";
import StudioDetails from "../features/client/studio-details/StudioDetails.jsx";
import StudiosList from "../features/client/studios/StudiosList.jsx";
import ClientLayout from "../layouts/ClientLayout.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";

export const clientRouter = {
    path: "/",
    element: <ClientLayout />,
    children: [
        { index: true, element: <Home /> },
        { path: "login", element: <LoginForm /> },
        { path: "register", element: <RegisterForm /> },
        {
            path: "profile",
            element: (
                <ProtectedRoute>
                    <Profile />
                </ProtectedRoute>
            ),
        },
        {
            path: "profile/password",
            element: (
                <ProtectedRoute>
                    <ChangePassword />
                </ProtectedRoute>
            ),
        },
        { path: "studios/:id", element: <StudioDetails /> },
        { path: "studios", element: <StudiosList /> },
        // { path: "studios/owner/:ownerId", element: <StudioListByOwner /> },
    ],
};
