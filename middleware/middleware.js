import { json } from "stream/consumers";
import AppError from "../utils/AppError.js";
import { StatusCodes , ReasonPhrases } from "http-status-codes";


const errorHandler =(err, req, res , next)=>{
    if(err instanceof AppError){
        const StatusCodes  = err.statusCode || 500
        console.log("Error  message is" , err.message)

        const responseData = {
            error:{
                message : err.message || ReasonPhrases.INTERNAL_SERVER_ERROR
            }
        }

        return res.status(StatusCodes).json(responseData)
    }
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message : ReasonPhrases.INTERNAL_SERVER_ERROR})

}
export default errorHandler