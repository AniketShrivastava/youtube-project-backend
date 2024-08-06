// controllers/playlistController.js
import mongoose, { isValidObjectId } from 'mongoose';
import { Playlist } from '../models/playlist.model.js';
import { ApiError } from '../Utils/ApiError.js';
import { ApiResponse } from '../Utils/ApiResponse.js';
import { asyncHandler } from '../Utils/asyncHandler.js';

const createPlaylist = asyncHandler(async (req, res) => {
    try {
        const { name, description } = req.body;
        const owner = req.user.id; // Assuming user is authenticated and user id is available in req.user
    //    console.log(name,description,owner)
        if (!name || !description) {
            throw new ApiError(400, 'Name and description are required');
        }

        const newPlaylist = new Playlist({
            name,
            description,
            owner
        });

        await newPlaylist.save();

        res.status(201).json(new ApiResponse(201, 'Playlist created successfully', newPlaylist));
    } catch (error) {
        
            res.status(500).json(new ApiResponse(500, 'Internal Server Error'));
        
    }
});

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    
    // Validate the userId
    if (!isValidObjectId(userId)) {
        return res.status(400).json(new ApiResponse(400, 'Invalid user ID'));
    }

    try {
        // Fetch playlists for the given user ID
        const playlists = await Playlist.find({ owner: userId });

        if (!playlists.length) {
            return res.status(404).json(new ApiResponse(404, 'No playlists found for this user', []));
        }

        res.status(200).json(new ApiResponse(200,playlists, 'User playlists retrieved successfully'));
    } catch (error) {
        res.status(500).json(new ApiResponse(500, 'Internal Server Error'));
    }
});

const getPlaylistById = async (req, res, next) => {
    const { playlistId } = req.params;

    console.log(`Request received for playlistId: ${playlistId}`); // Debugging line

    try {
        // Validate the playlist ID
        if (!playlistId) {
            return res.status(400).json(new ApiResponse(400, null, 'Playlist ID is required'));
        }

        // Fetch the playlist by ID and populate the videos
        const playlists = await Playlist.findById(playlistId);

        console.log(`Fetched playlist: ${playlists}`); // Debugging line

        // Check if the playlist exists
        if (!playlists) {
            return res.status(404).json(new ApiResponse(404, null, 'Playlist not found'));
        }

        // Return the successful response
        res.status(200).json(new ApiResponse(200, playlists, 'Playlist fetched successfully'));
    } catch (error) {
        console.error(`Error fetching playlist: ${error}`); // Debugging line
        next(error);
    }
};
// Add a video to a playlist
const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;

    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid playlist or video ID");
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    if (playlist.videos.includes(videoId)) {
        throw new ApiError(400, "Video already in playlist");
    }

    playlist.videos.push(videoId);
    await playlist.save();

    res.status(200).json(new ApiResponse(200, "Video added to playlist successfully", playlist));
});


export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist
};
