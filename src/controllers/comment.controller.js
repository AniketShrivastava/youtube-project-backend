import mongoose,{isValidObjectId} from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../Utils/ApiError.js"
import {ApiResponse} from "../Utils/ApiResponse.js"
import {asyncHandler} from "../Utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Validate the videoId
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, 'Invalid video ID');
    }

    const skip = (page - 1) * limit;

    try {
        // Fetch comments for the given video ID with pagination
        const comments = await Comment.find({ video: videoId })
            .skip(skip)
            .limit(parseInt(limit));

        const totalComments = await Comment.countDocuments({ video: videoId });

        res.status(200).json(new ApiResponse(200, 'Comments retrieved successfully', {
            comments,
            totalComments,
            currentPage: page,
            totalPages: Math.ceil(totalComments / limit)
        }));
    } catch (error) {
        res.status(500).json(new ApiResponse(500, 'Internal Server Error'));
    }
});

const addComment = asyncHandler(async (req, res) => {
    console.log("add comment")
    const { videoId } = req.params;
    const { content } = req.body;
    const user = req.user.id; // Assuming user is authenticated and user id is available in req.user

    // Validate the videoId
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, 'Invalid video ID');
    }

    if (!centent) {
        throw new ApiError(400, 'Comment text is required');
    }

    const newComment = new Comment({
        video: videoId,
        content,
        user
    });

    await newComment.save();

    res.status(201).json(new ApiResponse(201, 'Comment added successfully', newComment));
});

const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { text } = req.body;
    const user = req.user.id; // Assuming user is authenticated and user id is available in req.user

    // Validate the commentId
    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, 'Invalid comment ID');
    }

    if (!text) {
        throw new ApiError(400, 'Comment text is required');
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError(404, 'Comment not found');
    }

    // Check if the comment belongs to the user
    if (comment.user.toString() !== user) {
        throw new ApiError(403, 'You are not authorized to update this comment');
    }

    comment.text = text;
    await comment.save();

    res.status(200).json(new ApiResponse(200, 'Comment updated successfully', comment));
});

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const user = req.user.id; // Assuming user is authenticated and user id is available in req.user

    // Validate the commentId
    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, 'Invalid comment ID');
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError(404, 'Comment not found');
    }

    // Check if the comment belongs to the user
    if (comment.user.toString() !== user) {
        throw new ApiError(403, 'You are not authorized to delete this comment');
    }

    await comment.remove();

    res.status(200).json(new ApiResponse(200, 'Comment deleted successfully'));
});




export{
getVideoComments,
 addComment,
 updateComment,
 deleteComment
}