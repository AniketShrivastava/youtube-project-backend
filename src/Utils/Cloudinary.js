import {v2 as cloudinary} from "cloudinary"
import fs from "fs"


    // Configuration
    cloudinary.config({ 
        cloud_name: Process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: Process.env.CLOUDINARY_API_KEY, 
        api_secret: Process.env.CLOUDINARY_API_SECRET // Click 'View Credentials' below to copy your API secret
    });
    
    const uploadOnCloudinary = async(localFilePath)=>{
        try {
            if(localFilePath) return null
            //upload the file on cloudinary
          const response = await cloudinary.uploader.upload(localFilePath,{
                resource_type:"auto"
            })
            //File has uploaded successfull
            console.log("file is uploaded successfully",response.url);
            return response; 
        } catch (error) {
            fs.unlinksync(localFilePath) 
            //remove the locally saved temporary file as the upload operation got failed
        }
    }

    export {uploadOnCloudinary}