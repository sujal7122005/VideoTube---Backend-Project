import { Router } from "express";
import { getVideoComments, addComment, updateComment, deleteComment } from "../controllers/comment.controllers.js";
import { authenticateUser } from "../middlewares/auth.middlewares.js";

const commentRouter = Router();

commentRouter.get("/get-video-comments/:videoId", getVideoComments);
commentRouter.post("/add-comment/:videoId", authenticateUser, addComment);
commentRouter.patch("/update-comment/:commentId", authenticateUser, updateComment);
commentRouter.delete("/delete-comment/:commentId", authenticateUser, deleteComment);

export { commentRouter };