import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";

dotenv.config();

// Import database configuration
import { testConnection } from "./config/database.js";

const app = express();
const PORT = process.env.PORT;

// Middleware security
app.use(helmet());

// CORS configuration
app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    })
);

// Middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// test route
app.get("/api/test", (req, res) => {
    res.json({
        message: "SoundConnect API is running!",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || "development",
    });
});

// Middleware for non-existent routes
app.use("*", (req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});

// Middleware globals errors
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: "Internal server error",
        ...(process.env.NODE_ENV === "development" && { error: err.message }),
    });
});

// test connexion DB
app.listen(PORT, async () => {
    console.log(`🚀 SoundConnect server started on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`🔗 API Test: http://localhost:${PORT}/api/test`);

    // test connexion DB
    await testConnection();
});
