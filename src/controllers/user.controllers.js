import { asyncHandler } from '../utils/async_Handler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiErrors } from '../utils/ApiErrors.js';
import { User } from '../models/users.models.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';
import jwt from "jsonwebtoken";
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({
    path: '../.env'
});



const generateAccessTokenAndRefreshToken = async (userId) => {
    // Logic to generate access and refresh tokens
    try {
        const user = await User.findById(userId);
    
        if (!user) {
            throw new ApiErrors(404, "User not found");
        }

        const accessToken = user.generateAccessTokens();
        const refreshToken = user.generateRefreshTokens();
    
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
    
        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiErrors(500, "Failed to generate access and refresh tokens");
    }
};

const registerUser = asyncHandler(async (req, res) => {
    // Here you would typically handle user registration logic,
    let { fullName, email, username, password } = req.body;

    if ([fullName, email, username, password].some((feild) => feild === ""))
    {
        return res
            .status(400)
            .json(new ApiErrors(400, "All fields are required"));
    }

    const existedUser = await User.findOne({ $or: [{ email }, { username }] });
    {
        if (existedUser) {
            return res
                .status(409)
                .json(new ApiErrors(409, "User with given email or username already exists") );
        }
    };

    console.warn(req.files);
    
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if (!avatarLocalPath){
        throw new ApiErrors(400, "Avatar is required");
    } 

    if (!coverImageLocalPath){
        throw new ApiErrors(400, "Cover image is required");
    }

    const avatar = await uploadToCloudinary(avatarLocalPath)
    console.log("avatar uploaded successfully", avatar);
    

    let coverImage;
    if (coverImageLocalPath) {
        coverImage = await uploadToCloudinary(coverImageLocalPath);
    }
    console.log("cover image uploaded successfully", coverImage);

    const users = await User.create({
        fullName: fullName,
        email,
        username: username.toLowerCase(),
        avatar: avatar.url,
        coverImage: coverImage?.url || '',
        password,
    })

    const createdUser = await User.findById(users._id).select('-password -refreshToken');

    if (!createdUser) {
        throw new ApiErrors(500, "Something went wrong while registering the user");
    }

    return res
        .status(201)
        .json(new ApiResponse(200, createdUser, "User registered successfully"));
    
    
});

const loginUser = asyncHandler(async (req, res) => {
    // Here you would typically handle user login logic,
    console.log("req body : ", req.body);
    
    let { email, username, password } = req.body ;

    if ([email, username, password].some((feild) => feild === ""))
    {
        throw new ApiErrors(400, "All fields are required");
    }

    const user = await User.findOne({ $or: [{ email }, { username }] });
    {
        if (!user) {
            throw new ApiErrors(404, "User not found");
        }
    };

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        throw new ApiErrors(401, "Invalid credentials");
    }

    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: false
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(
            200, 
            {user: loggedInUser, accessToken, refreshToken}, "User logged in successfully"));

});

// const refreshAccessToken = asyncHandler(async (req, res) => {
//     // Here you would typically handle access token refresh logic,

//     console.log(req.cookies);
    
//     const { refreshToken } = req.cookies ;

    

//     if (!refreshToken) {
//         throw new ApiErrors(400, "Refresh token is required");
//     }

//     try {

//         console.log("refresh token is : ", refreshToken);
//         const decodedToken = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET);

//         console.log(decodedToken);
        
//         const user = await User.findById(decodedToken?._id);

        

//         if (!user) {
//             throw new ApiErrors(404, "User not found");
//         }

//         if (user.refreshToken !== refreshToken) {
//             throw new ApiErrors(401, "used refresh token");
//         }

//         const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id);

//         const options = {
//             httpOnly: true,
//             secure: false
//         };

//         return res
//             .status(200)
//             .cookie("accessToken", accessToken, options)
//             .cookie("refreshToken", refreshToken, options)
//             .json(new ApiResponse(
//                 200,
//                 { accessToken, refreshToken },
//                 "Access token refreshed successfully"
//             ));
//     } catch (error) {
//         throw new ApiErrors(401, "Invalid refresh token");
//     }
// });


const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

  if (!incomingRefreshToken) {
      throw new ApiErrors(401, "unauthorized request")
  }

  try {
      const decodedToken = jwt.verify(
          incomingRefreshToken,
          process.env.JWT_REFRESH_TOKEN_SECRET
      )
      console.log(decodedToken);
      
      const user = await User.findById(decodedToken?.userId) ;
      if (!user) {
          throw new ApiErrors(401, "Invalid refresh token")
      }
  
    //   if (incomingRefreshToken !== user?.refreshToken) {
    //       throw new ApiErrors(401, "Refresh token is expired or used")
          
    //   }
  
      const options = {
          httpOnly: true,
          secure: false
      }
  
      const {accessToken, newRefreshToken} = await generateAccessTokenAndRefreshToken(user._id)
  
      return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
          new ApiResponse(
              200, 
              {accessToken, refreshToken: newRefreshToken},
              "Access token refreshed"
          )
      )
  } catch (error) {
      throw new ApiErrors(401, error?.message || "Invalid refresh token")
  }

});

