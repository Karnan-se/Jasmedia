import nodemailer  from "nodemailer"
import { configKeys } from "../config.js"
import { generateOTPEmailTemplate } from "./EmailTemplate.js"
import { AdminModel } from "../Model/adminModel.js"
import AppError from "../utils/AppError.js";
import { contactEmailTemplate } from "./ContactEmailTemplate.js";


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: 'thwahirpvmohd@gmail.com',
    pass: 'ksyw xmuv squc ozqj',
  },
});


export async function sendPasswordResetOTP(email, otp) {
  try {
    const mailOptions = {
      from: configKeys.Mail,
      to: email,
      subject: 'Password Reset Verification Code',
      html: generateOTPEmailTemplate(otp)
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}


export const saveOtp = async (otp, emailAddress) => {
  try {
    const user = await AdminModel.findOne({emailAddress: emailAddress})
    if(!user){
      throw AppError.conflict('Email address not exits!')
    }

    user.otp = otp
    await user.save()
  } catch (error) {
    throw error
  }

}

export const otpVerify = async (otp, emailAddress) => {
  try {
    const user = await AdminModel.findOne({emailAddress: emailAddress})

    if(!user){
      throw AppError.conflict('Email address not exits!')
    }
    if(!user.otp){
      throw AppError.validation('Failed!. Try with new OTP')
    }

    if(user.otp == otp){
      user.otp = ''
      await user.save()
      return true
    }
    return false
  } catch (error) {
    throw error
  }
}


export const sendContactMail = async (name, fromMail, number, message) => {
  try {
    const mailOption = {
      from: fromMail,
      to: configKeys.Mail,
      subject: 'User Enquiry',
      html: contactEmailTemplate(name, fromMail, number, message)
    }

    const info = await transporter.sendMail(mailOption)
    console.log('email sented :', info.messageId)
    return true
  } catch (error) {
    console.log(error)
    return false
  }
}


