import express from 'express';
import { getRoles } from '../controllers/roleController.js';

const router = express.Router();

// Public endpoint to list available roles
router.get('/', getRoles);

export default router;

