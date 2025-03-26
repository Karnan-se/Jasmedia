import AppError from "../utils/AppError.js";
import { AdminModel } from "../Model/adminModel.js";
import { hashPassword } from "../utils/passwordService.js";
import { comparePassword } from "../utils/passwordService.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwtService.js";
import { attachTokenCookie } from "../utils/cookie.js";

export const userLogin = async (req, res, next) => {
  try {

    const { email, password } = req.body;
    console.log(req)
    console.log(email, password)
    if (!email) {
      throw AppError.conflict("Missing Emailaddress");
    }
    if (!password) {
      throw AppError.conflict("Missing Password");
    }
    const adminDetails = await AdminModel.findOne({ emailAddress: email });
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
    console.log(accessToken , "AccessToken" , "\n" , "\n")
    const refreshToken  = generateRefreshToken(adminDetails._id)
    if(!refreshToken){
      throw AppError.conflict("Error creating the refreshToken")
    }
    console.log(refreshToken  ,  "refreshToken")
    attachTokenCookie("AccessToken", accessToken, res)
    attachTokenCookie("RefreshToken", refreshToken, res)
    


    return res.status(200).json({ adminDetails });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const userRegister = async (req, res, next) => {
    try {
      const { email, password } = req.body;
  
      if (!email) {
        throw AppError.conflict("Missing Email Address");
      }
      if (!password) {
        throw AppError.conflict("Missing Password");
      }
  

      const existingUser = await AdminModel.findOne({ emailAddress: email });
      if (existingUser) {
        throw AppError.validation("Email Already Registered");
      }
  

      const hashedPassword = await hashPassword(password);
  
   
      const newUser = await AdminModel.create({
        emailAddress: email,
        password: hashedPassword,
      });
  
      return res.status(201).json({
        message: "Registration successful",
        user: {
          id: newUser._id,
          email: newUser.emailAddress,
        },
      });
  
    } catch (error) {
      console.log(error);
      next(error);
    }
  };