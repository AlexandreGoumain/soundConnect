import StudioLayout from "../layouts/StudioLayout.jsx";

export const studioRouter = {
    path: "/studio",
    element: <StudioLayout />,
    children: [
        // { index: true, element: <StudioDashboard /> },
        // { path: "studios", element: <MyStudios /> },
        // { path: "studios/new", element: <StudioForm /> },
    ],
};
