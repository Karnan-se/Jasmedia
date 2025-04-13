import { Portfolio } from "../Model/PortFolio.js"
import { HttpStatus } from "../Enums/enum.js";
import AppError from "../utils/AppError.js";


export const createPortFolio = async(req, res, next)=>{
    try {
        const {portfolio} = req.body
        if(!portfolio){
            return  AppError.validation("Error getting the details")
        }
        const Saveportfolio = await Portfolio.create(portfolio)
        console.log(Saveportfolio , "portfolio Saved")
        res.status(HttpStatus.CREATED).json({message:"Portfolio Details saved Successfully" , data:Saveportfolio})
        
    } catch (error) {
        console.log(error)
        next(error)
        
    }
}