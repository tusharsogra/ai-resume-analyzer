import { Request } from "express";
import mongoose from "mongoose";


export interface IUser{
    _id?:mongoose.Types.ObjectId;
    email:string;
    password:string;
}

export interface JwtPayload{
    _id:string
    email:string;
}

export interface AuthRequest extends Request{
    user?: JwtPayload
}