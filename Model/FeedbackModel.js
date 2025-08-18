import mongoose, { Schema } from "mongoose";
import { collection } from "../Enums/enum.js";


const feedbackSchema = new Schema({
    name:{type:String , required: true},
    feedback:{type:String, required:true},
    role:{type:String },
    status:{type:Boolean ,  default:true},
    createdBY:{type:String}
}, {timestamps:true})

export const Feedback = mongoose.model(collection.FEEDBACK, feedbackSchema)