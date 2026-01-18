const sendSuccess = (res, data, message = "OK", statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

const sendError = (res, message, statusCode = 500, details) => {
  res.status(statusCode).json({
    success: false,
    message,
    details,
  });
};

export { sendSuccess, sendError };

