import { configKeys } from "../config.js";

const attachTokenCookie = (cookieName, Token, res) => {
    const cookieOption = {
        httpOnly: true,
        secure: configKeys.NODE_ENV === "production",
        signed: false,
        sameSite: configKeys.NODE_ENV === "production" ? "none" : "lax",
        maxAge: cookieName === "AccessToken" ? configKeys.ACCESS_TOKEN_EXPIRES_IN : configKeys.REFRESH_TOKEN_EXPIRES_IN
    };

    try {
        res.cookie(cookieName, Token, cookieOption);
        console.log("Cookie Attached");
    } catch (error) {
        console.error(error);
    }
};

export { attachTokenCookie };
