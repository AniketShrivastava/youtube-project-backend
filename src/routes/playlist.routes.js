import {Router} from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { addVideoToPlaylist, createPlaylist, deletePlaylist, getPlaylistById, getUserPlaylists, removeVideoFromPlaylist, updatePlaylist,  } from "../controllers/playlist.controller.js";


const router = Router()

router.use(verifyJwt)


router.route("/create").post(createPlaylist);

router.route("/:playlistId")
    .get(getPlaylistById)
    .put(updatePlaylist)
    .delete(deletePlaylist);



router.route("/:userId").get(getUserPlaylists)
router.route("/:playlistId/videos/:videoId").post(addVideoToPlaylist);
// Route to remove a video from a playlist
router.route('/:playlistId/videos/:videoId').delete(removeVideoFromPlaylist);




export default router;
