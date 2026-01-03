import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';
import { Video } from '../models/videos.models.js';
import { ApiErrors } from './ApiErrors.js';

dotenv.config({
    path: ".env"
});


cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME , 
        api_key: process.env.CLOUDINARY_API_KEY , 
        api_secret: process.env.CLOUDINARY_API_SECRET 
});

// function to upload image to cloudinary

const uploadToCloudinaryVideo = async (filePath) => {
    try {
        if(!filePath) return null;

        const response = await cloudinary.uploader.upload(filePath, 
        {
            resource_type: "video",
            folder: "uploads"
        });
        console.log("file is uploaded successfully on cloudinary. file url:" + response.url);
        
        fs.unlinkSync(filePath); // delete the local file after upload on cloudinary

        console.log("response : ",response);
        

        return response;

    } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        fs.unlinkSync(filePath); // delete the local file in case of error
        return null;
    }
}

const uploadToCloudinary = async (filePath) => {
    try {
        if(!filePath) return null;

        const response = await cloudinary.uploader.upload(filePath, {
            resource_type: "image",
            folder: "uploads"
        });
        console.log("file is uploaded successfully on cloudinary. file url:" + response.url);
        
        fs.unlinkSync(filePath); // delete the local file after upload on cloudinary

        return response;
            

    } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        fs.unlinkSync(filePath); // delete the local file in case of error
        return null;
    }
}

const deleteFromCloudinary = async (publicId, resourceType="auto") => {
    try {
        const response = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
        console.log("File deleted from Cloudinary:", response);
        return response;
    } catch (error) {
        console.error("Error deleting from Cloudinary:", error);
        return null;
    }
}

export { uploadToCloudinary, uploadToCloudinaryVideo, deleteFromCloudinary };

// // Fix the cloudinary import
// import { v2 as cloudinary } from 'cloudinary';
// import fs from 'fs';
// import dotenv from 'dotenv';
// import path from 'path';
// import { Video } from '../models/videos.models.js';

// dotenv.config({
//     path: ".env"
// });

// cloudinary.config({ 
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
//     api_key: process.env.CLOUDINARY_API_KEY, 
//     api_secret: process.env.CLOUDINARY_API_SECRET 
// });

// // Upload video to cloudinary
// const uploadToCloudinaryVideo = async (filePath) => {
//     try {
//         if (!filePath) {
//             console.log("No file path provided");
//             return null;
//         }

//         // Check if file exists
//         if (!fs.existsSync(filePath)) {
//             console.log("File does not exist:", filePath);
//             return null;
//         }

//         console.log("Uploading video from:", filePath);
        
//         const response = await cloudinary.uploader.upload(filePath, {
//             resource_type: "video",
//             folder: "uploads"
//         });

//         console.log("Video uploaded successfully:", response.url);
        
//         // Delete local file after successful upload
//         fs.unlinkSync(filePath);
        
//         return response;
//     } catch (error) {
//         console.error("Error uploading video to Cloudinary:", error.message);
        
//         // Only delete file if it exists
//         if (fs.existsSync(filePath)) {
//             fs.unlinkSync(filePath);
//         }
        
//         throw error; // Re-throw error instead of returning null
//     }
// }

// // Upload image to cloudinary
// const uploadToCloudinary = async (filePath) => {
//     try {
//         if (!filePath) {
//             console.log("No file path provided");
//             return null;
//         }

//         // Check if file exists
//         if (!fs.existsSync(filePath)) {
//             console.log("File does not exist:", filePath);
//             return null;
//         }

//         console.log("Uploading image from:", filePath);
        
//         const response = await cloudinary.uploader.upload(filePath, {
//             resource_type: "image",
//             folder: "uploads"
//         });

//         console.log("Image uploaded successfully:", response.url);
        
//         // Delete local file after successful upload
//         fs.unlinkSync(filePath);
        
//         return response;
//     } catch (error) {
//         console.error("Error uploading image to Cloudinary:", error.message);
        
//         // Only delete file if it exists
//         if (fs.existsSync(filePath)) {
//             fs.unlinkSync(filePath);
//         }
        
//         throw error; // Re-throw error instead of returning null
//     }
// }

// export { uploadToCloudinary, uploadToCloudinaryVideo };

