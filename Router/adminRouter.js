import express from "express"
import { userLogin, userRegister } from "../Controller/adminController.js";
import {addCategory, updateCategory, getCategory} from "../Controller/categoryController.js"
import jwtAuth from "../middleware/authentication.js";
import { RequestSignedUrl } from "../Controller/cloudinary.js";
import { createPortFolio, deletePortfolio, editPortfolio, togglePortfolio } from "../Controller/PortfolioController.js";
import { toggleStatus } from "../Controller/categoryController.js";
import { getPortFolio } from "../Controller/PortfolioController.js";
import { addFeedback, deleteFeedback, editFeedback, getAllFeedback } from "../Controller/feedbackController.js";

const adminrouter = express.Router();


adminrouter.post("/login", userLogin )
adminrouter.post("/register", userRegister)

adminrouter.post("/addCategory", jwtAuth ,  addCategory)
adminrouter.get("/getcategory" ,jwtAuth ,  getCategory)
adminrouter.post("/updateCategory", jwtAuth ,  updateCategory)
adminrouter.put("/blockCategory", jwtAuth, toggleStatus )

adminrouter.get("/signedUrl", RequestSignedUrl )
adminrouter.post("/portfolio", createPortFolio)
adminrouter.post("/updatePortfolio" , editPortfolio)
adminrouter.get("/getPortfolio", getPortFolio)
adminrouter.delete("/deletePortfolio", deletePortfolio)
adminrouter.put("/togglePortfolio", togglePortfolio)


adminrouter.get("/feedback", getAllFeedback)
adminrouter.put("/editFeedback", editFeedback)
adminrouter.delete("/deleteFeedback", deleteFeedback)
adminrouter.post("/addFeedback", addFeedback)




export default adminrouter