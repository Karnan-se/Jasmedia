import AppError from "../utils/AppError.js";
import { UserModal } from "../Model/userModel.js";
import { hashPassword, comparePassword } from "../utils/passwordService.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwtService.js";
import { attachTokenCookie } from "../utils/cookie.js";
import { googleSignIncallback } from "../Services/googleService.js";
import { configKeys } from "../config.js";

export const userRegister = async (req, res, next) => {
  try {
    const { email, password, name, photo } = req.body;

    if (!email) throw AppError.conflict("Missing Email Address");
    if (!password) throw AppError.conflict("Missing Password");

    const existingUser = await UserModal.findOne({ emailAddress: email });
    if (existingUser) throw AppError.validation("Email Already Registered");

    const hashedPassword = await hashPassword(password);

    const newUser = await UserModal.create({
      emailAddress: email,
      password: hashedPassword,
      name,
      photo
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

export const userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email) throw AppError.conflict("Missing Emailaddress");
    if (!password) throw AppError.conflict("Missing Password");

    const userDetails = await UserModal.findOne({ emailAddress: email });
    if (!userDetails) throw AppError.validation("User Not Registered");

    const matchedPassword = await comparePassword(password, userDetails.password);
    if (!matchedPassword) throw AppError.validation("Password Not Matching");

    const accessToken = generateAccessToken(userDetails._id);
    if (!accessToken) throw AppError.conflict("Error creating accessToken");

    const refreshToken = generateRefreshToken(userDetails._id);
    if (!refreshToken) throw AppError.conflict("Error creating the refreshToken");

    attachTokenCookie("AccessToken", accessToken, res);
    attachTokenCookie("RefreshToken", refreshToken, res);

    return res.status(200).json({ userDetails });

  } catch (error) {
    console.log(error, "User login error");
    next(error);
  }
};



export const googleSignIn  = async(req, res , next)=>{
  try {
    const {token} = req.body
    if(!token){
      throw AppError.conflict("There is not Token ")
    }
    const { email, name, picture } = googleSignIncallback(token)

    let user = await UserModal.findOne({ emailAddress: email });

    const hashedPassword = await hashPassword(configKeys.Google_User_Password)
    if(!hashedPassword){
      throw AppError.conflict("Error Hashing the Password")
    }

    if (!user) {
      user = await UserModal.create({
        name,
        emailAddress: email,
        photo: picture,
        password: hashedPassword, 
      });
    }
    const accessToken = generateAccessToken(user._id);
    if (!accessToken) throw AppError.conflict("Error creating accessToken");

    const refreshToken = generateRefreshToken(user._id);
    if (!refreshToken) throw AppError.conflict("Error creating the refreshToken");

    attachTokenCookie("AccessToken", accessToken, res);
    attachTokenCookie("RefreshToken", refreshToken, res);

    res.status(200).json({ message: "Google Sign-In successful", user });

    
  } catch (error) {
    console.log(error)
    next(error)
    
  }
}