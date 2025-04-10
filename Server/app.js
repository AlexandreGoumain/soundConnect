const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

const RoleRouter = require("./routes/roles");
const UserRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const StudioRouter = require("./routes/studios");

dotenv.config();

connectDB();

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
    res.json({ message: "Bienvenue sur l'API SoundConnect!" });
});

app.use("/users", UserRouter);
app.use("/roles", RoleRouter);
app.use("/auth", authRouter);
app.use("/studios", StudioRouter);

app.use((err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
});

module.exports = app;
