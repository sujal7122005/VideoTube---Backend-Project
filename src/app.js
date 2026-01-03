import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from "dotenv";

const app = express();

dotenv.config({
    path: ".env"
}); 

//app.use() is used for setting up the predefined middlewares in express

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

//common middlewares

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());

// importing routes
import { router } from './routes/healthcheck.routes.js';

import { router_2 } from './routes/user.routes.js';

import { videoRouter } from './routes/video.routes.js';

import { tweetRouter } from './routes/tweet.routes.js';

import { subscriptionrouter } from './routes/subscription.routes.js';

import { Playlistrouter } from './routes/playlist.routes.js';

import { likeRouter } from './routes/like.routes.js';

import { commentRouter } from './routes/comment.routes.js';

// all routes
app.use("/api/v1/healthcheck", router);
app.use("/api/v1/users", router_2);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/tweets", tweetRouter);
app.use("/api/v1/subscriptions", subscriptionrouter);
app.use("/api/v1/playlists", Playlistrouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/comments", commentRouter);

    
export { app };