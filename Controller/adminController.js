import AppError from "../utils/AppError.js";
import { AdminModel } from "../Model/adminModel.js";
import { hashPassword } from "../utils/passwordService.js";
import { comparePassword } from "../utils/passwordService.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwtService.js";
import { attachTokenCookie } from "../utils/cookie.js";
import GenerateOtp from "../Services/generateOtp.js";
import { saveOtp, verifyOtpRedis } from "../Services/Redis.js";
import { sendPasswordResetOTP } from "../Services/emailService.js";


export const userLogin = async (req, res, next) => {
  try {

    const { emailAddress, password } = req.body;
    // console.log(req)
    console.log(emailAddress, password)
    if (!emailAddress) {
      throw AppError.conflict("Missing Emailaddress");
    }
    if (!password) {
      throw AppError.conflict("Missing Password");
    }
    const adminDetails = await AdminModel.findOne({ emailAddress: emailAddress });
    if (!adminDetails) {
      throw AppError.validation("User Not Registered");
    }
    const comparedPassword = await comparePassword(
      password,
      adminDetails.password
    );
    if (!comparedPassword) {
      throw AppError.validation("Password Not Mathing");
    }
    const accessToken = generateAccessToken(adminDetails._id)
    if(!accessToken){
      throw AppError.conflict("Error creating accessToken")
    }
    // console.log(accessToken , "AccessToken" , "\n" , "\n")
    const refreshToken  = generateRefreshToken(adminDetails._id)
    if(!refreshToken){
      throw AppError.conflict("Error creating the refreshToken")
    }
    // console.log(refreshToken  ,  "refreshToken")
    attachTokenCookie("AccessToken", accessToken, res)
    attachTokenCookie("RefreshToken", refreshToken, res)
    


    return res.status(200).json({ adminDetails });
  } catch (error) {
    console.log(error, 'this is value');
    next(error);
  }
};

export const userRegister = async (req, res, next) => {
    try {
      const { emailAddress, password } = req.body;
  
      if (!emailAddress) {
        throw AppError.conflict("Missing Email Address");
      }
      if (!password) {
        throw AppError.conflict("Missing Password");
      }
  

      const existingUser = await AdminModel.findOne({ emailAddress: emailAddress });
      if (existingUser) {
        throw AppError.validation("Email Already Registered");
      }
  

      const hashedPassword = await hashPassword(password);
  
   
      const newUser = await AdminModel.create({
        emailAddress: emailAddress,
        password: hashedPassword,
      });
  
      return res.status(201).json({
        message: "Registration successful",
        user: {
          id: newUser._id,
          emailAddress: newUser.emailAddress,
        },
      });
  
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  export const forgotPassword = async(req, res, next)=>{
    try {
      const {emailAddress} = req.body;
      const userDetails = await AdminModel.findOne({emailAddress : emailAddress})
      console.log(emailAddress)
      if(!userDetails){
        throw AppError.conflict("Email Address not found")
      }
      const otp  = GenerateOtp()
      const storedOtp =  await saveOtp(otp , emailAddress)
      console.log(storedOtp , "storedOtp")
      const {success , error} = await sendPasswordResetOTP(emailAddress , otp)
      if(error){
        console.log(error , "error in sending the mail")
      }
      return res.status(200).json({message: "Otp creaated send the mai;"})

    } catch (error) {
      console.log(error)
      next(error)
      
    }
  }

  export const verifyOtp = async(req, res , next)=>{
    try {
      const {emailAddress , otp} = req.query;
      if(!otp) throw AppError.conflict("OtP notRecieved");
      if(!emailAddress) throw AppError.conflict("Email not recieved")
        const verified = await verifyOtpRedis(otp, emailAddress)
      if(!verified){
        throw AppError.conflict("Error verifiying user")
      }
      return res.status(200).json({message : "Otp verified" , verified})
      
    } catch (error) {
      console.log(error);
      next(error)
      
      
    }
  }

  export const changePassword = async(req, res, next)=>{
    try {
      const {emailAddress , password} = req.body;
      if(!emailAddress) throw AppError.conflict("no EmailAddress")
        if(!password) throw AppError.conflict("no Password")
          const isUser = await AdminModel.findOne({emailAddress : emailAddress })
        if(!isUser){
          throw AppError.conflict("User not registered")
        }
        isUser.password = password
        await isUser.save()
        return res.status(200).json({message : "Password changed succussfully"})
      
      
    } catch (error) {
      console.log(error)
      next(error)
      
    }
  }

  export const createRootAdmin = async(req, res, next)=>{
    try {

      
      const { emailAddress, password, name, isRootAdmin = false } = req.body;
  
      if (!emailAddress) {
        throw AppError.conflict("Missing Email Address");
      }
      if (!password) {
        throw AppError.conflict("Missing Password");
      }
  

      const existingUser = await AdminModel.findOne({ emailAddress: emailAddress });
      if (existingUser) {
        throw AppError.validation("Email Already Registered");
      }
  

      const hashedPassword = await hashPassword(password);
  
   
      const newUser = await AdminModel.create({
        emailAddress: emailAddress,
        password: hashedPassword,
        isRootAdmin,
        name,
      });
      
  
      return res.status(201).json({
        message: "Registration successful",
        user: {
          id: newUser._id,
          emailAddress: newUser.emailAddress,
        },
      });
      
    } catch (error) {
      console.log(error)
      next(error)
      
    }
  }

  export const checkisRootAdmin = async(req )=>{
    try {
      console.log(req.user.id , "userId got from the middleware ")
      if(!req.user.id){
        throw AppError.conflict("session Expired")
      }
      const admin = await AdminModel.findOne({_id: req.user.id})
      if(!admin.isRootAdmin){
        throw AppError.validation("Access restricted by the Admin")
        
      }
      return admin.isRootAdmin
      
    } catch (error) {
      throw error
      
    }
  }