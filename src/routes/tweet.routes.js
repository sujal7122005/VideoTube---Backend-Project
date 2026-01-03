import { Router } from "express";
import { createTweet, getUserTweets, updateTweet, deleteTweet } from "../controllers/tweet.controllers.js";
import { authenticateUser } from '../middlewares/auth.middlewares.js';

const tweetRouter = Router();

// unsecured routes
tweetRouter.route("/:userId").get(getUserTweets);

// secured routes
tweetRouter.route("/create-tweet").post(authenticateUser, createTweet);

tweetRouter.route("/delete-tweet/:tweetId").delete(authenticateUser, deleteTweet);

tweetRouter.route("/update-tweet/:tweetId").patch(authenticateUser, updateTweet);

export { tweetRouter };