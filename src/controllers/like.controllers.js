import mongoose, { isValidObjectId } from "mongoose"
import {Like} from "../models/like.models.js"
import {User} from "../models/users.models.js"
import {ApiErrors} from "../utils/ApiErrors.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/async_Handler.js"
import { Video } from "../models/videos.models.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video

    if(!isValidObjectId(videoId)){
        throw new ApiErrors(400, "Invalid video id")
    }
    console.log("videoId : ", videoId);
    
    const userId = req.user?._id

    console.log("userId : ", userId);
    
    const video = await Like.findOne({likedBy: userId, video: videoId})

    console.log("video : ", video);

    if(video){
        //unlike
        await Like.deleteOne({likedBy: userId, video: videoId})
        return res.status(200).json(new ApiResponse(200, {liked: false}, "Video unliked successfully"))
    }else{
        //like
        await Like.create({likedBy: userId, video: videoId})
        return res.status(200).json(new ApiResponse(200, {liked: true}, "Video liked successfully"))
    }

})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment
    if(!isValidObjectId(commentId)){
        throw new ApiErrors(400, "Invalid comment id")
    }
    const userId = req.user?._id
    const comment = await Like.findOne({user: userId, comment: commentId})
    if(comment){
        //unlike
        await Like.deleteOne({likedBy: userId, comment: commentId})
        return res.status(200).json(new ApiResponse(200, {liked: false}, "Comment unliked successfully"))
    }else{
        //like
        await Like.create({likedBy: userId, comment: commentId})
        return res.status(200).json(new ApiResponse(200, {liked: true}, "Comment liked successfully"))
    }

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
    if(!isValidObjectId(tweetId)){
        throw new ApiErrors(400, "Invalid tweet id")
    }
    const userId = req.user?._id
    const tweet = await Like.findOne({likedBy: userId, tweet: tweetId})
    if(tweet){
        //unlike
        await Like.deleteOne({likedBy: userId, tweet: tweetId})
        return res.status(200).json(new ApiResponse(200, {liked: false}, "Tweet unliked successfully"))
    }else{
        //like
        await Like.create({likedBy: userId, tweet: tweetId})
        return res.status(200).json(new ApiResponse(200, {liked: true}, "Tweet liked successfully"))
    }
})

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const userId = req.user?._id
    const likedVideos = await Like.find({likedBy: userId, video: {$ne: null}}).populate("video")
    const videos = likedVideos.map(like => like.video)
    return res.status(200).json(new ApiResponse(200, videos, "Liked videos fetched successfully"))
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}