import mongoose  from "mongoose";
import { Schema } from "mongoose";
import { type } from "os";

const AdminSchema = new Schema({
    emailAddress: {type: String, required:true , unique: true },
    password :{type:String, required:true},
    name:{type:String},
    isRootAdmin:{type:Boolean, default:false},
    isBlocked:{type:Boolean , default:false},
    otp: {type:String, default:""}
},{timestamps:true})

export  const AdminModel = mongoose.model("admin", AdminSchema)
