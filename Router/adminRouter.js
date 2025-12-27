import express from "express"
import { changePassword, createRootAdmin, forgotPassword, userLogin, userRegister, verifyOtp, getLatestContacts } from "../Controller/adminController.js";
import {addCategory, updateCategory, getCategory} from "../Controller/categoryController.js"
import jwtAuth from "../middleware/authentication.js";
import { RequestSignedUrl } from "../Controller/cloudinary.js";
import { createPortFolio, deletePortfolio, editPortfolio, togglePortfolio } from "../Controller/PortfolioController.js";
import { toggleStatus } from "../Controller/categoryController.js";
import { getPortFolio } from "../Controller/PortfolioController.js";
import { addFeedback, deleteFeedback, editFeedback, feedbackToggle, getAllFeedback } from "../Controller/feedbackController.js";
import { adminDashboard, adminDetails, deleteAdmin, toggleAdmin } from "../Controller/adminDashboard.js";
import { getHistory } from "../Controller/historycontroller.js";

const adminrouter = express.Router();


adminrouter.post("/login", userLogin )
adminrouter.post("/register", userRegister)

adminrouter.post("/addCategory", jwtAuth,  addCategory)
adminrouter.get("/getcategory" , jwtAuth,  getCategory)
adminrouter.post("/updateCategory", jwtAuth,  updateCategory)
adminrouter.put("/blockCategory", jwtAuth, toggleStatus )

adminrouter.get("/signedUrl", jwtAuth, RequestSignedUrl)
adminrouter.post("/portfolio", jwtAuth, createPortFolio)
adminrouter.post("/updatePortfolio", jwtAuth, editPortfolio)
adminrouter.get("/getPortfolio", jwtAuth, getPortFolio)
adminrouter.delete("/deletePortfolio", jwtAuth, deletePortfolio)
adminrouter.put("/togglePortfolio", jwtAuth, togglePortfolio)


adminrouter.get("/feedback", jwtAuth, getAllFeedback)
adminrouter.put("/editFeedback", jwtAuth, editFeedback)
adminrouter.delete("/deleteFeedback", jwtAuth, deleteFeedback)
adminrouter.post("/addFeedback", jwtAuth, addFeedback)
adminrouter.put("/togglefeedback", jwtAuth, feedbackToggle)

adminrouter.post("/forgotPassword", forgotPassword )
adminrouter.post("/verifyOtp", verifyOtp)
adminrouter.put("/changePassword", changePassword)


adminrouter.get("/admindashboard", jwtAuth, adminDashboard)
adminrouter.post("/createRootadmin", jwtAuth, createRootAdmin)
adminrouter.get("/getAdmins", jwtAuth, adminDetails)
adminrouter.put("/toggleAdmin", jwtAuth, toggleAdmin)
adminrouter.delete("/deleteAdmin", jwtAuth, deleteAdmin)

adminrouter.get("/contacts", jwtAuth, getLatestContacts)
adminrouter.get("/gethistory", jwtAuth, getHistory)





export default adminrouter