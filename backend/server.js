import cookieParser from "cookie-parser";
import cors from "cors";
import csrf from "csurf";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

// DB config
import { testConnection } from "./config/database.js";

// Routes
import authRoutes from "./routes/auth.js";
import availabilityRoutes from "./routes/availability.js";
import dashboardRoutes from "./routes/dashboard.js";
import reservationRoutes from "./routes/reservations.js";
import reviewRoutes from "./routes/reviews.js";
import scheduleRoutes from "./routes/schedule.js";
import studioRoutes from "./routes/studios.js";
import uploadRoutes from "./routes/uploads.js";
import roleRoutes from "./routes/roles.js";
import userRoutes from "./routes/users.js";

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Security middleware
app.use(helmet());

// Cookie parser to read cookies
app.use(cookieParser());

// CORS configuration
app.use(
    cors({
        origin: FRONTEND_URL,
        credentials: true,
    })
);

// Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CSRF protection (double submit cookie strategy)
// - Requires a token in header for state-changing requests
// - Provide token via GET /api/csrf-token
const csrfProtection = csrf({
    cookie: {
        httpOnly: true, // secret cookie not readable by JS
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
    },
    ignoreMethods: ["GET", "HEAD", "OPTIONS"], // protect only mutating requests
});

// Static files for uploaded assets
app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"), {
        maxAge: "7d",
        setHeaders: (res) => {
            // Basic security headers for static content
            res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
        },
    })
);

// Issue CSRF token endpoint
app.get("/api/csrf-token", csrfProtection, (req, res) => {
    const token = req.csrfToken();

    res.cookie("XSRF-TOKEN", token, {
        httpOnly: false,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        path: "/",
    });
    res.json({ success: true, data: { csrfToken: token } });
});

// Test route
app.get("/api/test", (req, res) => {
    res.json({
        message: "SoundConnect API is running!",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || "development",
    });
});

app.use(csrfProtection);

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/schedule", scheduleRoutes);
app.use("/api/users", userRoutes);
app.use("/api/studios", studioRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/roles", roleRoutes);

// 404 handler
app.use("*", (req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});

// Global error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    if (err.code === "EBADCSRFTOKEN") {
        return res.status(403).json({
            success: false,
            message: "Invalid CSRF token",
        });
    }
    res.status(500).json({
        success: false,
        message: "Internal server error",
        ...(process.env.NODE_ENV === "development" && { error: err.message }),
    });
});

// Start server and test DB connection
app.listen(PORT, async () => {

    await testConnection();
});
