const asyncHandler = (request_handler) => {
    return (req, res, next) => {
        Promise.resolve(request_handler(req, res, next)).catch(err => next(err));
    }
}

export { asyncHandler };
    
// we use this asyncHandler to avoid try catch block in each controller function and also we get some request in async way so to handle error we use this function