import mongoose, { Schema } from "mongoose";


const feedbackSchema = new Schema({
    name:{type:String , required: true},
    feedback:{type:String, required:true},
    role:{type:String , required:true}
})

export const Feedback = mongoose.model("Feedback", feedbackSchema)