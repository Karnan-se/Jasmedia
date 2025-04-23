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
export const editPortfolio = async(req, res, next)=>{
    const { _id, portfolio } = req.body;

    if (!_id || !portfolio) {
      return next(AppError.conflict("No Id or portfolio"));
    }
    
    try {
      const updatedPortfolio = await Portfolio.findByIdAndUpdate(
        _id,
        { $set: { ...portfolio } },
        { new: true }
      );
    
      if (!updatedPortfolio) {
        return next(AppError.notFound("Portfolio not found"));
      }
    
      res.status(200).json(updatedPortfolio);
    } catch (error) {
      next(error);
    }
}