import Calendar from "../features/studio-dashboard/Calendar.jsx";
import Messages from "../features/studio-dashboard/Messages.jsx";
import MyStudios from "../features/studio-dashboard/MyStudios.jsx";
import Overview from "../features/studio-dashboard/Overview.jsx";
import StudioForm from "../features/studio-dashboard/StudioForm.jsx";
import StudioReservationsView from "../features/studio-dashboard/StudioReservationsView.jsx";
import StudioLayout from "../layouts/StudioLayout.jsx";

export const studioRouter = {
    path: "/studio",
    element: <StudioLayout />,
    children: [
        { index: true, element: <Overview /> },
        { path: "studios", element: <MyStudios /> },
        { path: "studios/new", element: <StudioForm /> },
        { path: "studios/:id", element: <StudioForm /> },
        {
            path: "reservations",
            element: <StudioReservationsView all={true} />,
        },
        {
            path: "studios/:id/reservations",
            element: <StudioReservationsView />,
        },
        { path: "messages", element: <Messages /> },
        { path: "calendar", element: <Calendar /> },
    ],
};
