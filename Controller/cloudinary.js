import { Requestsignedurl } from "../Services/cloudinary.js";
import { v4 as uuidv4 } from "uuid";
import { HttpStatus } from "../Enums/enum.js";
export const RequestSignedUrl = async(req, res, next)=>{
    try {
        const requester = req.user
        if(requester.isBlocked) {
            return res.status(HttpStatus.FORBIDDEN).json({ err: "Your account is currently blocked!" });
        }
        
       
        let  {resourseType = "auto"} = req.query;
        const timeStamp = Math.floor(Date.now())/1000;
        const publicId = `portfolio/${uuidv4()}`
        const signedUrl = await  Requestsignedurl(timeStamp, publicId, resourseType)

        console.log(signedUrl , "signedUrl")
        res.status(HttpStatus.OK).json({message: "Request_URL_created" , signedUrl})

        
    } catch (error) {
        throw error;

        
    }
}