import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { addComment, getVideoComments } from "../controllers/comment.controller.js";

const router = Router();
router.use(verifyJwt)

router.route("/:videoId")
.post(addComment)
.get(getVideoComments)

export default router;