import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/async_Handler.js';

const healthCheck = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, "Api healthcheck done", "okk" ))
})

export { healthCheck };

// this controller is used to check the health of the api
// it returns a simple message indicating that the api is working fine