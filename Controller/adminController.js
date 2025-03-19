import AppError from "../utils/AppError.js";
import { AdminModel } from "../Model/adminModel.js";
import { hashPassword } from "../utils/passwordService.js";
import { comparePassword } from "../utils/passwordService.js";

export const userLogin = async (req, res, next) => {
  try {

    const { email, password } = req.body;
    if (!email) {
      throw AppError.conflict("Missing Emailaddress");
    }
    if (!password) {
      throw AppError.conflict("Missing Password");
    }
    const isEmailExist = await AdminModel.findOne({ emailAddress: email });
    if (!isEmailExist) {
      throw AppError.validation("User Not Registered");
    }
    const comparedPassword = await comparePassword(
      password,
      isEmailExist.password
    );
    if (!comparedPassword) {
      throw AppError.validation("Password Not Mathing");
    }

    return res.status(200).json({ isEmailExist });
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