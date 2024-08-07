import mongoose,{isValidObjectId} from "mongoose";
import {Like} from "../models/like.model.js"
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { asyncHandler } from "../Utils/asyncHandler.js";
import { Video } from "../models/video.model.js";
import { Comment } from "../models/comment.model.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const userId = req.user._id; // Assuming `req.user` contains the authenticated user's information

    // Check if the video exists
    const video = await Video.findById(videoId);
    if (!video) {
        return res.status(404).json(new ApiResponse(404, null, "Video not found"));
    }

    // Check if the like already exists
    const existingLike = await Like.findOne({ video: videoId, likedBy: userId });

    if (existingLike) {
        // If like exists, remove it
        await existingLike.remove();
        return res.json(new ApiResponse(200, null, "Like removed"));
    } else {
        // If like does not exist, create it
        const newLike = new Like({ video: videoId, likedBy: userId });
        await newLike.save();
        return res.json(new ApiResponse(200, newLike, "Like added"));
    }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user._id; // Assuming `req.user` contains the authenticated user's information

    // Check if the comment exists
    const comment = await Comment.findById(commentId);
    if (!comment) {
        return res.status(404).json(new ApiResponse(404, null, "Comment not found"));
    }

    // Check if the like already exists
    const existingLike = await Like.findOne({ comment: commentId, likedBy: userId });

    if (existingLike) {
        // If like exists, remove it
        await existingLike.remove();
        return res.json(new ApiResponse(200, null, "Like removed"));
    } else {
        // If like does not exist, create it
        const newLike = new Like({ comment: commentId, likedBy: userId });
        await newLike.save();
        return res.json(new ApiResponse(200, newLike, "Like added"));
    }
});
// Toggle like on tweet
const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const userId = req.user._id;
  
    const existingLike = await Like.findOne({ tweet: tweetId, likedBy: userId });
  
    if (existingLike) {
      await existingLike.remove();
      res.status(200).json({ message: 'Tweet like removed' });
    } else {
      const newLike = new Like({ tweet: tweetId, likedBy: userId });
      await newLike.save();
      res.status(201).json({ message: 'Tweet liked' });
    }
  });
  // Get all liked videos
const getLikedVideos = asyncHandler(async (req, res) => {
    const userId = req.user._id;
  
    const likedVideos = await Like.find({ likedBy: userId, video: { $exists: true } })
      .populate('video')
      .exec();
  
    res.status(200).json(likedVideos.map(like => like.video));
  });


export  {
    toggleVideoLike,
    toggleCommentLike,
    toggleTweetLike,
    getLikedVideos
}