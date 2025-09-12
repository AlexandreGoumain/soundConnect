import express from "express";
import AvailabilityController from "../controllers/availabilityController.js";

const router = express.Router();

// Get available time slots for a specific date
router.get("/:studio_id/slots", AvailabilityController.getAvailableSlots);

// Get weekly schedule for a studio
router.get("/:studio_id/schedule", AvailabilityController.getWeeklySchedule);

// Get availability for a date range (for calendar view)
router.get("/:studio_id/range", AvailabilityController.getAvailabilityRange);

// Check if a specific time slot is available
router.post("/:studio_id/check", AvailabilityController.checkSlotAvailability);

export default router;
