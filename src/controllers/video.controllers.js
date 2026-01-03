import { asyncHandler } from '../utils/async_Handler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiErrors } from '../utils/ApiErrors.js';
import { uploadToCloudinary, uploadToCloudinaryVideo, deleteFromCloudinary } from '../utils/cloudinary.js';
import dotenv from 'dotenv';
import { Video } from '../models/videos.models.js';



dotenv.config({
    path: '../.env'
});



const getAllVideos = asyncHandler(async (req, res) => {
        // const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
    
        const publishedTotalVideos = await Video.find({ ispublished: true});
        console.log("publishedTotalVideos :",publishedTotalVideos);
        let filter = { ispublished: true };
        if (query) {
            filter.$or = [
                { title: { $regex: query, $options: "i" } },
                { description: { $regex: query, $options: "i" } }
            ];
        }
        if (userId) {
            filter.owner = userId;
        }
        let sort = {};
        if (sortBy) {
            sort[sortBy] = sortType === 'desc' ? -1 : 1;
        } else {
            sort.createdAt = -1; // default sort by createdAt descending
        }
        const options = {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            sort: sort
        }
        const aggregate = Video.aggregate().match(filter);
        const videos = await Video.aggregatePaginate(aggregate, options);

        return res
            .status(200)
            .json(new ApiResponse(200, { videos, totalPublishedVideos: publishedTotalVideos.length }, "Videos fetched successfully"))
});
// getAllVideos sikhavanu baki chhe pratik pasethi 



const publishAVideo = asyncHandler(async (req, res) => {

    console.log(req.body);
    
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video

    if (!title || !description) {
        throw new ApiErrors(400, 'Title and description are required')
    }
    console.log("req.files : ",req.files);
    
    const videoFilepath = req.files?.videoFile[0].path;

    const thumbnailFilepath = req.files?.thumbnail[0].path;
    
    console.log("videoFilepath :",videoFilepath);

    console.log("thumbnailFilepath :",thumbnailFilepath);
    
    if (!videoFilepath || !thumbnailFilepath) {
        throw new ApiErrors(400, 'Video and thumbnail files are required')
    }

    let videoFile, thumbnailFile;

    try {
         videoFile = await uploadToCloudinaryVideo(videoFilepath);
    } catch (error) {
        throw new ApiErrors(500, 'Error uploading video to Cloudinary')
    }
    
    console.log("video file :", videoFile);
    
    // Check if video upload was successful
    if (!videoFile || !videoFile.url) {
        throw new ApiErrors(500, 'Video upload failed - no URL returned from Cloudinary')
    }
    
    try {
         thumbnailFile = await uploadToCloudinary(thumbnailFilepath);
    } catch (error) {
        throw new ApiErrors(500, 'Error uploading thumbnail to Cloudinary')
    }
    console.log("thumbnail file :", thumbnailFile);

    // Check if thumbnail upload was successful
    if (!thumbnailFile || !thumbnailFile.url) {
        throw new ApiErrors(500, 'Thumbnail upload failed - no URL returned from Cloudinary')
    }

    const video = await Video.create({
        title,
        description,
        videoFile: videoFile.url,
        thumbnail: thumbnailFile.url,
        owner: req.user._id
    })

    return res
        .status(201)
        .json(new ApiResponse(201, video, "Video published successfully"))
});

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiErrors(404, 'Video not found')
    }

    video.views += 1
    await video.save()

    return res
        .status(200)
        .json(new ApiResponse(200, video, "Video fetched successfully"))
});

const updateVideoDetails = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail
    const { title, description } = req.body
    console.log("req.file :",req.file);

    const thumbnailFilepath = req.file?.path;

    if (!thumbnailFilepath) {
        throw new ApiErrors(400, 'Thumbnail file is required')
    }

    const thumbnailFile = await uploadToCloudinary(thumbnailFilepath)

    if (!thumbnailFile) {
        throw new ApiErrors(400, 'Failed to upload thumbnail')
    }

    const video = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                title,
                description,
                thumbnail: thumbnailFile.url
            }
        },
        { new: true }
    )

    return res
        .status(200)
        .json(new ApiResponse(200, video, "Video details updated successfully"))
});

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
    const video = await Video.findByIdAndDelete(videoId)

    if (!video) {
        throw new ApiErrors(404, 'Video not found')
    }

    const deleteVideo = await deleteFromCloudinary(video.videoFile);
    const deleteThumbnail = await deleteFromCloudinary(video.thumbnail);

    console.log("deleted video : ",deleteVideo);
    console.log("deleted thumbnail : ",deleteThumbnail);

    return res
        .status(200)
        .json(new ApiResponse(200, video, "Video deleted successfully"))
});

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiErrors(404, 'Video not found')
    }
    video.ispublished = !video.ispublished
    await video.save()
    return res
        .status(200)
        .json(new ApiResponse(200, video, "Video publish status toggled successfully"))
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideoDetails,
    deleteVideo,
    togglePublishStatus
}
