import mongoose, {Schema} from "mongoose";
import { User } from "./users.models.js";
import { Video } from "./videos.models.js";
import { Tweet } from "./tweet.models.js";
import { Comment } from "./comment.models.js";

const likeSchema = new Schema({
    likedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    video: { type: Schema.Types.ObjectId, ref: "Video", default: null },
    tweet: { type: Schema.Types.ObjectId, ref: "Tweet", default: null },
    comment: { type: Schema.Types.ObjectId, ref: "Comment", default: null },
},
{
    timestamps: true
});

const Like = mongoose.model("Like", likeSchema);

export { Like };