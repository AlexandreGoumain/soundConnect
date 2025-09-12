import express from "express";
import ScheduleController from "../controllers/scheduleController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Get studio schedule (public)
router.get("/:studio_id", ScheduleController.getSchedule);

// Get default schedule template (public)
router.get("/template/default", ScheduleController.getDefaultSchedule);

// Update studio schedule (studio owner only)
router.put("/:studio_id", authenticateToken, ScheduleController.updateSchedule);

export default router;
