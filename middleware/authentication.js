import { attachTokenCookie } from "../utils/cookie.js";
import { HttpStatus } from "../Enums/enum.js";
import { generateAccessToken , generateRefreshToken , verifyRefreshToken , verifyAccessToken } from "../utils/jwtService.js";
import { AdminModel } from "../Model/adminModel.js";


const jwtAuth = async (req, res, next) => {
  const accessToken = req.cookies["AccessToken"]
  const refreshToken = req.cookies["RefreshToken"]

  if (!refreshToken) {
    console.log("Token is missing");
    return res.status(HttpStatus.FORBIDDEN).json({ err: "Token is Missing", name: "TokenMissingError" })
  }

  try {
    if(accessToken) {
      const { userId } = verifyAccessToken(accessToken);
      const admin = await AdminModel.findById(userId)
      console.log('Admin instance from access:', admin._id, admin.isRootAdmin, admin.emailAddress)
      if (admin) {
        req.user = { id: admin._id, role: admin.isRootAdmin, isBlocked: admin.isBlocked, email: admin.emailAddress }
        return next();
      }
    }
  } catch (err) {
    console.log("Access token verification failed:", err.message);
  }

  try {
    const { userId } = verifyRefreshToken(refreshToken);
    console.log(`User ID: ${userId}`);
    const admin = await AdminModel.findById(userId)
    console.log('Admin instance from refresh:', admin._id, admin.isRootAdmin, admin.emailAddress)
    if(admin){
      const newAccessToken = generateAccessToken(userId)
      attachTokenCookie("AccessToken", newAccessToken, res)
      req.user = { id: admin._id, role: admin.isRootAdmin, isBlocked: admin.isBlocked, email: admin.emailAddress }
      return next()
    } else {
      return res.status(HttpStatus.FORBIDDEN).json({ err: "Refresh Token is Invalid" });
    }
  } catch (error) {
    console.log("Refresh token verification failed:", error.message);
    return res.status(HttpStatus.FORBIDDEN).json({ err: "Refresh Token is Invalid" });
  }
};

export default jwtAuth;


