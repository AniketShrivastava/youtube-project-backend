import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"

const app = express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
Credential:true
}))
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


// Routes

import UserRouter from"./routes/user.routes.js";
import VideoRouter from "./routes/video.routes.js";
import  PlaylistRouter  from "./routes/playlist.routes.js";
import CommentRouter from "./routes/comment.routes.js";
import LikeRouter from "./routes/like.routes.js";
import SubscriptionRouter from "./routes/subscription.routes.js";
import TweetRouter from "./routes/tweet.routes.js"


app.use("/api/v1/users", UserRouter);
app.use("/api/v1/videos", VideoRouter);
app.use("/api/v1/playlist",PlaylistRouter);
app.use("/api/v1/video",CommentRouter);
app.use("/api/v1/like",LikeRouter);
app.use("/api/v1/subscriptions",SubscriptionRouter);
app.use("/api/v1/tweets",TweetRouter)



export {app}