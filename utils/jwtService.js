import { configKeys } from "../config.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = configKeys.JWTSECRET; 
const ACCESS_TOKEN_EXPIRES_IN = "15m";
const REFRESH_TOKEN_EXPIRES_IN = "7d";

function generateAccessToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });
}

function generateRefreshToken(userId) { 
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });
}

function verifyAccessToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid Access Token");
  }
}

function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET); 
  } catch (error) {
    throw new Error("Invalid Refresh Token");
  }
}

export { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken };
