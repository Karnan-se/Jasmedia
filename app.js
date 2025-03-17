import express from "express"
import { configKeys } from "./config.js";
import cookieParser from "cookie-parser";
import { connectDB } from "./Services/ServerConnection.js";

const app = express();

connectDB()




app.listen(configKeys.PORT_NUMBER, ()=>{
    console.log("server created")
})