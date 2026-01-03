class ApiErrors extends Error {
    constructor(statuscode, message = "Something went wrong", error = [], stack = "", data) {
        super(message);
        this.statuscode = statuscode;
        this.message = message;
        this.Success = false;
        this.data = data;
        this.error = error;
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export { ApiErrors };