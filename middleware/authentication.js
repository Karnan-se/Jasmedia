import { attachTokenCookie } from "../utils/cookie.js";
import { HttpStatus } from "../Enums/enum.js";
import { generateAccessToken , generateRefreshToken , verifyRefreshToken , verifyAccessToken } from "../utils/jwtService.js";


const jwtAuth = async (req, res, next) => {
  const accessToken = req.cookies["AccessToken"];
  const refreshToken = req.cookies["RefreshToken"];

console.log(refreshToken , "refreshToken")

  if (!refreshToken) {
    console.log("Token is missing");
    return res.status(HttpStatus.FORBIDDEN).json({ err: "Token is Missing", name: "TokenMissingError" });
  }

  try {
    if (accessToken) {
      const { userId, role } = verifyAccessToken(accessToken);

      if (userId && role) {
        req.user = { id: userId, role };
        console.log(role , "role ") 
        return next();
      }
    }
  } catch (err) {
    console.log("Access token verification failed:", err.message);
  }

  try {
    const { userId, role } = verifyRefreshToken(refreshToken);
    console.log(`User ID: ${userId}, Role: ${role}`);

    const newAccessToken = generateAccessToken(userId, role);
    attachTokenCookie("AccessToken", newAccessToken, res);

    console.log("Access token expired, but refresh token is valid. Issued new access token.");
    req.user = { id: userId, role };
    return next();
  } catch (error) {
    console.log("Refresh token verification failed:", error.message);
    return res.status(HttpStatus.FORBIDDEN).json({ err: "Refresh Token is Invalid" });
  }
};

export default jwtAuth;


