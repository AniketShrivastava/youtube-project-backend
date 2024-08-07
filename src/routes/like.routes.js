import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { getLikedVideos, toggleCommentLike, toggleTweetLike, toggleVideoLike } from "../controllers/like.controller.js";

const router = Router();
router.use(verifyJwt)

router.put("/:videoId",toggleVideoLike);

router.put("/:commentId/like",toggleCommentLike);
router.post("/:tweetId", toggleTweetLike);
router.get("/videos",getLikedVideos)



export default router;
