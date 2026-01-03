import mongoose, { isValidObjectId } from "mongoose"
import {Subscription} from "../models/subscriptions.models.js"
import {User} from "../models/users.models.js"
import {ApiErrors} from "../utils/ApiErrors.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/async_Handler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription
    console.log("params :",req.params);
    console.log("channel id : ",channelId);
    
    const subscriberId = req.user._id
    if(!isValidObjectId(channelId)){
        throw new ApiErrors(400, "Invalid channel id")
    }

    const subscription = await Subscription.findOne({
        subscribers: subscriberId,
        subscribedTo: channelId
    })

    if(subscription){
        await Subscription.deleteOne({
            subscribers: subscriberId,
            subscribedTo: channelId
        })
        return res
            .status(200)
            .json(new ApiResponse(200, "Unsubscribed successfully"))
    }else{
        await Subscription.create({
            subscribers: subscriberId,
            subscribedTo: channelId
        })
        return res
            .status(200)
            .json(new ApiResponse(200, "Subscribed successfully"))
    }
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    if(!isValidObjectId(channelId)){
        throw new ApiErrors(400, "Invalid channel id")
    }
    const subscriptions = await Subscription.find({subscribedTo: channelId})
    console.log("subscriptions : ", subscriptions);
    
    const subscriberIds = subscriptions.map(sub => sub.subscribers)
    console.log("subscriberIds : ", subscriberIds);
    
    const subscribers = await User.find({_id: {$in: subscriberIds}}).select("-password -email -createdAt -updatedAt -__v")
    return res
        .status(200)
        .json(new ApiResponse(200, subscribers, "Subscribers fetched successfully"))
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
    if(!isValidObjectId(subscriberId)){
        throw new ApiErrors(400, "Invalid subscriber id")
    }
    const subscriptions = await Subscription.find({subscribers: subscriberId})
    const subscribedChannelIds = subscriptions.map(sub => sub.subscribedTo)
    const subscribedChannels = await User.find({_id: {$in: subscribedChannelIds}}).select("-password -email -createdAt -updatedAt -__v")
    return res
        .status(200)
        .json(new ApiResponse(200, subscribedChannels, "Subscribed channels fetched successfully"))
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}