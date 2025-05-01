import { categoryModel } from "../Model/categoryModel.js"
import { Portfolio } from "../Model/PortFolio.js";
import { Feedback } from "../Model/FeedbackModel.js";
import { HttpStatus } from "../Enums/enum.js";


export  const adminDashboard = async(req, res, next)=>{
    try {
        const totalCategory = (await categoryModel.find()).length;
        const totalportfolio = (await Portfolio.find()).length;
        const totalFeedback = (await Feedback.find()).length;
        const data = {totalCategory : totalCategory , totalportfolio:  totalportfolio , totalFeedback : totalFeedback}
        return res.status(HttpStatus.OK).json({data:data})

    } catch (error) {
        console.log(error)
        next(error)
        
    }
}