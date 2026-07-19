import express from 'express'
import authController from '../controllers/auth.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
const router = express.Router();

/**
 * @route POST /api/auth/register
 * @access Public
 * @description Register a new user
 */
router.post("/register",authController.registerUser);

/**
 * @route POST /api/auth/login
 * @access Public
 * @description Authenticate user and generate JWT
 */
router.post("/login",authController.loginUser);

/**
 * @route POST /api/auth/logout
 * @access Private
 * @description  Logout the currently authenticated user
 */
router.post("/logout",authMiddleware.auth,authController.logoutUser);

/**
 * @route GET /api/auth/getUser
 * @access Private
 * @description Get the currently authenticated user's information
 */
router.get("/getUser",authMiddleware.auth,authController.getUser);


export default router;