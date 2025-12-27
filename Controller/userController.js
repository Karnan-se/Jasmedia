import AppError from "../utils/AppError.js";
import { UserModal } from "../Model/userModel.js";
import { hashPassword, comparePassword } from "../utils/passwordService.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwtService.js";
import { attachTokenCookie } from "../utils/cookie.js";
import { googleSignIncallback } from "../Services/googleService.js";
import { configKeys } from "../config.js";
import { Portfolio } from "../Model/PortFolio.js";
import { collection, HttpStatus } from "../Enums/enum.js";
import { Feedback } from "../Model/FeedbackModel.js";
import { categoryModel } from "../Model/categoryModel.js";
import { sendContactMail } from "../Services/emailService.js";
import { Contact } from "../Model/ContactModel.js";

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


// Latest 6 portfolio 
export const getLatestPortfolio = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.find({ status: true })
      .sort({ createdAt: -1 }) 
      .limit(6)
      .populate(collection.CATEGORY);

    res.status(HttpStatus.OK).json({ data: portfolio });
  } catch (error) {
    console.log(error);
    next(error); 
  }
};


// All Feeback
export const getAllFeedback = async (req, res, next) => {
    try {          
      const feedbacks = await Feedback.find({ status: true }).sort({ createdAt: -1 }); 
      return res.status(HttpStatus.OK).json({ data: feedbacks });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };


  // All Portfolio 
  export const getAllPortFolio = async (req, res, next) => {
    try {
      const portfolio = await Portfolio.find({ status: true })
      .sort({ createdAt: -1 })
      .populate("category");
      res.status(HttpStatus.OK).json({ data: portfolio });
    } catch (error) {
      console.log(error);
      throw error;
    }
  };


  // All Category
  export const getCategory = async(req, res, next)=>{
      try {
          const categories = await categoryModel.find(
            { status: true },           
            { name: 1, _id: 0 }         
        );
        const categoryNames = categories.map(category => category.name);
        res.status(HttpStatus.OK).json({ category: categoryNames });
      } catch (error) {
          console.log(error)
          throw error
          
      }

  }


  export const contactMail = async (req, res, next) => {
    try {
      const {name, email, phoneNumber, message} = req.body

      if(!email) {
        throw AppError.conflict('Enter your email!')
      }
      
      // Save to database
      await Contact.create({
        name,
        email,
        phoneNumber, 
        message
      })

      // Maintain only 5 latest records
      const count = await Contact.countDocuments();
      if (count > 5) {
        const oldestContact = await Contact.findOne().sort({ createdAt: 1 });
        if (oldestContact) {
            await Contact.findByIdAndDelete(oldestContact._id);
        }
      }

      const isSuccess = await sendContactMail(name, email, phoneNumber, message)
      if(isSuccess) {
        return res.status(200).json({message: "Message sent successfully!"})
      }
      return res.status(400).json({message: "Failed to send message. Please try again."})
    } catch (error) {
       console.log(error)
       next(error)
    }
  }
