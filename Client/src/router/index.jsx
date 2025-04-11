import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

// Layouts
// import MainLayout from "../layouts/MainLayout"; // Uncomment when layout is created

// Pages - Using lazy loading for better performance
// Add your page imports here as needed
const Home = lazy(() => import("../pages/Home"));
const Loading = lazy(() => import("../pages/Loading"));
const Error = lazy(() => import("../pages/Error"));
const Login = lazy(() => import("../pages/Login"));

const StudioList = lazy(() => import("../pages/StudioList"));
// const Register = lazy(() => import("../pages/Register"));
// const NotFound = lazy(() => import("../pages/NotFound"));

const AppRouter = () => {
    return (
        <Suspense fallback={<Loading />}>
            <Routes>
                {/* Public routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/studios/list" element={<StudioList />} />
                {/* <Route path="/register" element={<Register />} /> */}

                {/* Protected routes */}
                {/* <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    </Route> */}

                {/* Not found route */}
                <Route path="*" element={<Error />} />
            </Routes>
        </Suspense>
    );
};

export default AppRouter;
