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
        throw new ApiError(400, 'Invalid user ID');
    }

    try {
        // Fetch playlists for the given user ID
        const playlists = await Playlist.find({ owner: userId });

        if (!playlists.length) {
            return res.status(404).json(new ApiResponse(404, 'No playlists found for this user'));
        }

        res.status(200).json(new ApiResponse(200, 'User playlists retrieved successfully', playlists));
    } catch (error) {
        res.status(500).json(new ApiResponse(500, 'Internal Server Error'));
    }
});


export {
    createPlaylist,
    getUserPlaylists
};
