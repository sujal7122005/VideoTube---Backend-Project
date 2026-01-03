import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.models.js"
import {User} from "../models/users.models.js"
import {ApiErrors} from "../utils/ApiErrors.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/async_Handler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    console.log("req.body tweet : ",req.body);
    
    const {content} = req.body;
    if(!content){
        throw new ApiErrors(404, "Content is required to create a tweet");
    }
    const tweet = await Tweet.create({
        content,
        tweetedBy: req.user._id
    });

    return res
        .status(201)
        .json(new ApiResponse(200, tweet, "Tweet created successfully"));
});    

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const userId = req.params.userId;

    if(!isValidObjectId(userId)){
        throw new ApiErrors("Invalid user id");
    }
    const user = await User.findById(userId);
    if(!user){
        throw new ApiErrors("User not found", null, 404);
    }
    const tweets = await Tweet.find
    (
        {
            tweetedBy: userId
        }
    ).sort({createdAt: -1});
    return res
        .status(200)
        .json(new ApiResponse(200, tweets, "User tweets fetched successfully"));
});

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const {content} = req.body;
    const tweetId = req.params.tweetId;

    if(!content){
        throw new ApiErrors("Content is required to update a tweet");
    }
    if(!isValidObjectId(tweetId)){
        throw new ApiErrors("Invalid tweet id");
    }
    const tweet = await Tweet.findById(tweetId);
    if(!tweet){
        throw new ApiErrors("Tweet not found", null, 404);
    }
    if(tweet.tweetedBy.toString() !== req.user._id.toString()){
        throw new ApiErrors("You are not authorized to update this tweet");
    }
    const updatedTweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {
            content
        },
        {
            new: true
        }
    );
    return res
        .status(200)
        .json(new ApiResponse(200, updatedTweet, "Tweet updated successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const tweetId = req.params.tweetId;

    if(!isValidObjectId(tweetId)){
        throw new ApiErrors("Invalid tweet id");
    }
    const tweet = await Tweet.findById(tweetId);
    if(!tweet){
        throw new ApiErrors("Tweet not found", null, 404);
    }
    if(tweet.tweetedBy.toString() !== req.user._id.toString()){
        throw new ApiErrors("You are not authorized to delete this tweet");
    }
    const deletedTweet = await Tweet.findByIdAndDelete(tweetId);
    return res
        .status(200)
        .json(new ApiResponse(200, deletedTweet, "Tweet deleted successfully"));
});

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
