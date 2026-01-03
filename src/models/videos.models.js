import mongoose, { Schema } from "mongoose";
import { User } from "./users.models.js";

import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    videoFile: { type: String, required: true },
    thumbnail: { type: String, required: true },
    views: { type: Number, default: 0 },
    owner : { type: Schema.Types.ObjectId, ref: "User", required: true },
    ispublished: { type: Boolean, default: false },
    // publicId: { type: String, required: true },
},
{
    timestamps: true
});

videoSchema.plugin(mongooseAggregatePaginate);

const Video = mongoose.model("Video", videoSchema);

export { Video };