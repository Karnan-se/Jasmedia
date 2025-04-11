import express from "express"
import { userLogin, userRegister } from "../Controller/adminController.js";
import {addCategory, updateCategory, getCategory} from "../Controller/categoryController.js"
import jwtAuth from "../middleware/authentication.js";

const adminrouter = express.Router();


adminrouter.post("/login", userLogin )
adminrouter.post("/register", userRegister)
adminrouter.post("/addCategory",  addCategory)
adminrouter.get("/getcategory" , getCategory)
adminrouter.post("/updateCategory" , updateCategory)


export default adminrouter