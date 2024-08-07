import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { asyncHandler } from "../Utils/asyncHandler.js";

// Create a new tweet
const createTweet = asyncHandler(async (req, res) => {
    const { content, owner } = req.body;

    if (!content || !owner) {
        throw new ApiError(400, "Content and owner are required.");
    }

    // Validate owner
    if (!isValidObjectId(owner)) {
        throw new ApiError(400, "Invalid owner ID.");
    }

    const tweet = new Tweet({ content, owner });
    await tweet.save();

    res.status(201).json(new ApiResponse(201, tweet, "Tweet created successfully."));
});

// Get all tweets for a specific user
const getUserTweets = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user ID.");
    }

    const tweets = await Tweet.find({ owner: userId });

    if (!tweets) {
        throw new ApiError(404, "No tweets found for this user.");
    }

    res.status(200).json(new ApiResponse(200, tweets, "Tweets retrieved successfully."));
});

// Update a tweet
const updateTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const { content } = req.body;

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID.");
    }

    if (!content) {
        throw new ApiError(400, "Content is required.");
    }

    const tweet = await Tweet.findByIdAndUpdate(tweetId, { content }, { new: true });

    if (!tweet) {
        throw new ApiError(404, "Tweet not found.");
    }

    res.status(200).json(new ApiResponse(200, tweet, "Tweet updated successfully."));
});

// Delete a tweet
const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID.");
    }

    const tweet = await Tweet.findByIdAndDelete(tweetId);

    if (!tweet) {
        throw new ApiError(404, "Tweet not found.");
    }

    res.status(200).json(new ApiResponse(200, null, "Tweet deleted successfully."));
});

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
};
