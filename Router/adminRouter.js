import express from "express"
import { userLogin, userRegister } from "../Controller/adminController.js";

const adminrouter = express.Router();


adminrouter.post("/login", userLogin )
adminrouter.post("/register", userRegister)


export default adminrouter