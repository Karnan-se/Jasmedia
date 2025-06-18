import nodemailer  from "nodemailer"
import { configKeys } from "../config.js"
import { generateOTPEmailTemplate } from "./EmailTemplate.js";


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: 'thwahirpvmohd@gmail.com',
    pass: 'ksyw xmuv squc ozqj',
  },
});


export async function sendPasswordResetOTP(email, otp) {
  try {
    console.log(configKeys.Mail)
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


