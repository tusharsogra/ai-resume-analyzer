import express from 'express'
import authMiddleware from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.middleware.js';

const router = express.Router();

/**
 * @router POST /interview/analyze
 * @access Private
 * @description analyze the resume
 */
router.post("analyze",authMiddleware.auth,upload.single("resume"))

export default router;