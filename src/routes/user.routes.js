import { Router } from "express";
import { registerUser, logoutUser, loginUser, refreshAccessToken, changeCurrentPassword, getCurrentUser, updateUserDetails, updateAvatar, updateCoverImage, getUserChannelProfile, userWatchHistory } from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
import { authenticateUser } from '../middlewares/auth.middlewares.js';

const router_2 = Router();

// unsecured routes

router_2.post("/register", upload.fields([
    {
        name: 'avatar',
        maxCount: 1
    },{
        name: 'coverImage',
        maxCount: 1
    }
]), registerUser);

router_2.route("/login").post(loginUser); // to be implemented

router_2.route("/refresh-token").post(refreshAccessToken); 


// secured routes
// authenticateUser middleware will verify the user before allowing logout

router_2.route("/logout").post(authenticateUser, logoutUser);

router_2.route("/change-password").post(authenticateUser, changeCurrentPassword);

router_2.route("/current-user").get(authenticateUser, getCurrentUser);

router_2.route("/update-details").patch(authenticateUser, updateUserDetails);

router_2.route("/update-avatar").patch(authenticateUser, upload.single('avatar'), updateAvatar);

router_2.route("/update-cover-image").patch(authenticateUser, upload.single('coverImage'), updateCoverImage);

router_2.route("/channel/:username").get(authenticateUser, getUserChannelProfile); 

router_2.route("/user-watch-history").get(authenticateUser, userWatchHistory); 

export { router_2 };