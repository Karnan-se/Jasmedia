import mongoose, { Schema } from "mongoose";

const portFolioSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ["Image", "video"] },
  publicId: { type: String },
  secureUrl: { type: String }
}, { timestamps: true });

export const Portfolio = mongoose.model("Portfolio", portFolioSchema);
