import mongoose  from "mongoose";
import { Schema } from "mongoose";

const AdminSchema = new Schema({
    emailAddress: {type: String, required:true , unique: true },
    password :{type:String, required:true}
},{timestamps:true})

export  const AdminModel = mongoose.model("admin", AdminSchema)
