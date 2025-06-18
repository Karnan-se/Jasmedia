
export const generateOTPEmailTemplate = (otp) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; padding: 20px; border-radius: 10px; background-color: #ffffff; border: 1px solid #ddd; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
    <div style="text-align: center; margin-bottom: 20px;">
      <h1 style="color: #333; margin: 0;">Jasmedia</h1>
    </div>
    <h2 style="color: #333; text-align: center;">Forgot Password</h2>
    <p style="font-size: 16px; color: #555; text-align: center;">We received a request to reset your password. Please use the verification code below to complete the process:</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; border: 1px dashed #ccc; display: inline-block;">
        <span style="font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #007BFF;">${otp}</span>
      </div>
    </div>
    
    <p style="font-size: 16px; color: #555; text-align: center;">This code will expire in 10 minutes.</p>
    
    <p style="font-size: 14px; color: #999; text-align: center; margin-top: 30px;">
      If you didn't request this password reset, please ignore this email or contact support if you have concerns.
    </p>
  </div>
`;