import { categoryModel } from "../Model/categoryModel.js";
import { Portfolio } from "../Model/PortFolio.js";
import { Feedback } from "../Model/FeedbackModel.js";
import { HttpStatus } from "../Enums/enum.js";
import { AdminModel } from "../Model/adminModel.js";
import AppError from "../utils/AppError.js";
import { checkisRootAdmin } from "./adminController.js";


export const adminDashboard = async (req, res, next) => {
  try {
    const totalCategory = (await categoryModel.find()).length;
    const totalportfolio = (await Portfolio.find()).length;
    const totalFeedback = (await Feedback.find()).length;
    const data = {
      totalCategory: totalCategory,
      totalportfolio: totalportfolio,
      totalFeedback: totalFeedback,
    };
    return res.status(HttpStatus.OK).json({ data: data });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const adminDetails = async (req, res, next) => {
  try {
    const admins = await AdminModel.find();
    res.status(HttpStatus.OK).json({ admins });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const editAdmin = async (req, res, next) => {
  try {
    const { emailAddress, name, isRootAdmin = false } = req.body;

         const isRootadmin = checkisRootAdmin(req)
             if(!isRootadmin){
              console.log("user has no Access")
              return 
             }

    if (!emailAddress) {
      throw AppError.conflict("Missing Email Address");
    }
    if (!name) {
      throw AppError.conflict("missing name");
    }
    const isExising = await AdminModel.findOne({ emailAddress });
    if (!isExising) {
      throw AppError.conflict("admin not registered");
    }
    isExising.name = name;
    isExising.isRootAdmin = isRootAdmin;

    await isExising.save();
  } catch (error) {
    console.log(error);
    next(error)
  }
};

export const toggleAdmin = async (req, res, next) => {
  try {
    const { adminId } = req.body;

         const isRootadmin = checkisRootAdmin(req)
             if(!isRootadmin){
              console.log("user has no Access")
              return 
             }

    if (!adminId) {
      throw AppError.conflict("No admin ID provided");
    }

    const existingAdmin = await AdminModel.findById(adminId);
    if (!existingAdmin) {
      throw AppError.conflict("Admin does not exist");
    }

    const updatedAdmin = await AdminModel.findByIdAndUpdate(
      adminId,
      { $set: { isBlocked: !existingAdmin.isBlocked } },
      { new: true }
    );

    return res.status(HttpStatus.OK).json({
      message: "Success",
      admin: updatedAdmin
    });

  } catch (error) {
    console.error(error);
    next(error); 
  }
};

