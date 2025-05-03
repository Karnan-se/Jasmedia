import nodemailer  from "nodemailer"
import { configKeys } from "../config"
import { generateOTPEmailTemplate } from "./EmailTemplate";


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: configKeys.Mail,
    pass: configKeys.Mail_Password,
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
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}


