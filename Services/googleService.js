import { OAuth2Client } from "google-auth-library"
import { configKeys } from "../config.js"


const client = new OAuth2Client(configKeys.Google_client_Id)


export const googleSignIncallback = async (token)=>{
    try {
        const ticket = await client.verifyIdToken({
            idToken :token, 
            audience:configKeys.Google_client_Id,
        })

        const payload =  ticket.getPayload();
        const { email, name, picture } = payload;

        return {email , name , picture}
        
    } catch (error) {
        console.log(error)
        throw error
        
    }
}