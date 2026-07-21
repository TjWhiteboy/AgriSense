const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // Log the error for server-side troubleshooting

    // Default error message and status code
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message || 'Internal Server Error';

    // Customize error response based on specific error types (example)
    if (err.name === 'ValidationError') {
        statusCode = 400; // Bad Request
    }

    res.status(statusCode).json({
        success: false,
        message: message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = errorHandler;
