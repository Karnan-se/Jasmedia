import mongoose, { Schema } from "mongoose";
import { collection } from "../Enums/enum.js";


const HistorySchema = new Schema({
    collectionName:{type:String ,  required: true , enum: [collection.CATEGORY, collection.PORTFOLIO, collection.FEEDBACK] },
    collectionId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'collectionName' },
    updatedBy:{type: mongoose.Schema.Types.ObjectId, ref:"admin"}, 
    action:{type:String}
},{timestamps: true})

export const history = mongoose.model("history", HistorySchema)