import mongoose  from "mongoose";
import { Schema } from "mongoose";

const AdminSchema = new Schema({
    emailAddress: {type: String, required:true , unique: true },
    password :{type:String, required:true},
    name:{type:String},
    isRootAdmin:{type:Boolean, default:false},
    isBlocked:{type:Boolean , default:false}
},{timestamps:true})

export  const AdminModel = mongoose.model("admin", AdminSchema)
