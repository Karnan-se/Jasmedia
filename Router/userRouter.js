import express from "express"
import { contactMail, getAllFeedback, getAllPortFolio } from "../Controller/userController.js";
import { getCategory } from "../Controller/userController.js";
import { googleSignIn } from "../Controller/userController.js";
import { getLatestPortfolio } from "../Controller/userController.js";


const userRouter = express.Router();

userRouter.get("/latest_portfolio", getLatestPortfolio)
userRouter.get("/feedback", getAllFeedback)
userRouter.get('/portfolio', getAllPortFolio)
userRouter.get('/category', getCategory)
userRouter.post('/contact', contactMail)

userRouter.post('/api/auth/google', googleSignIn);
export default userRouter