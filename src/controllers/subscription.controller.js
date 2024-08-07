import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { asyncHandler } from "../Utils/asyncHandler.js";

// Toggle Subscription
const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    const subscriberId = req.user._id; // Assuming `req.user` contains the logged-in user's info

    if (!mongoose.isValidObjectId(channelId) || !mongoose.isValidObjectId(subscriberId)) {
        throw new ApiError(400, "Invalid user or channel ID");
    }

    // Check if the subscription already exists
    const existingSubscription = await Subscription.findOne({
        subscriber: subscriberId,
        channel: channelId
    });

    if (existingSubscription) {
        // If subscription exists, remove it
        await Subscription.deleteOne({
            subscriber: subscriberId,
            channel: channelId
        });
        res.status(200).json(new ApiResponse(200, { unsubscribed: true }));
    } else {
        // If subscription does not exist, create it
        await Subscription.create({
            subscriber: subscriberId,
            channel: channelId
        });
        res.status(200).json(new ApiResponse(200, { subscribed: true }));
    }
});

// Get User Channel Subscribers
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!mongoose.isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel ID");
    }

    const subscriptions = await Subscription.find({ channel: channelId }).populate('subscriber', 'name email'); // Adjust fields as needed
    const subscribers = subscriptions.map(sub => sub.subscriber);

    res.status(200).json(new ApiResponse(200, subscribers));
});

// Get Subscribed Channels
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const subscriberId = req.user._id; // Assuming `req.user` contains the logged-in user's info

    if (!mongoose.isValidObjectId(subscriberId)) {
        throw new ApiError(400, "Invalid user ID");
    }

    const subscriptions = await Subscription.find({ subscriber: subscriberId }).populate('channel', 'name'); // Adjust fields as needed
    const channels = subscriptions.map(sub => sub.channel);

    res.status(200).json(new ApiResponse(200, channels));
});

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}
