import mongoose, { Schema, Types } from "mongoose";
import { collection } from "../Enums/enum.js";

const portFolioSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  type: { type: String, enum: ["Image", "Video"], required: true },
  category: { type: Types.ObjectId, ref: collection.CATEGORY },
  publicId: { type: String },
  status:{type:Boolean , default:true},
  secureUrl: { type: String },
  createdBy:{type: String}

}, { timestamps: true });

export const Portfolio = mongoose.model(collection.PORTFOLIO, portFolioSchema);
