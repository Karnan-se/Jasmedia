import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    name:{type:String, required: true},
    emailAddress: {type:String, required: true},
    password:{type:String , required:true},
    photo :{type:String}
})

export const UserModal = mongoose.model("User", userSchema)