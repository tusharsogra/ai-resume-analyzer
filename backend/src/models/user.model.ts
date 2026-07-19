import mongoose , {Model} from "mongoose";
import { IUser } from "../types/auth.types.js";

const userSchema = new mongoose.Schema<IUser>({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})



const UserModel = (mongoose.models.UserModel as Model<IUser> ) || mongoose.model<IUser>("UserModel" , userSchema );

export default UserModel;