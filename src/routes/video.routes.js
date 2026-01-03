import { Router } from "express";
import { getAllVideos, publishAVideo, getVideoById, updateVideoDetails, deleteVideo, togglePublishStatus } from "../controllers/video.controllers.js";
import { authenticateUser } from '../middlewares/auth.middlewares.js';
import { upload } from "../middlewares/multer.middleware.js";

const videoRouter = Router();

// unsecured routes
videoRouter.route("/").get(getAllVideos);

videoRouter.route("/getVideoById/:videoId").get(getVideoById);


// secured routes
videoRouter.route("/publish").post(authenticateUser, upload.fields([
    {
    name: 'videoFile',
    maxCount: 1
    },
    {
    name: 'thumbnail',
    maxCount: 1
    }
]), publishAVideo);

videoRouter.route("/updateVideoDetails/:videoId").patch(authenticateUser, upload.single('thumbnail'), updateVideoDetails);

videoRouter.route("/deleteVideo/:videoId").delete(authenticateUser, deleteVideo);

videoRouter.route("/toggle-publish/:videoId").post(authenticateUser, togglePublishStatus);



export { videoRouter };