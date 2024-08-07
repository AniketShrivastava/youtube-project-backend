import { ApiResponse } from "../Utils/ApiResponse.js";
import { asyncHandler } from "../Utils/asyncHandler.js";

const healthcheck = asyncHandler(async (req, res) => {
    // Respond with a 200 status and a simple message
    res.status(200).json(new ApiResponse(200, null, "OK"));
});

export {
    healthcheck
};
