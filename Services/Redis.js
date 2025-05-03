import Redis from "ioredis";

const redis = new Redis()


export const saveOtp = async(otp , emailAddress)=>{
    await redis.setex(`otp:${emailAddress}`, 300, otp);
   const stored =  await redis.get(`otp:${emailAddress}`)
   return stored
}