import bcrypt  from "bcrypt"
export const hashPassword =  async(password) =>{
    const hashedPassword = await bcrypt.hash(password, 10)
    return hashedPassword
}

export const comparePassword = async(password , savedPassword) =>{
    const hashedPassword = await bcrypt.compare(password , savedPassword)
    return hashedPassword
}