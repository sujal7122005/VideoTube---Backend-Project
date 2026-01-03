import mongoose, { isValidObjectId } from "mongoose"
import {Playlist} from "../models/playlist.models.js"
import {User} from "../models/users.models.js"
import {ApiErrors} from "../utils/ApiErrors.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/async_Handler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body

    //TODO: create playlist
    const playlist = await Playlist.create({
        name,
        description,
        owner: req.user._id
    })

    return res
        .status(200)
        .json(new ApiResponse(200, playlist, "Playlist created successfully"))    
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists
    if(!isValidObjectId(userId)){
        throw new ApiErrors(400, "Invalid user id")
    }
    const playlists =  await Playlist.find({owner: userId}).populate("videos").populate("owner", "-password -email -createdAt -updatedAt -__v")
    return res
        .status(200)
        .json(new ApiResponse(200, playlists, "User playlists fetched successfully"))
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
    if(!isValidObjectId(playlistId)){
        throw new ApiErrors(400, "Invalid playlist id")
    }
    const playlist = await Playlist.findById(playlistId).populate("videos").populate("owner", "-password -email -createdAt -updatedAt -__v")
    if(!playlist){
        throw new ApiErrors(404, "Playlist not found")
    }
    return res
        .status(200)
        .json(new ApiResponse(200, playlist, "Playlist fetched successfully"))
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    if(!isValidObjectId(playlistId)){
        throw new ApiErrors(400, "Invalid playlist id")
    }
    if(!isValidObjectId(videoId)){
        throw new ApiErrors(400, "Invalid video id")
    }
    const playlist = await Playlist.findById(playlistId)
    if(!playlist){
        throw new ApiErrors(404, "Playlist not found")
    }
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $push: { videos: videoId }
        },
        { new: true }
    ).populate("videos").populate("owner", "-password -email -createdAt -updatedAt -__v")

    return res
        .status(200)
        .json(new ApiResponse(200, updatedPlaylist, "Video added to playlist successfully"))
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist
    if(!isValidObjectId(playlistId)){
        throw new ApiErrors(400, "Invalid playlist id")
    }
    if(!isValidObjectId(videoId)){
        throw new ApiErrors(400, "Invalid video id")
    }
    const playlist = await Playlist.findById(playlistId)
    if(!playlist){
        throw new ApiErrors(404, "Playlist not found")
    }
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $pull: { videos: videoId }
        },
        { new: true }
    ).populate("videos").populate("owner", "-password -email -createdAt -updatedAt -__v")

    return res
        .status(200)
        .json(new ApiResponse(200, updatedPlaylist, "Video removed from playlist successfully"))
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
    if(!isValidObjectId(playlistId)){
        throw new ApiErrors(400, "Invalid playlist id")
    }
    const playlist = await Playlist.findById(playlistId)
    if(!playlist){
        throw new ApiErrors(404, "Playlist not found")
    }
    const deletedPlaylist = await Playlist.deleteOne({_id: playlistId})
    return res
        .status(200)
        .json(new ApiResponse(200, deletedPlaylist, "Playlist deleted successfully"))
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist
    if(!isValidObjectId(playlistId)){
        throw new ApiErrors(400, "Invalid playlist id")
    }
    const playlist = await Playlist.findById(playlistId)
    if(!playlist){
        throw new ApiErrors(404, "Playlist not found")
    }
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            name,
            description
        },
        { new: true }
    ).populate("videos").populate("owner", "-password -email -createdAt -updatedAt -__v")
    return res
        .status(200)
        .json(new ApiResponse(200, updatedPlaylist, "Playlist updated successfully"))
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}
