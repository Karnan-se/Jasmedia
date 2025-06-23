import { Portfolio } from "../Model/PortFolio.js"
import { HttpStatus } from "../Enums/enum.js";
import AppError from "../utils/AppError.js";
import { checkisRootAdmin } from "./adminController.js";


export const createPortFolio = async(req, res, next)=>{
    try {
        const {portfolio} = req.body
        const requester = req.user

        if(requester.isBlocked) {
          return res.status(HttpStatus.FORBIDDEN).json({ message: "Your account is currently blocked!" });
        }
        if(!portfolio){
            return  AppError.validation("Error getting the details")
        }

        const Saveportfolio = await Portfolio.create(portfolio)
        res.status(HttpStatus.CREATED).json({message:"Portfolio Details saved Successfully" , data:Saveportfolio})
    } catch (error) {
        console.log(error)
        next(error)  
    }
}



export const editPortfolio = async(req, res, next)=>{
    const { _id, portfolio } = req.body;
    const requester = req.user

    if(requester.isBlocked) {
      return res.status(HttpStatus.FORBIDDEN).json({ message: "Your account is currently blocked!" });
    }

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
    
      res.status(HttpStatus.OK).json(updatedPortfolio);
    } catch (error) {
      next(error);
    }
}



export const getPortFolio = async(req, res, next)=>{
  const requester = req.user
  if(requester.isBlocked) {
    return res.status(HttpStatus.FORBIDDEN).json({ message: "Your account is currently blocked!" });
  }
          
  try {
    const portfolio = await Portfolio.find().populate("category")
    res.status(HttpStatus.OK).json({data:portfolio})
  } catch (error) {
    console.log(error)
    throw error
    
  }
}
export const deletePortfolio = async (req, res, next) => {
  try {
    const requester = req.user
    const { portfolioId } = req.body;

    if(requester.isBlocked) {
      return res.status(HttpStatus.FORBIDDEN).json({ message: "Your account is currently blocked!" });
    }
    if(!requester.role) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: "Oops! You're not allowed to delete portfolio!" });
    }

    if (!portfolioId) {
      throw AppError.conflict("portfolioId not found");
    }

    const result = await Portfolio.deleteOne({ _id: portfolioId });

    if (result.deletedCount === 0) {
      throw AppError.conflict("Portfolio does not exist");
    }

    res.status(HttpStatus.OK).json({ message: "Portfolio deleted" });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const togglePortfolio = async(req, res, next)=>{
  try {
    const requester = req.user
    const {portfolioId} = req.body

    if(requester.isBlocked) {
      return res.status(HttpStatus.FORBIDDEN).json({ message: "Your account is currently blocked!" });
    }
    if(!requester.role) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: "Oops! You're not allowed to toggle portfolio!" });
    }
            
    const portfolio = await Portfolio.findOne({_id:portfolioId})
    portfolio.status = !portfolio.status;
    await portfolio.save()
    res.status(HttpStatus.OK).json({message: "portfolio Blocked"})
  } catch (error) {
    console.log(error)
    next(error)
  }
}
