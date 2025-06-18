import express from "express"
import { configKeys } from "./config.js";
import cookieParser from "cookie-parser";
import { connectDB } from "./Services/ServerConnection.js";
import errorHandler from "./middleware/middleware.js";
import cors from "cors"
import adminrouter from "./Router/adminRouter.js";
import userRouter from "./Router/userRouter.js";


const app = express();


app.use(cors({
    origin:configKeys.CLIENT_ORGIN,
    credentials: true
}))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended : true} ))

app.use("/admin", adminrouter)
app.use("/user", userRouter)






connectDB()
app.use(errorHandler)

// "k2jjk2"


app.listen(configKeys.PORT_NUMBER, ()=>{
    console.log("server created")
})