export default function GenerateOtp(){
    let otp = Math.floor(Math.random()*9000)
    console.log(otp, "otp generater")
    return otp
  }
  