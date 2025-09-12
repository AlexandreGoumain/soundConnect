import Home from "../features/client/home/Home.jsx";
import LoginForm from "../features/client/login/LoginForm.jsx";
// import Profile from "../features/client/profile/Profile.jsx";
import RegisterForm from "../features/client/register/RegisterForm.jsx";
import StudioDetails from "../features/client/studio-details/StudioDetails.jsx";
import StudiosList from "../features/client/studios/StudiosList.jsx";
import ClientLayout from "../layouts/ClientLayout.jsx";

export const clientRouter = {
    path: "/",
    element: <ClientLayout />,
    children: [
        { index: true, element: <Home /> },
        { path: "login", element: <LoginForm /> },
        { path: "register", element: <RegisterForm /> },
        // { path: "profile", element: <Profile /> },
        { path: "studios/:id", element: <StudioDetails /> },
        { path: "studios", element: <StudiosList /> },
        // { path: "studios/owner/:ownerId", element: <StudioListByOwner /> },
    ],
};
