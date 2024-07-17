import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
import dotenv from "dotenv"
import connectDb from "./db/index.js";

dotenv.config({
    path:'./env'
})

connectDb();