class ApiResponse {
    constructor(statuscode, data, message = "Success") {
        this.statuscode = statuscode;
        this.message = message;
        this.data = data;
        this.Success = statuscode < 400
    }   
}

export { ApiResponse };

// we use this ApiResponse class to send response in a structured way
// it is a standard way to send response