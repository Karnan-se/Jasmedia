import mongoose, { Schema } from "mongoose";


const HistorySchema = new Schema({
    createdBy:{type: mongoose.Schema.Types.ObjectId, ref:"admin"}, 
    updatedBy:{type: mongoose.Schema.Types.ObjectId, ref:"admin"}, 
    collectionId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'collectionName' },
    collectionName:{type:String ,  required: true , enum: ['category', 'Portfolio', "Feedback" ] },
    action:{type:String}
},{timestamps: true})

export const History =  mongoose.model("History", HistorySchema)