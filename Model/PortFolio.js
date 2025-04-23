import mongoose, { Schema, Types } from "mongoose";

const portFolioSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ["Image", "Video"], required: true },
  category: { type: Types.ObjectId, ref: "category" },
  publicId: { type: String },
  secureUrl: { type: String }
}, { timestamps: true });

export const Portfolio = mongoose.model("Portfolio", portFolioSchema);
