import express from "express";
import { healthcheck } from "../controllers/healthcheck.controller.js";

const router = express.Router();

// Route to perform a healthcheck
router.get("/", healthcheck);

export default router;
