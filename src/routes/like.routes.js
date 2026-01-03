import { Router } from "express";
import { toggleVideoLike, toggleCommentLike, toggleTweetLike, getLikedVideos } from "../controllers/like.controllers.js";
import { authenticateUser } from "../middlewares/auth.middlewares.js";

const likeRouter = Router();

likeRouter.post("/video-like-toggle/:videoId", authenticateUser, toggleVideoLike);
likeRouter.post("/comment/:commentId/toggle", authenticateUser, toggleCommentLike);
likeRouter.post("/tweet-toggle/:tweetId", authenticateUser, toggleTweetLike);
likeRouter.get("/get-liked-videos", authenticateUser, getLikedVideos);

export { likeRouter };