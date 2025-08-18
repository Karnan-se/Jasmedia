import mongoose, { Schema } from "mongoose";
import { collection } from "../Enums/enum.js";


const CategorySchema = new Schema({
    name:{type:String, required:true, unique:true},
    status:{type:Boolean , default:true},
    createdBy:{type:String}
}, {timestamps:true})

export const categoryModel = mongoose.model(collection.CATEGORY, CategorySchema)