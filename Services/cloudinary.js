import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import { configKeys } from "../config.js";


dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

  export const Requestsignedurl = async(timestamp , publicId,  resourceType )=>{

    console.log(timestamp , "timeStamp" , publicId  ,  "publicId" )


    try {
      const signature =  cloudinary.utils.api_sign_request(
        { timestamp, public_id: publicId } , configKeys.Cloudinary_api_secret );
        
    
        
    
        return {
          signedUrl: `https://api.cloudinary.com/v1_1/${configKeys.Cloudinary_cloud_name}/${resourceType}/upload`,
          timestamp,
          publicId,
          signature,
          apiKey: configKeys.Cloudinary_api_key,

        };
    
      
    } catch (error) {
      console.log(error)
      throw error
      
    }

 

  }

