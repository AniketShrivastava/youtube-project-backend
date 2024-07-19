import { User } from "../models/user.model";
import { ApiError } from "../Utils/ApiError";
import { asyncHandler } from "../Utils/asyncHandler";
import jwt from "jsonwebtoken"

const verifyToken = asyncHandler(async(req,_,next)=>{
  try {
    const token =  req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer","")
  
    if(!token){
      throw new ApiError(401, "Unauthorized request")
    }
    const decodedToken = jwt.sign(token,proccess.env.ACCESS_TOKEN_SECRET)
  
  const user =   await User.findById(decodedToken?._id).select("-password -refreshToken")
  if(!user){
      throw new ApiError(401,"Invalid Access Token")
  }
  req.user = user;
  next()
  
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token")
  }
})

export {verifyToken}