const logoutUser = asyncHandler(async (req, res) => {
    // Here you would typically handle user logout logic,
    await User.findByIdAndUpdate(
        req.user._id,
        { $set: {refreshToken: undefined} },
        { new: true, runValidators: true }

    )
    const options = {
        httpOnly: true,
        secure: false,
        
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
       
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
    // Here you would typically handle password change logic,
    const { oldPassword, newPassword } = req.body;

    if ([oldPassword, newPassword].some((feild) => feild === "")) {
        return res
            .status(400)
            .json(new ApiErrors(400, "All fields are required"));
    }

    const user = await User.findById(req.user?._id);
    const isPasswordMatched = await user.comparePassword(oldPassword);

    if (!isPasswordMatched) {
        return res
            .status(401)
            .json(new ApiErrors(401, "Invalid old password"));
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
    // Here you would typically handle fetching current user logic,
    return res
        .status(200)
        .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});

const updateUserDetails = asyncHandler(async (req, res) => {
    // Here you would typically handle updating user details logic,
    const { fullName, email } = req.body;

    if ([fullName, email].some((feild) => feild === "")) {
        return res
            .status(400)
            .json(new ApiErrors(400, "All fields are required"));
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.user?._id,
        { $set: { fullName, email } },
        { new: true },
    ).select("-password -refreshToken"
    );

    return res
        .status(200)
        .json(new ApiResponse(200, updatedUser, "User details updated successfully"));
});

const updateAvatar = asyncHandler(async (req, res) => {
    // Here you would typically handle updating user avatar logic,

    const avatarLocalPath = req.file?.path;
    if (!avatarLocalPath) {
        throw new ApiErrors(400, "Avatar is required");
    }

    const avatar = await uploadToCloudinary(avatarLocalPath);
    const updatedAvatar = await User.findByIdAndUpdate(
        req.user?._id,
        { $set: { avatar: avatar.url } },
        { new: true }
    ).select("-password -refreshToken");

    return res
        .status(200)
        .json(new ApiResponse(200, updatedAvatar, "User avatar updated successfully"));
});

const updateCoverImage = asyncHandler(async (req, res) => {
    // Here you would typically handle updating user cover image logic,

    const coverImageLocalPath = req.file?.path;

    if (!coverImageLocalPath) {
        throw new ApiErrors(400, "Cover image is required");
    }

    const coverImage = await uploadToCloudinary(coverImageLocalPath);

    const updatedCoverImage = await User.findByIdAndUpdate(
        req.user?._id,
        { $set: { coverImage: coverImage.url } },
        { new: true }
    ).select("-password -refreshToken");

    return res
        .status(200)
        .json(new ApiResponse(200, updatedCoverImage, "User cover image updated successfully"));
});

const getUserChannelProfile = asyncHandler(async (req, res) => {
    // Here you would typically handle fetching user channel profile logic,
    const { username } = req.params;
    
    console.log(username);
    
    if (!username) {
        throw new ApiErrors(400, "Username is required");
    }

    const userDetails = await User.aggregate([
        
        {
            '$match': {
            'username': username.toLowerCase()
            }
        }, {
            '$lookup': {
            'from': 'subscriptions', 
            'localField': '_id', 
            'foreignField': 'subscriber', 
            'as': 'subscribersCount'
            }
        }, {
            '$lookup': {
            'from': 'subscriptions', 
            'localField': '_id', 
            'foreignField': 'subscribedTo', 
            'as': 'subscribedToCount'
            }
        }, {
            '$addFields': {
            'subscribersCount': {
                '$size': '$subscribersCount'
            }, 
            'subscribedToCount': {
                '$size': '$subscribedToCount'
            }
            }
        }, {
            '$project': {
            'username': 1, 
            'email': 1, 
            'fullName': 1, 
            'avatar': 1, 
            'coverImage': 1, 
            'subscribersCount': 1, 
            'subscribedToCount': 1
            }
        }

    ]);

    if (!userDetails || userDetails.length === 0) {
        throw new ApiErrors(404, "User not found");
    }

    console.log("userDetails are : ", userDetails);

    return res
        .status(200)
        .json(new ApiResponse(200, userDetails[0], "User channel profile fetched successfully"));
    
});

const userWatchHistory = asyncHandler(async (req, res) => {
    // Here you would typically handle fetching user watch history logic,req.user?._id   new mongoose.Types.ObjectId(req.user?._id)

    const watchHistory = await User.aggregate([
        
        {
            '$match': {
            '_id': new mongoose.Types.ObjectId(req.user?._id)
            }
        }, {
            '$lookup': {
            'from': 'videos', 
            'localField': 'watchHistory', 
            'foreignField': '_id', 
            'as': 'watchHistoryDetails'
            }
        }, {
            '$lookup': {
            'from': 'users', 
            'localField': 'owner', 
            'foreignField': '_id', 
            'as': 'ownerDetails'
            }
        }, {
            '$project': {
            'username': 1, 
            'avatar': 1, 
            '_id': 1, 
            'watchHistoryDetails': 1, 
            'ownerDetails': 1
            }
        }

    ]);

    console.log(watchHistory);
    

    if (!watchHistory || watchHistory.length === 0) {
        throw new ApiErrors(404, "Watch history not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, watchHistory[0].watchHistoryDetails, "User watch history fetched successfully"));
});

export { registerUser, loginUser, refreshAccessToken, logoutUser, changeCurrentPassword, getCurrentUser, updateUserDetails, updateAvatar, updateCoverImage, getUserChannelProfile, userWatchHistory };

// controller to handle user registration