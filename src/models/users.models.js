import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config({
    path: ".env"
});

const userSchema = new Schema({
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    fullName: { type: String, required: true, lowercase: true , trim: true },
    password: { type: String, required: [true, "password is required"] },
    avatar: { type: String },
    coverImage: { type: String },
    watchHistory: [{ type: Schema.Types.ObjectId, ref: "Video" }],
    refreshTokens: { type: String }
},
{
    timestamps: true
}
);

// pre-save hook to hash password
// new mongoose version ma next() no use karvo ni jarur nathi
userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        return ;
    }
    this.password = await bcrypt.hash(this.password, 10);
    
})

// method to compare password
userSchema.methods.comparePassword = async function(candidatePassword){
    return await bcrypt.compare(candidatePassword, this.password);
}

// method to generate JWT(refresh and access tokens)

userSchema.methods.generateAccessTokens = function(){
    return jwt.sign(
        {
            userId: this._id,
            username: this.username,
            email: this.email
        },
        process.env.JWT_ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRES }    
    )
}

// method to generate refresh token and refresh token will be stored in db as well 
userSchema.methods.generateRefreshTokens = function(){
    return jwt.sign(
        {
            userId: this._id,
        },
        process.env.JWT_REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRES }
    )
}


const User = mongoose.model("User", userSchema);

export { User };