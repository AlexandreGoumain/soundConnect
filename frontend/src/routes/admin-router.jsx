import AdminLayout from "../layouts/AdminLayout.jsx";

export const adminRouter = {
    path: "/admin",
    element: <AdminLayout />,
    children: [
        // { index: true, element: <AdminDashboard /> },
        // { path: "users", element: <UsersList /> },
    ],
};
