import dotenv from "dotenv"
dotenv.config()


export const configKeys = {
    PORT_NUMBER : process.env.PORT,
    MONGOOSE_URL : process.env.MONGOOSEURL
    

}