import express from "express"
import { getAllFeedback } from "../Controller/feedbackController.js";
import { getPortFolio } from "../Controller/PortfolioController.js";
import { getCategory } from "../Controller/categoryController.js";
import { googleSignIn } from "../Controller/userController.js";

const userRouter = express.Router();

userRouter.get("/feedback" , getAllFeedback)
userRouter.get("/portfolio", getPortFolio)
userRouter.get("/category", getCategory)

userRouter.post('/api/auth/google', googleSignIn);
export default userRouter