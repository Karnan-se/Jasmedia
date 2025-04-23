import express from "express"
import { userLogin, userRegister } from "../Controller/adminController.js";
import {addCategory, updateCategory, getCategory} from "../Controller/categoryController.js"
import jwtAuth from "../middleware/authentication.js";
import { RequestSignedUrl } from "../Controller/cloudinary.js";
import { createPortFolio, editPortfolio } from "../Controller/Portfolio.js";
import { toggleStatus } from "../Controller/categoryController.js";

const adminrouter = express.Router();


adminrouter.post("/login", userLogin )
adminrouter.post("/register", userRegister)
adminrouter.post("/addCategory", jwtAuth ,  addCategory)
adminrouter.get("/getcategory" ,jwtAuth ,  getCategory)
adminrouter.post("/updateCategory", jwtAuth ,  updateCategory)
adminrouter.get("/signedUrl", RequestSignedUrl )
adminrouter.post("/portfolio", createPortFolio)
adminrouter.put("/blockCategory", jwtAuth, toggleStatus )
adminrouter.post("/updatePortfolio", jwtAuth , editPortfolio)


export default adminrouter