import {Router} from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { addVideoToPlaylist, createPlaylist, getPlaylistById, getUserPlaylists,  } from "../controllers/playlist.controller.js";


const router = Router()
router.use(verifyJwt)

router.route("/create").post(createPlaylist);
router.route("/:userId").get(getUserPlaylists);
router.route("/:playlistId").get(getPlaylistById);
router.route("/:playlistId/videos/:videoId").post(addVideoToPlaylist);



export default router;
