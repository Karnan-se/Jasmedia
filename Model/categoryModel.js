import mongoose, { Schema } from "mongoose";


const CategorySchema = new Schema({
    name:{type:String, required:true, unique:true},
    status:{type:Boolean , default:true},
    createdBy:{type:String}

}, {timestamps:true})

export const categoryModel = mongoose.model("category" , CategorySchema)