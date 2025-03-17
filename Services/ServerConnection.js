import mongoose from "mongoose"
import { configKeys } from "../config.js"


export async function connectDB() {
    try {
        const database = await mongoose.connect(configKeys.MONGOOSE_URL)
        console.log("database COnnected")
        
        
    } catch (error) {
        console.log(error)
        throw error
        
    }
}