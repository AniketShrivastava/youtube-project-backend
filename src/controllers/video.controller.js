import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../Utils/ApiError.js"
import { ApiResponse } from "../Utils/ApiResponse.js"
import { asyncHandler } from "../Utils/asyncHandler.js"
import { uploadOnCloudinary } from "../Utils/Cloudinary.js"

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query = '', sortBy = 'createdAt', sortType = 'desc', userId } = req.query
    //TODO: get all videos based on query, sort, pagination
    const match = {};

    if (query) {
        match.$or = [
            {
                title: { $regex: query, options: 'i' }
            },
            {
                description: { $regex: query, $options: 'i' }
            }
        ]
    }
    if (userId) {
        match.owner = userId;
    }

    const sort = {};
    sort[sortBy] = sortType === 'asc' ? 1 : -1;

    const pipeline = [
        { $match: match },
        { $sort: sort }
    ]

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10)
    }

    try {
        const result = await Video.aggregatePaginate(Video.aggregate(pipeline), options);

        return res.status(200).json(new ApiResponse(200, result, 'Videos fetched successfully'));
    } catch (error) {
        throw new ApiError(500, 'Failed to fetch videos');
    }

})

const publishVideo = asyncHandler(async (req, res) => {
    const { title, description, duration } = req.body;
    console.log(req.body)

    // console.log(videoLocalPath)
    const videoLocalPath = req.files?.videoFile[0].path
    console.log(videoLocalPath)
    const thumbnailurl = req.files?.thumbnail[0].path
    // console.log(thumbnailUrl)

    if (!title || !description || !duration || !videoLocalPath || !thumbnailurl) {
        throw new ApiError(400, "Title, description, duration, video file, and thumbnail are required");
    }


    try {
        const video = await uploadOnCloudinary(videoLocalPath, "videos");
        const thumbnailUrl = await uploadOnCloudinary(thumbnailurl, "thumbnail");

        if (!video || !thumbnailUrl) {
            throw new Error("Failed to upload video or thumbnail");
        }

        const newVideo = new Video({
            videoFile: video.url,
            thumbnail: thumbnailUrl.url,
            title,
            description,
            duration: parseInt(duration, 10),
            owner: req.user?._id,
        });

        // Save the video document
        await newVideo.save();
        return res.status(201).json(
            new ApiResponse(201, "Video Published successfully")

        )
    } catch (error) {
        return res.status(400).json(
            new ApiError(400, "Title, description, duration, video file, and thumbnail are required")

        )
    }
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    // Check if the videoId is a valid MongoDB ObjectId
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, 'Invalid video ID format');
    }

    try {
        // Find the video by ID
        const video = await Video.findById(videoId);

        // Check if the video exists
        if (!video) {
            throw new ApiError(404, 'Video not found');
        }

        // Return the video details
        return res.status(200).json(new ApiResponse(200, video, 'Video fetched successfully'));
    } catch (error) {
        // Handle errors, e.g., return an error response to the client
        console.error(error);
        throw new ApiError(500, 'Failed to fetch video');
    }
});


export {
    getAllVideos,
    publishVideo,
    getVideoById
}