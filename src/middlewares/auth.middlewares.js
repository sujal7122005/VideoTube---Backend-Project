import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/async_Handler.js";
import { User } from "../models/users.models.js";
import { ApiErrors } from "../utils/ApiErrors.js";

const authenticateUser = asyncHandler(async (req, _, next) => {
    const token = req.cookies?.accessToken || req.headers?.authorization?.split(" ")[1];

    if (!token) {
        return next(new ApiErrors(401, "Authentication token is missing"));
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedToken?.userId).select("-password -refreshToken");

        if (!user) {
            return next(new ApiErrors(401, "Invalid access token"));
        }

        req.user = user;
        next();
    } catch (error) {
        return next(new ApiErrors(401, "Invalid access token"));
    }
});

export { authenticateUser };