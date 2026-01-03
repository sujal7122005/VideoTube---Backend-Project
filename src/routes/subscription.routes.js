import { Router } from "express";
import { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels } from "../controllers/subscription.controllers.js";
import { authenticateUser } from "../middlewares/auth.middlewares.js";

const subscriptionrouter = Router();

subscriptionrouter.post("/toggle-subscription/:channelId", authenticateUser, toggleSubscription);
subscriptionrouter.get("/subscribers/:channelId", authenticateUser, getUserChannelSubscribers);
subscriptionrouter.get("/subscribed-channels/:subscriberId", authenticateUser, getSubscribedChannels);

export { subscriptionrouter };