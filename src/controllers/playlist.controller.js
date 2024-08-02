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



export {
    createPlaylist,
    getUserPlaylists
};
