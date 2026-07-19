import bcrypt from "bcryptjs"
import UserModel from "../models/user.model.js"
import { AuthRequest, IUser } from "../types/auth.types.js"
import { Request, Response } from "express"
import jwt from 'jsonwebtoken'
import { JwtPayload } from "../types/auth.types.js"


/**
 * @description register a new user
 * @route POST /api/auth/register
 * @access Public
 */
async function registerUser(req: Request, res: Response): Promise<void> {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: "please provide the complete information"
            })
            return;
        }

        const isExisted: IUser | null = await UserModel.findOne({
            email
        })

        if (isExisted) {
            res.status(409).json({
                success: false,
                message: "user already exist."
            })
            return;
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const user: IUser = await UserModel.create({
            email,
            password: hashPassword
        })

        res.status(201).json({
            success: true,
            message: "user register successfully",
            user: {
                _id: user._id,
                email: user.email,
            }
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "internal server error"
        })
    }
}

/**
 * @description login user and generate jwt
 * @route POST /api/auth/login
 * @access Public
 */

async function loginUser(req: Request, res: Response): Promise<void> {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: "email or password is missing"
            })
            return;
        }

        const isExisted: IUser | null = await UserModel.findOne({
            email
        })

        if (!isExisted) {
            res.status(401).json({
                success: false,
                message: "user not found , please signup first"
            })
            return;
        }

        const isValid = await bcrypt.compare(password, isExisted.password);

        if (!isValid) {
            res.status(401).json({
                success: false,
                message: "password is invalid."
            })
            return;
        }

        const payload: JwtPayload = {
            _id: isExisted._id!.toString(),
            email: isExisted.email
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "7d" });
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            success: true,
            message: "user login succesfully",
            token,
            user: {
                _id: isExisted._id,
                email: isExisted.email
            }
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "internal server error"
        })
    }
}


/**
 * @description Logout authenticated user
 * @route POST /api/auth/logout
 * @access Private
 */
async function logoutUser(
    req: AuthRequest,
    res: Response
): Promise<void> {
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({
        success: true,
        message: "User logged out successfully.",
    });
}

/**
 * @description Get authenticated user
 * @route GET /api/auth/getUser
 * @access Private
 */
async function getUser(
    req: AuthRequest,
    res: Response
): Promise<void> {
    try {
        const user = await UserModel.findById(req.user?._id).select("-password");

        if (!user) {
            res.status(401).json({
                success: false,
                message: "User not found.",
            });
            return;
        }

        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}

export default { registerUser, loginUser, logoutUser, getUser }