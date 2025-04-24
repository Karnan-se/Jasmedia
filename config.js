import dotenv from "dotenv"
dotenv.config()


export const configKeys = {
    PORT_NUMBER : process.env.PORT,
    MONGOOSE_URL : process.env.MONGOOSEURL,
    CLIENT_ORGIN : process.env.CLIENT_ORGIN,
    JWTSECRET :process.env.JWTTOKEN,
    NODE_ENV: process.env.NODE_ENV,
    ACCESS_TOKEN_EXPIRES_IN :15 * 60 * 1000,
    REFRESH_TOKEN_EXPIRES_IN : 7 * 24 * 60 * 60 * 1000,

    Cloudinary_cloud_name: process.env.CLOUD_NAME,
    Cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
    Cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
    Google_client_Id: process.env.Google_Client_Id,
    Google_User_Password : process.env.GoogleUserPassword

}