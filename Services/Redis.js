
import AppError from "../utils/AppError.js";
import { configKeys } from "../config.js"
import { createClient } from 'redis';

export const client = createClient({
    username: 'default',
    password: 'CdhZDmIKsVFoKZEqQyjLAPectRwNuS1c',
    socket: {
        host: 'redis-17411.crce179.ap-south-1-1.ec2.redns.redis-cloud.com',
        port: 17411
    }
});

client.on('error', err => console.log('Redis Client Error', err));

await client.connect();

// await client.set('emailaddress', 'bar');
// const result = await client.get('emailaddress');
// console.log(result)  


export const saveOtp = async (otp, emailAddress) => {
  try {
    if (!emailAddress || !otp) {
      throw AppError.conflict("Email Address or Otp is not found");
    }

    const email = emailAddress.toString();
    await client.set(`otp:${email}`, otp, {
      EX: 60 
    });

    const result = await client.get(`otp:${email}`);
    return result;

  } catch (error) {
    console.log("Redis saveOtp error:", error);
    throw error;
  }
};

export const verifyOtpRedis = async(otp , email)=>{
    try {
          const result = await client.get(`otp:${email}`);
          console.log(result , "result")
          if(result == otp){
            return result
          }else {
            throw AppError.conflict("otp is not matching")
          }
        
    } catch (error) {
        console.log(error)
        throw error
        
    }

}
