import { Schema, model } from "mongoose"; 
import { User } from "../interfaces/user";

const userSchema = new Schema<User>({
    name: { type: String, required: true, minlength: 6, maxlength: 255 },
    email: { type: String, required: true, minlength: 6, maxlength: 255, unique: true },
    password: { type: String, required: true, minlength: 6, maxlength: 255 },
    registerDate: { type: Date, default: Date.now, required: true}
});



export const userModel = model<User>('User', userSchema);