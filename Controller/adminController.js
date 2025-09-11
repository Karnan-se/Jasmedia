import AppError from "../utils/AppError.js";
import { AdminModel } from "../Model/adminModel.js";
import { hashPassword } from "../utils/passwordService.js";
import { comparePassword } from "../utils/passwordService.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwtService.js";
import { attachTokenCookie } from "../utils/cookie.js";
import GenerateOtp from "../Services/generateOtp.js";
import { sendPasswordResetOTP, otpVerify, saveOtp, sendContactMail } from "../Services/emailService.js";
import { HttpStatus } from "../Enums/enum.js";


export const userLogin = async (req, res, next) => {
  try {

    const { emailAddress, password } = req.body;
    
    if (!emailAddress) {
      throw AppError.conflict("Missing Emailaddress");
    }
    if (!password) {
      throw AppError.conflict("Missing Password");
    }

    const adminDetails = await AdminModel.findOne({ emailAddress: emailAddress });
    if (!adminDetails) {
      throw AppError.validation("User not found!");
    }

    const comparedPassword = await comparePassword(
      password,
      adminDetails.password
    );
    if (!comparedPassword) {
      throw AppError.validation("Password Not Mathing");
    }
    
    if(adminDetails.isBlocked) {
      return res.status(400).json({
      'message': 'Your account has been blocked!',
      'isBlocked': adminDetails.isBlocked
    });
    }

    const accessToken = generateAccessToken(adminDetails._id)
    if(!accessToken){
      throw AppError.conflict("Error creating accessToken")
    }
   
    const refreshToken  = generateRefreshToken(adminDetails._id)
    if(!refreshToken){
      throw AppError.conflict("Error creating the refreshToken")
    }
 
    attachTokenCookie("AccessToken", accessToken, res)
    attachTokenCookie("RefreshToken", refreshToken, res)

    return res.status(200).json({
      'name': adminDetails.name,
      'email': adminDetails.emailAddress,
      'isRootAdmin': adminDetails.isRootAdmin,
      'isBlocked': adminDetails.isBlocked
    });
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
      
      if(!userDetails){
        throw AppError.conflict("No account found with this email.")
      }
    
      const otp  = GenerateOtp()
      await saveOtp(otp , emailAddress)
      const success = await sendPasswordResetOTP(emailAddress , otp)
      if(success){
        return res.status(200).json({message: "OTP has been sent successfully."})
      }
      return res.status(400).json({message: "Failed to send OTP. Check your connection."})
    } catch (error) {
      console.log(error)
      next(error)
    }
  }

  export const verifyOtp = async(req, res , next)=>{
    try {
      const {emailAddress , otp} = req.body

      if(!otp){
        throw AppError.conflict("OTP not received? Try again!")
      }
      if(!emailAddress){
        throw AppError.conflict("Please enter your email to receive the code!")
      }

      const isOtpVerified = await otpVerify(otp, emailAddress)
      if(isOtpVerified){
        return res.status(200).json({message : "OTP verified"})
      } else {
        return res.status(400).json({message : "Invalid OTP!"})
      }
    } catch (error) {
      console.log(error);
      next(error)    
    }
  }

  export const changePassword = async(req, res, next)=>{
    try {
      const {emailAddress , password} = req.body;

      if(!emailAddress){
        return res.status(409).json({email : "Email not recieved!"}) 
      }
      if(!password){
        return res.status(400).json({password : "Password not recieved!"}) 
      }

      const isUser = await AdminModel.findOne({emailAddress : emailAddress })
      if(!isUser){
        return res.status(400).json({unregistered : "Email is not registered!"}) 
      }

      const hashedPassword = await hashPassword(password);
      isUser.password = hashedPassword
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
  
      if(req.isBlocked) {
        return res.status(HttpStatus.FORBIDDEN).json({ err: "Your account is currently blocked!" });
      }
      if(!req.role) {
        return res.status(HttpStatus.BAD_REQUEST).json({ err: "Oops! You're not allowed to create users!" });
      }
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


  