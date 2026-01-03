import mongoose, { isValidObjectId } from "mongoose"
import {Comment} from "../models/comment.models.js"
import {User} from "../models/users.models.js"
import {ApiErrors} from "../utils/ApiErrors.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/async_Handler.js"
import { Video } from "../models/videos.models.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query
    if (!isValidObjectId(videoId)) {
        throw new ApiErrors(400, "Invalid video ID")
    }
    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiErrors(404, "Video not found")
    }
    const query = Comment.find({video: videoId}).populate("commentedBy", "name email")
    const total = await Comment.countDocuments({video: videoId})
    const comments = await query
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .sort({createdAt: -1})
    return res
        .status(200)
        .json(new ApiResponse(200, {
            comments,
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(total / limit)
        }, "Comments fetched successfully"))

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const {videoId} = req.params
    const {content} = req.body
    if (!isValidObjectId(videoId)) {
        throw new ApiErrors(400, "Invalid video ID")
    }
    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiErrors(404, "Video not found")
    }
    const comment = await Comment.create({
        content,
        commentedBy: req.user._id,
        video: videoId
    })
    return res
        .status(201)
        .json(new ApiResponse(201, comment, "Comment added successfully"))    
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const {commentId} = req.params
    const {content} = req.body
    if (!isValidObjectId(commentId)) {
        throw new ApiErrors(400, "Invalid comment ID")
    }
    const comment = await Comment.findById(commentId)
    if (!comment) {
        throw new ApiErrors(404, "Comment not found")
    }
    if (comment.commentedBy.toString() !== req.user._id.toString()) {
        throw new ApiErrors(403, "You are not authorized to update this comment")
    }
    comment.content = content || comment.content
    await comment.save()
    return res
        .status(200)
        .json(new ApiResponse(200, comment, "Comment updated successfully"))
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const {commentId} = req.params
    if (!isValidObjectId(commentId)) {
        throw new ApiErrors(400, "Invalid comment ID")
    }
    const comment = await Comment.findById(commentId)
    if (!comment) {
        throw new ApiErrors(404, "Comment not found")
    }
    if (comment.commentedBy.toString() !== req.user._id.toString()) {
        throw new ApiErrors(403, "You are not authorized to delete this comment")
    }
    const deletedComment = await comment.deleteOne()
    return res
        .status(200)
        .json(new ApiResponse(200, deletedComment, "Comment deleted successfully"))
})

export 
{
    getVideoComments, 
    addComment, 
    updateComment,
    deleteComment
}
