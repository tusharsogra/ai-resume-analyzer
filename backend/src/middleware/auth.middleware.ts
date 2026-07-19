import { NextFunction, Response } from "express";
import {AuthRequest} from "../types/auth.types.js";
import jwt from 'jsonwebtoken'
import { JwtPayload } from "../types/auth.types.js";

function auth(req:AuthRequest , res : Response , next:NextFunction) :void {
    try {
        const token = req.cookies.token;
        if(!token){
            res.status(401).json({
                success:false,
                message:"unauthorized user"
            })
            return;
        }

        const decoded = jwt.verify(token,process.env.JWT_SECRET!) as JwtPayload
        req.user = decoded;
        next()
    } catch (error) {
        console.error(error);
        res.status(401).json({
            success:false,
            message:"invalid or expired token"
        })
    }
}

export default {auth};